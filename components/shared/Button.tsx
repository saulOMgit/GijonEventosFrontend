
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    loading?: boolean;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'danger-outline';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    loading = false, 
    fullWidth = false,
    variant = 'primary',
    size = 'md',
    ...props 
}) => {
    const baseClasses = 'inline-flex items-center justify-center border font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };
    
    const variantClasses = {
        primary: 'border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600',
        danger: 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        'danger-outline': 'border-red-300 bg-white text-red-700 hover:bg-red-50 focus:ring-red-500 dark:text-red-400 dark:border-red-400/50 dark:hover:bg-red-400/10',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';

    const finalClassName = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${props.className || ''}`;

    return (
        <button {...props} className={finalClassName} disabled={loading || props.disabled}>
            {loading ? <Spinner size="sm" /> : children}
        </button>
    );
};

export default Button;