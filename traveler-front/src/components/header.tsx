import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';
import { FaHome } from 'react-icons/fa'; 
import { RiAddCircleLine } from 'react-icons/ri';


const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="left">
                <Link to="/posts" className="home-link">
                    <FaHome className="home-icon" />
                </Link>
            </div>

            <div className="right">
                <nav className="nav-container">
                    <div className="user-info">
                        <RiAddCircleLine className="plus-icon" onClick={() => navigate('/create-post')} />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
