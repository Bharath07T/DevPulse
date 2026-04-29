import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/devpulseLogo.svg';
import '../styles/auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name] : e.target.value }));
    if(error) setError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try{
      const response = await axiosInstance.post('/auth/login', {
        email : form.email.trim().toLowerCase(),
        password : form.password
      });

      const { token, ...user } = response.data;
      login(user, token);
      navigate('/dashboard');
    }catch(error){
      setError(error.response?.data?.message || 'Invalid email or password');
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
    <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <img src={logo} alt="DevPulse" width={56} height={56} />
                    <h1>Welcome back</h1>
                    <p>No account? <Link to="/register">Sign up</Link></p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your Email ID"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    </>
  )
}