import React from 'react';
import './Button.css';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    onClick
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
