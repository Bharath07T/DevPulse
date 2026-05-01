import React, { useState } from 'react'
import axiosInstance from '../api/axiosInstance.js';
import { useNavigate } from 'react-router-dom';
import '../styles/NewReview.css';

export default function NewReview() {
    const [form, setForm] = useState({
        language: '', code: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name] : e.target.value }));
        if(error) setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        setLoading(true);

        try{
            const response = await axiosInstance.post('/reviews/', {
                code: form.code.trim(),
                language: form.language.trim()
            });

            const { _id } = response.data;
            navigate(`/room/${_id}`);
        }catch(error){
            setError(error.response?.data?.message || 'Failed to create review. Try again.')
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className='nr-page'>
    <div className='nr-card'>
        <h1 className='nr-title'>Submit Code for Review</h1>
        <p className='nr-subtitle'>Paste your code and get instant AI feedback</p>

        <form onSubmit={handleSubmit}>
        <label className='nr-label' htmlFor='language'>Language</label>
        <select className='nr-select' name='language' id='language'
            value={form.language} onChange={handleChange} required>
            <option value=''>Select a language</option>
            <option value='javascript'>JavaScript</option>
            <option value='python'>Python</option>
            <option value='java'>Java</option>
            <option value='typescript'>TypeScript</option>
            <option value='c++'>C++</option>
            <option value='c'>C</option>
        </select>

        <label className='nr-label' htmlFor='code'>Code</label>
        <textarea className='nr-textarea' name='code' id='code'
            placeholder='Paste your code here...'
            value={form.code} onChange={handleChange} required
        />

        {error && <p className='nr-error'>{error}</p>}

        <button className='nr-btn' type='submit' disabled={loading}>
            {loading ? 'Creating Review...' : 'Submit Code'}
        </button>
        </form>
    </div>
    </div>
  )
}