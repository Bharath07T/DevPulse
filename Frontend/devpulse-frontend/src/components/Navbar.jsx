import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/devpulseLogo.svg';
import '../styles/Navbar.css';


export default function Navbar() {
    const { pathname } = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const authPages = ['/login', '/register'];
    if(authPages.includes(pathname)) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <nav className='nav-bar'>
            <div className='logo-div'>
                <img src={ logo } alt='Devpulse' width={32} height={32} />
                <span className='logo-name'>
                    DevPulse
                </span>
            </div>
            
            <div className='nav-actions'>
                <Link
                to='/dashboard'
                className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}
                >
                Dashboard
                </Link>
                <button onClick={handleLogout} className='logout-button'>Logout</button>
            </div>
        </nav>
    );
}
