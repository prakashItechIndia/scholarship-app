import React from 'react';

export interface PencilIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  fill?: string;
}

export const PencilIcon: React.FC<PencilIconProps> = ({ 
  width = 10, 
  height = 10, 
  className = '',
  fill = '#2453C3'
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 10 10" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M6.73605 0.560671C7.4836 -0.186887 8.69562 -0.18689 9.44317 0.560661C10.1907 1.3082 10.1907 2.52021 9.44318 3.26776L9.20902 3.50192L6.50192 0.79481L6.73605 0.560671ZM5.79482 1.50192L0.650358 6.64647C0.58074 6.71609 0.533226 6.80471 0.513772 6.90123L0.00986564 9.40123C-0.0231876 9.56521 0.027956 9.73486 0.146136 9.85326C0.264317 9.97165 0.433875 10.0231 0.597919 9.99034L3.10183 9.49034C3.19868 9.471 3.28763 9.42341 3.35747 9.35357L8.50192 4.20903L5.79482 1.50192Z" 
        fill={fill}
      />
    </svg>
  );
};

