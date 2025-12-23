import React from 'react';

export interface ReopenIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const ReopenIcon: React.FC<ReopenIconProps> = ({ 
  width = 14, 
  height = 14, 
  className = '',
  style
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 14 14" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path d="M7 1C10.3137 1 13 3.68629 13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 6.84443 1.00591 6.69034 1.0175 6.53793C1.03845 6.26258 0.832217 6.02239 0.55687 6.00144C0.281524 5.98049 0.0413313 6.18673 0.0203848 6.46207C0.00687313 6.6397 0 6.8191 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C5.04094 0 3.27012 0.804992 2 2.10109V0.5C2 0.223858 1.77614 0 1.5 0C1.22386 0 1 0.223858 1 0.5V3.5C1 3.77614 1.22386 4 1.5 4H4.5C4.77614 4 5 3.77614 5 3.5C5 3.22386 4.77614 3 4.5 3H2.52772C3.62683 1.77191 5.2234 1 7 1ZM7 3.5C7 3.22386 6.77614 3 6.5 3C6.22386 3 6 3.22386 6 3.5V7.5C6 7.77614 6.22386 8 6.5 8H9.5C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7H7V3.5Z" fill="#424242"/>
    </svg>
  );
};

