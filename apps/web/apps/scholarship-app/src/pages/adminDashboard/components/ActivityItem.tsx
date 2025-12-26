import * as React from "react";
import { VectorIcon } from "@shared/components";

interface ActivityItemProps {
  name: string;
  action: string;
  timestamp: string;
  color: string;
  border:string
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  name,
  action,
  timestamp,
  color,
  border
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        backgroundColor: `${color}`,
        borderRadius: "4px",
        border:border,
        height:"80px"
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "20%",
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <VectorIcon
          width="18px"
          height="18px"
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
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
              whiteSpace: "nowrap",
            }}
          >
            {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

