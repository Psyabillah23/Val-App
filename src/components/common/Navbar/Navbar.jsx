import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';
import defaultAvatar from '../../../assets/image/Profile.jpg';

// Menggunakan memo untuk mencegah render ulang yang tidak perlu
const Navbar = memo(() => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
    }, [logout, navigate]);

    const toggleDropdown = useCallback(() => {
        setShowDropdown(prev => !prev);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">Valyria News</Link>
            </div>

            <div className="navbar-center">
                <SearchBar />
            </div>

            <div className="navbar-right">
                {user ? (
                    <>
                        <Link to="/add-news" className="btn-add">
                            <i className="plus-icon"></i>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>

                        </Link>

                        <div className="user-dropdown">
                            <button className="dropdown-toggle" onClick={toggleDropdown}>
                                <img
                                    src={user.profilePicture || defaultAvatar}
                                    alt={user.name}
                                    className="user-avatar"
                                    width="32"
                                    height="32"
                                    loading="lazy"
                                />
                                <span className="user-name">{user.name}</span>
                            </button>

                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item">Profile</Link>
                                    <Link to="/my-works" className="dropdown-item">My Works</Link>
                                    <Link to="/bookmarks" className="dropdown-item">Bookmarks</Link>
                                    <button onClick={handleLogout} className="dropdown-item logout">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="btn-login">Login</Link>
                        <Link to="/register" className="btn-register">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
});

// Tambahkan displayName untuk memudahkan debugging
Navbar.displayName = 'Navbar';

export default Navbar;