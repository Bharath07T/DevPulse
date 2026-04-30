import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import '../styles/ReviewDetail.css'

export default function ReviewDetail() {
    const { id } = useParams();
    const [review, setReview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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

    const getAiReview = async () => {
        setLoading(true);
        setError('');

        try{
            const aiResult = await axiosInstance.post(`/reviews/${id}/aireview`);
            setReview(aiResult.data);
        }catch(error){
            setError(error.response?.data?.message || 'Something went wrong. Try again later');
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        getReviewById();
    } ,[ id ])

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
                disabled={loading}
            >
                {loading ? 'Generating...' : '✦ Generate AI Review'}
            </button>
            </div>
        )}

        </div>
    )}
</div>
  )
}
/*
<div>
      {loading ?
        (
            <p>loading...</p>
        ) : error ? (
            <p>{ error }</p>
        ) : !review ? (
            <p>Review not found</p>
        ) : (
            <div className='rd-page'>
                <p>{ review.language }</p>
                <p>{ review.code }</p>

                {review.aiReview?.score != null ? (
                    <>
                        <p>{ review.aiReview.score }</p>

                        {review.aiReview.bugs.length > 0 ? (
                            <>
                            {review.aiReview.bugs.map((bug, index) => (
                                <div key={ index }>
                                    <p>{ bug.lineNo }</p>
                                    <p>{ bug.severity }</p>
                                    <p>{ bug.message }</p>
                                </div>
                            ))}
                            </>
                        ) : (
                            <p>No bugs for this code</p>
                        )}

                        {review.aiReview.suggestions.length > 0 ? (
                            <>
                            {review.aiReview.suggestions.map((suggestion, index) => (
                                <p key={ index }>{ suggestion }</p>
                            ))}
                            </>
                        ) : (
                            <p>No suggestions for this code</p>
                        )}
                    </>
                ) : (
                    <div className='rd-pending-box'>
                        <p className='rd-pending-text'>AI Review is yet to be triggered</p>
                        <button className='rd-generate-btn' onClick={ getAiReview } disabled = {loading}>{loading ? 'Generating...' : '✦ Generate AI Review'}</button>
                    </div>
                )}

            </div>
        )
      }

    </div> */