// src/features/auth/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import Card from '../../../components/common/Card/Card';

const Login = () => {
  const { login, signInWithGoogle, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card title="Login to Portal Berita" className="auth-card">
        <LoginForm
          onSubmit={handleLogin}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
          error={error}
        />
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
