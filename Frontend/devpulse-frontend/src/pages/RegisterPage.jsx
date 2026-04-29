import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/devpulseLogo.svg';
import '../styles/auth.css';

export default function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '', email: '', password: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if(error) setError('');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if(form.password !== form.confirmPassword){
            setError('Password do not match');
            return;
        }

        setLoading(true);
        try{
            const response = await axiosInstance.post('/auth/register', {
                username: form.username.trim(), 
                email: form.email.trim().toLowerCase(), 
                password: form.password
            });

            const { token, ...user } = response.data;
            login(user, token);
            navigate('/dashboard');
        }catch(error){
            setError(error.response?.data?.message || 'Registration failed');
        }finally{
            setLoading(false);
        }
    };

  return (
    <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <img src={logo} alt="DevPulse" width={56} height={56} />
                    <h1>Create account</h1>
                    <p>Already have one? <Link to="/login">Sign in</Link></p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email ID"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Min 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Repeat your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
            </div>
        </div>

  )
}