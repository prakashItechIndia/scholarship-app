import * as React from "react";

interface SeparatorProps {
  height?: string;
  color?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ 
  height = "100%", 
  color = "#E0E0E0" 
}) => {
  const separatorHeight = height === "auto" ? "100%" : height;
  
  return (
    <div
      style={{
        width: "2px",
        height: separatorHeight,
        backgroundColor: color,
        alignSelf: "stretch",
        flexShrink: 0,
        minHeight: "100px",
      }}
    />
  );
};
