import React from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    id,
    name,
    value,
    placeholder = '',
    required = false,
    disabled = false,
    error = '',
    onChange,
    onBlur
}) => {
    return (
        <div className="input-group">
            {label && (
                <label htmlFor={id} className="input-label">
                    {label} {required && <span className="required">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`input-field ${error ? 'input-error' : ''}`}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Input;