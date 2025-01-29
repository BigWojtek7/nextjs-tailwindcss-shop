interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function Button({
  isLoading = false,
  loadingText,
  children,
  className = '',
  // variant = 'primary',
  ...props
}: ButtonProps) {
  // const baseStyles = 'group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  
  // const variantStyles = {
  //   primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 disabled:bg-indigo-400',
  //   secondary: 'bg-gray-600 text-white hover:bg-gray-500 focus-visible:outline-gray-600 disabled:bg-gray-400',
  //   outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus-visible:outline-indigo-600 disabled:border-indigo-400 disabled:text-indigo-400'
  // };

  // const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={className}
    >
      {isLoading ? (loadingText || 'Loading...') : children}
    </button>
  );
};

