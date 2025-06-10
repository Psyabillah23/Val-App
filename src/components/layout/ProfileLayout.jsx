import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';

const ProfileLayout = () => {
    return (
        <div className="app-container">
            <Navbar />
            <div className="profile-content">
                <div className="profile-header">
                    <h1>My Profile</h1>
                </div>
                <div className="profile-body">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;