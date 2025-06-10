// src/features/auth/pages/Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/RegisterForm';
import Card from '../../../components/common/Card/Card';

const Register = () => {
  const { register, signInWithGoogle, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (name, email, password) => {
    setIsLoading(true);
    try {
      await register(name, email, password);
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
    <div className="register-page">
      <Card title="Create New Account" className="auth-card">
        <RegisterForm
          onSubmit={handleRegister}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
          error={error}
        />
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
