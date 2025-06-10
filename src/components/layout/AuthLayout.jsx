import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

const AuthLayout = () => {
    const { user } = useAuth();

    // Redirect to dashboard if already logged in
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="auth-container">
            <div className="auth-logo">
            </div>
            <div className="auth-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;