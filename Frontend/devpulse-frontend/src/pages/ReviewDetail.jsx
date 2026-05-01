import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import '../styles/ReviewDetail.css'

export default function ReviewDetail() {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    const [commentsError, setCommentsError] = useState('');
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);

    const navigate = useNavigate();

    const getReviewById = async () => {
        try{
            const retrievedReview = await axiosInstance.get(`/reviews/${id}`);
            setReview(retrievedReview.data);
        }catch(error){
            setError(error.response?.data?.message || 'Something went wrong. Try again later');
        }finally{
            setLoading(false);
        }
    }
    
    const getAllComments = async () => {
        try{
            const retrievedComments = await axiosInstance.get(`/reviews/${id}/comments`);
            setComments(retrievedComments.data);
        }catch(error){
            setCommentsError(error.response?.data?.message || 'Something went wrong. Try again later');
        }
    }

    const getAiReview = async () => {
        setAiLoading(true);
        setError('');

        try{
            const aiResult = await axiosInstance.post(`/reviews/${id}/aireview`);
            setReview(aiResult.data);
        }catch(error){
            setError(error.response?.data?.message || 'Something went wrong. Try again later');
        }finally{
            setAiLoading(false);
        }
    }

    useEffect(() => {
        getReviewById();
        getAllComments();
    } ,[ id ]);

  return (
    <div className='rd-page'>
    {loading ? (
        <p className='rd-center'>Loading...</p>
    ) : error ? (
        <p className='rd-error'>{error}</p>
    ) : !review ? (
        <p className='rd-center'>Review not found</p>
    ) : (
        <div className='rd-container'>

        <div className='rd-toprow'>
            <span className='rd-lang'>{review.language}</span>
            <span className={review.status === 'reviewed' ? 'rd-status-reviewed' : 'rd-status-pending'}>
            {review.status}
            </span>
        </div>

        <div className='rd-code-card'>
            <p className='rd-code-label'>Code</p>
            <pre className='rd-code-text'>{review.code}</pre>
        </div>

        {review.aiReview?.score != null ? (
            <>
            <div className='rd-score-card'>
                <p className='rd-score-label'>AI Score</p>
                <div>
                <p className={`rd-score-value ${
                    review.aiReview.score >= 80 ? 'score-high'
                    : review.aiReview.score >= 50 ? 'score-mid'
                    : 'score-low'
                }`}>
                    {review.aiReview.score}
                </p>
                <p className='rd-score-sub'>out of 100</p>
                </div>
            </div>

            <p className='rd-section-title'>Bugs</p>
            {review.aiReview.bugs.length > 0 ? (
                <div className='rd-bugs-list'>
                {review.aiReview.bugs.map((bug, index) => (
                    <div key={index} className={`rd-bug-card severity-${bug.severity}`}>
                    <div className='rd-bug-meta'>
                        <span className='rd-bug-line'>Line {bug.lineNo}</span>
                        <span className='rd-bug-severity'>{bug.severity}</span>
                    </div>
                    <p className='rd-bug-message'>{bug.message}</p>
                    </div>
                ))}
                </div>
            ) : (
                <p className='rd-empty'>No bugs found for this code.</p>
            )}

            <p className='rd-section-title'>Suggestions</p>
            {review.aiReview.suggestions.length > 0 ? (
                <div className='rd-suggestions-list'>
                {review.aiReview.suggestions.map((suggestion, index) => (
                    <p key={index} className='rd-suggestion-item'>{suggestion}</p>
                ))}
                </div>
            ) : (
                <p className='rd-empty'>No suggestions for this code.</p>
            )}
            </>
        ) : (
            <div className='rd-pending-box'>
            <p className='rd-pending-text'>AI Review is yet to be triggered</p>
            <p className='rd-pending-sub'>Click below to generate your AI review</p>
            <button
                className='rd-generate-btn'
                onClick={getAiReview}
                disabled={aiLoading}
            >
                {aiLoading ? 'Generating...' : '✦ Generate AI Review'}
            </button>
            </div>
        )}

        <div className='rd-comments-section'>
        <p className='rd-section-title'>Comments</p>
        {comments.length > 0 ? (
            <div className='rd-comments-list'>
            {comments.map((comment, index) => (
                <div key={comment._id} className='rd-comment-card'>
                <p className='rd-comment-author'>{comment.authorName}</p>
                <p className='rd-comment-text'>{comment.text}</p>
                <p className='rd-comment-date'>{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
            ))}
            </div>
        ) : (
            <p className='rd-empty'>No comments yet.</p>
        )}
        </div>

        {review.status === 'pending' && (
        <button className='rd-room-btn' onClick={() => navigate(`/room/${id}`)}>
             Enter Room
        </button>
        )}

        </div>
    )}
</div>
  )
}