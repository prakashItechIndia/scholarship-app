import * as React from "react";
import { VectorIcon } from "@shared/components";

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
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        backgroundColor: `${color}15`,
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <VectorIcon
          width="16px"
          height="16px"
          fill="#242424"
        />
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
          {name}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {action}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "#9ca3af",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};

