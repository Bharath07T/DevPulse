import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      const response = await axiosInstance.get('/reviews/');
      setReviews(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          'Something went wrong. Try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const total = reviews.length;
  const pending = reviews.filter(
    (r) => r.status === 'pending'
  ).length;

  const reviewed = reviews.filter(
    (r) => r.status === 'reviewed'
  ).length;

  const scoredReviews = reviews.filter(
    (r) => r.aiReview?.score != null
  );

  const avgScore =
    scoredReviews.length > 0
      ? Math.round(
          scoredReviews.reduce(
            (sum, r) => sum + r.aiReview.score,
            0
          ) / scoredReviews.length
        )
      : null;

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 50) return '#d97706';
    return '#dc2626';
  };

  const deleteReview = async (id) => {
    try{
      await axiosInstance.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
    }catch(error){
      setDeleteError(error.response?.data?.message || 'Deletion failed');
    }
  }

  return (
    <div className="page">
      <main className="main">
        <div className="header">
          <div>
            <h1 className="pageTitle">My Reviews</h1>
            <p className="pageSubtitle">
              Track your code submissions and AI feedback
            </p>
          </div>

          <button
            className="submitBtn"
            onClick={() => navigate('/submit')}
          >
            + Submit Code
          </button>
        </div>

        <div className="statsGrid">
          <div className="statCard">
            <p className="statLabel">Total Reviews</p>
            <p className="statValue"> {total} </p>
          </div>

          <div className="statCard">
            <p className="statLabel">Pending</p>
            <p
              className="statValue"
              style={{ color: '#d97706' }}
            >
              {pending}
            </p>
            <p className="statSub">
              Session Active
            </p>
          </div>

          <div className="statCard">
            <p className="statLabel">Reviewed</p>
            <p
              className="statValue"
              style={{ color: '#16a34a' }}
            >
              {reviewed}
            </p>
          </div>

          <div className="statCard">
            <p className="statLabel">Avg. Score</p>
            <p
              className="statValue"
              style={{
                color:
                  avgScore != null
                    ? getScoreColor(avgScore)
                    : '#9ca3af',
              }}
            >
              {avgScore != null ? avgScore : '—'}
            </p>
            <p className="statSub">out of 100</p>
          </div>
        </div>

        {error && (
          <p className="errorMsg">{error}</p>
        )}

        <p className="sectionLabel">
          Recent submissions
        </p>

        {loading ? (
          <p className="emptyMsg">Loading...</p>
        ) : reviews.length === 0 ? (
          <div className="emptyState">
            <p className="emptyMsg">
              No reviews yet.
            </p>
            <p className="emptySub">
              Submit your first code snippet to
              get started.
            </p>
          </div>
        ) : (
          <div className="reviewList">
            {reviews.map((review) => (
          <div key={review._id} className="reviewCardWrapper">
            <div
              className="reviewCard"
              onClick={() => navigate(`/review/${review._id}`)}
            >
              <div className="cardLeft">
                <span className="langBadge">
                  {review.language}
                </span>
                <p className="codePreview">
                  {review.code.length > 80
                    ? review.code.slice(0, 80) + '...'
                    : review.code
                  }
                </p>
              </div>

              <div className="cardRight">
                <span className={`statusPill ${
                  review.status === 'reviewed' ? 'statusReviewed' : 'statusPending'
                }`}>
                  {review.status}
                </span>
                <p className="scoreChip">
                  Score:{' '}
                  <span style={{
                    fontWeight: 600,
                    color: review.aiReview?.score != null
                      ? getScoreColor(review.aiReview.score)
                      : '#9ca3af',
                  }}>
                    {review.aiReview?.score != null ? review.aiReview.score : '—'}
                  </span>
                </p>
              </div>

              <span className="arrow">›</span>
            </div>

            <button
              className="deleteBtn"
              onClick={() => deleteReview(review._id)}
            >
              🗑
            </button>
          </div>
        ))}
          </div>
        )}
      </main>
    </div>
  );
}