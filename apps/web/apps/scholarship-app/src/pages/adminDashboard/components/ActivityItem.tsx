import * as React from "react";

interface ActivityItemProps {
  name: string;
  action: string;
  timestamp: string;
  color: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  name,
  action,
  timestamp,
  color,
}) => {
  // Get first letter of name for avatar
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        backgroundColor: `${color}15`,
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {firstLetter}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {name}: {action}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};

