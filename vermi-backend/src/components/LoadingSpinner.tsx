// src/components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner = ({ size = 'medium', className = '' }: LoadingSpinnerProps) => {
  const sizes = {
    small: 'h-5 w-5',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizes[size]} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};