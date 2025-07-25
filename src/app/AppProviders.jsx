import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NewsProvider } from '../context/NewsContext';

export const AppProviders = ({ children }) => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <NewsProvider>
                    {children}
                </NewsProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};
