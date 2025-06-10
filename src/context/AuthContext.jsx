// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { login, register, logout, signInWithGoogle } from '../features/auth/services/authService';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName,
                    profilePicture: firebaseUser.photoURL || null,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await login(email, password);
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRegister = useCallback(async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const userData = await register(name, email, password);
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await logout();
            setUser(null);
        } catch (err) {
            setError(err.message || 'Logout failed');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGoogleLogin = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const userData = await signInWithGoogle();
            setUser(userData);
            return userData;
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const contextValue = useMemo(() => ({
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        signInWithGoogle: handleGoogleLogin,
        setUser,
    }), [user, loading, error, handleLogin, handleRegister, handleLogout, handleGoogleLogin]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
