import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const baseStyle = `font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-all duration-200 ease-in-out flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md`;

  const variantStyles = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white focus-visible:ring-emerald-400 disabled:bg-emerald-400/70',
    secondary: 'bg-sky-600 hover:bg-sky-700 text-white focus-visible:ring-sky-500 disabled:bg-sky-400/70',
    accent: 'bg-purple-600 hover:bg-purple-700 text-white focus-visible:ring-purple-500 disabled:bg-purple-400/70',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 disabled:bg-red-400/70',
    ghost: 'bg-transparent hover:bg-slate-700/60 text-slate-200 focus-visible:ring-slate-500 border border-slate-600 hover:border-slate-500 disabled:text-slate-500 disabled:border-slate-700 disabled:hover:bg-transparent',
    light: 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus-visible:ring-slate-400 border border-slate-300 disabled:bg-slate-100'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs', // Smaller text for 'sm'
    md: 'px-5 py-2.5 text-sm', // Base text size to sm
    lg: 'px-7 py-3 text-base', // lg uses base text size
    xl: 'px-8 py-3.5 text-lg',
  };

  const loadingSpinner = (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? loadingSpinner : (
        <>
          {leftIcon && <span className={`mr-2 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`}>{leftIcon}</span>}
          <span className="truncate">{children}</span>
          {rightIcon && <span className={`ml-2 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
