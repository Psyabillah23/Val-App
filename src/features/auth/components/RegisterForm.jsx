// src/features/auth/components/RegisterForm.jsx
import React, { useState } from 'react';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import './RegisterForm.css';

const RegisterForm = ({ onSubmit, onGoogleSignIn, isLoading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.name) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.name, formData.email, formData.password);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <Input
        label="Name"
        type="text"
        id="name"
        name="name"
        value={formData.name}
        placeholder="Enter your name"
        required
        error={formErrors.name}
        onChange={handleChange}
      />

      <Input
        label="Email"
        type="email"
        id="email"
        name="email"
        value={formData.email}
        placeholder="Enter your email"
        required
        error={formErrors.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        type="password"
        id="password"
        name="password"
        value={formData.password}
        placeholder="Enter your password"
        required
        error={formErrors.password}
        onChange={handleChange}
      />

      <Input
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        placeholder="Confirm your password"
        required
        error={formErrors.confirmPassword}
        onChange={handleChange}
      />

      <div className="form-actions">
        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </div>

      <hr />

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={onGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Sign in with Google'}
      </Button>
    </form>
  );
};

export default RegisterForm;
