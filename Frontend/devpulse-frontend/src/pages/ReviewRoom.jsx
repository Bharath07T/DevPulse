import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/ReviewRoom.css';

export default function ReviewRoom() {
  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [selectedLine, setSelectedLine] = useState(1);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isAuthor = review?.author?._id === user?._id;
  const isAiReviewDone = review?.aiReview?.score != null;
  const codeLen = review?.code?.split('\n').length ?? 0;

  useEffect(() => {
    const socket = io('https://devpulse-production-544c.up.railway.app');
    socket.emit('join-room', id);

    socket.on('comment-added', (newComment) => {
      setComments(prev => [...prev, newComment]);
    });

    socket.on('ai-review-done', (aiResult) => {
      setReview(prev => ({ ...prev, aiReview: aiResult }));
    });

    socket.on('review-ended', () => {
      navigate(`/review/${id}`);
    });

    socketRef.current = socket;

    return () => {
      socket.emit('leave-room', id);
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewRes, commentRes] = await Promise.all([
          axiosInstance.get(`/reviews/${id}`),
          axiosInstance.get(`/reviews/${id}/comments`)
        ]);
        setReview(reviewRes.data);
        setComments(commentRes.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load review');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const postComment = async () => {
    if (!commentText.trim()) return;

    if (selectedLine > codeLen) {
      setError('Line number exceeds total lines in code');
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/reviews/${id}/comments`,
        { text: commentText, lineNumber: selectedLine }
      );
      socketRef.current.emit('new-comment', response.data);
      setCommentText('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post comment');
    }
  };

  const endReview = async () => {
    try {
      await axiosInstance.patch(`/reviews/${id}/status`, { status: 'reviewed' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to end review');
    }
  };

  const leaveRoom = () => {
    socketRef.current.emit('leave-room', id);
    navigate(`/review/${id}`);
  };

  const getAiReview = async () => {
    setAiLoading(true);
    try {
      const result = await axiosInstance.post(`/reviews/${id}/aireview`);
      setReview(prev => ({ ...prev, aiReview: result.data.aiReview }));
    } catch (error) {
      setError(error.response?.data?.message || 'AI review failed');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <p className='rr-empty' style={{ padding: '2rem' }}>Loading...</p>;
  if (error && !review) return <p className='rr-error' style={{ padding: '2rem' }}>{error}</p>;
  if (!review) return <p className='rr-empty' style={{ padding: '2rem' }}>Review not found</p>;

  return (
    <div className='rr-page'>
      <div className='rr-container'>

        <div className='rr-topbar'>
          <div className='rr-topbar-left'>
            <span className='rr-lang'>{review.language}</span>
            <span className='rr-live-badge'>
              <span className='rr-live-dot' />
              LIVE
            </span>
          </div>
          <div className='rr-topbar-right'>
            {isAuthor ? (
              <button className='rr-btn-danger' onClick={endReview}>End Review</button>
            ) : (
              <button className='rr-btn-ghost' onClick={leaveRoom}>Leave Room</button>
            )}
          </div>
        </div>

        <div className='rr-code-card'>
          <p className='rr-code-label'>Code</p>
          <pre className='rr-code-text'>{review.code}</pre>
        </div>

        <div className='rr-ai-card'>
          <p className='rr-section-title'>AI Review</p>

          {isAiReviewDone ? (
            <>
              <div className='rr-score-row'>
                <p className={`rr-score-value ${
                  review.aiReview.score >= 80 ? 'score-high'
                  : review.aiReview.score >= 50 ? 'score-mid'
                  : 'score-low'
                }`}>
                  {review.aiReview.score}
                </p>
                <span className='rr-score-sub'>out of 100</span>
              </div>

              <p className='rr-section-title'>Bugs</p>
              {review.aiReview.bugs.length > 0 ? (
                <div className='rr-bugs-list'>
                  {review.aiReview.bugs.map((bug, index) => (
                    <div key={index} className={`rr-bug-card severity-${bug.severity}`}>
                      <div className='rr-bug-meta'>
                        <span className='rr-bug-line'>Line {bug.lineNo}</span>
                        <span className='rr-bug-severity'>{bug.severity}</span>
                      </div>
                      <p className='rr-bug-message'>{bug.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='rr-empty'>No bugs found.</p>
              )}

              <p className='rr-section-title' style={{ marginTop: '1rem' }}>Suggestions</p>
              {review.aiReview.suggestions.length > 0 ? (
                <div className='rr-suggestions-list'>
                  {review.aiReview.suggestions.map((suggestion, index) => (
                    <p key={index} className='rr-suggestion-item'>{suggestion}</p>
                  ))}
                </div>
              ) : (
                <p className='rr-empty'>No suggestions.</p>
              )}
            </>
          ) : (
            isAuthor && (
              <div className='rr-pending-box'>
                <p className='rr-pending-text'>AI review not generated yet</p>
                <button
                  className='rr-btn-primary'
                  onClick={getAiReview}
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Generating...' : '✦ Generate AI Review'}
                </button>
              </div>
            )
          )}
        </div>

        <div className='rr-comment-card'>
          <p className='rr-section-title'>Add a Comment</p>
          <div className='rr-comment-row'>
            <input
              className='rr-line-input'
              type='number'
              min={1}
              max={codeLen}
              value={selectedLine}
              onChange={e => setSelectedLine(e.target.value)}
              placeholder='Line'
            />
            <textarea
              className='rr-textarea'
              placeholder='Write a comment...'
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button className='rr-send-btn' onClick={postComment}>Send</button>
          </div>
          {error && <p className='rr-error'>{error}</p>}

          {comments.length > 0 ? (
            <div className='rr-comments-list'>
              {comments.map((comment, index) => (
                <div key={index} className='rr-comment-item'>
                  <p className='rr-comment-meta'>
                    <span>{comment.authorName}</span> — Line {comment.lineNumber}
                  </p>
                  <p className='rr-comment-text'>{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='rr-empty' style={{ marginTop: '0.75rem' }}>No comments yet.</p>
          )}
        </div>

      </div>
    </div>
  );
}
