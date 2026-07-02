import Groq from 'groq-sdk';
import env from '../config/env.js';

const groq = new Groq({ apiKey : env.ApiKey });

const generateAiReview = async (review) => {
    try{
        const completion = await groq.chat.completions.create({
        model : "qwen/qwen3-27b",
        messages : [
            {
                role : "system",
                content : `You are a code review assistant. 
                    Analyze the given code and return ONLY a JSON object with no extra text, 
                    no markdown, no backticks. 
                    The JSON must follow this exact structure:
                    {
                        "bugs": [
                            {
                                "lineNo": <number>,
                                "severity": "low" | "medium" | "high",
                                "message": <string>
                            }
                        ],
                        "score": <number between 0-100>,
                        "suggestions": [<string>]
                    }`
            },
            {
                role : "user",
                content : `Review this ${review.language} code: \n\n${review.code}`
            }
        ],
        temperature : 0.3
    });

    const rawText = completion?.choices?.[0]?.message?.content || "";
    const cleanedResult = rawText.replace(/```json|```/g, "")
                                 .replace(/<think>[\s\S]*?<\/think>/g, "")
                                 .trim();
    let aiResult;

    try{
        aiResult = JSON.parse(cleanedResult);
    }catch{
        aiResult = {
            bugs : [],
            score : 0,
            suggestions : ["AI response parsing failed"]
        }
    }

    return aiResult;

    }catch(error){
        throw error;
    }
}

export default generateAiReview;