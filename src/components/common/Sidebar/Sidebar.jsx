import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBook, FaBookmark } from 'react-icons/fa';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <div className="sidebar">
            <ul className="sidebar-menu">
                <li className="sidebar-item">
                    <NavLink to="/" className={({ isActive }) =>
                        isActive ? 'sidebar-link active' : 'sidebar-link'
                    }>
                        <FaHome className="sidebar-icon" />
                        <span>Home</span>
                    </NavLink>
                </li>

                {user && (
                    <>
                        <li className="sidebar-item">
                            <NavLink to="/my-works" className={({ isActive }) =>
                                isActive ? 'sidebar-link active' : 'sidebar-link'
                            }>
                                <FaBook className="sidebar-icon" />
                                <span>My Works</span>
                            </NavLink>
                        </li>

                        <li className="sidebar-item">
                            <NavLink to="/bookmarks" className={({ isActive }) =>
                                isActive ? 'sidebar-link active' : 'sidebar-link'
                            }>
                                <FaBookmark className="sidebar-icon" />
                                <span>Bookmark</span>
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;