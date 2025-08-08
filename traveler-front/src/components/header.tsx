import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { FaHome, FaSearch, FaUser } from 'react-icons/fa'; 
import { RiAddCircleLine } from 'react-icons/ri';


const Header: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('id');

    const handleLogout = async () => {
        try {
            const response = await fetch('${SERVER_URL}:${SERVER_PORT}/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken }),
            });
            if (!response.ok) {
                throw new Error('Logout failed');
            } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('id');
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <header className="header">
            <div className="left">
                <Link to="/posts" className="home-link">
                    <FaHome className="home-icon" />
                </Link>
                <FaSearch className="search-icon" onClick={() => navigate('/ai-posts')} />
            </div>

            <div className="right">
                <nav className="nav-container">
                    <div className="user-info">
                        <FaUser className="profile-icon" onClick={() => navigate('/user')} />
                        <span>{userId || 'User'}</span>
                        {isLoggedIn ? (
                            <>
                                <button onClick={handleLogout}>Logout</button>
                                <RiAddCircleLine className="plus-icon" onClick={() => navigate('/create-post')} />
                                </>
                        ) : (
                            <Link to="/login">
                                <button>Login</button>
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
