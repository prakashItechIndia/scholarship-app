import React from 'react';

export interface ImageIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const ImageIcon: React.FC<ImageIconProps> = ({ 
  width = 32, 
  height = 32, 
  className = '' 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" 
        fill="#616161"
      />
      <path 
        d="M17.99 9L15.58 6.58C15.21 6.21 14.7 6 14.17 6H9.83C9.3 6 8.79 6.21 8.42 6.58L6.01 9H17.99Z" 
        fill="#616161"
      />
      <path 
        d="M9.5 12C10.3284 12 11 11.3284 11 10.5C11 9.67157 10.3284 9 9.5 9C8.67157 9 8 9.67157 8 10.5C8 11.3284 8.67157 12 9.5 12Z" 
        fill="#616161"
      />
      <path 
        d="M18 17H6L10 13L12 15L14 13L18 17Z" 
        fill="#616161"
      />
    </svg>
  );
};

