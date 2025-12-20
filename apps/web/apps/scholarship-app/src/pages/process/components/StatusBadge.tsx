import * as React from "react";
import {
  CheckmarkCircleRegular,
  ClockRegular,
  DismissCircleRegular,
} from "@fluentui/react-icons";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<string, { 
    bgColor: string; 
    textColor: string; 
    borderColor: string; 
    icon: React.ReactNode 
  }> = {
    Verified: {
      bgColor: "#f1faf1",
      textColor: "#0e700e",
      borderColor: "#9fd89f",
      icon: <CheckmarkCircleRegular style={{ width: "16px", height: "16px" }} />,
    },
    Pending: {
      bgColor: "#fff9f5",
      textColor: "#bc4b09",
      borderColor: "#fdcfb4",
      icon: <ClockRegular style={{ width: "16px", height: "16px" }} />,
    },
    Approved: {
      bgColor: "#ebf3fc",
      textColor: "#115ea3",
      borderColor: "#b4d6fa",
      icon: <CheckmarkCircleRegular style={{ width: "16px", height: "16px" }} />,
    },
    Rejected: {
      bgColor: "#fdf3f4",
      textColor: "#b10e1c",
      borderColor: "#eeacb2",
      icon: <DismissCircleRegular style={{ width: "16px", height: "16px" }} />,
    },
  };

  const config = statusConfig[status] || {
    bgColor: "#f5f5f5",
    textColor: "#424242",
    borderColor: "#d1d1d1",
    icon: null,
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "10000px",
        fontSize: "12px",
        lineHeight: "16px",
        fontWeight: 500,
        border: `1px solid ${config.borderColor}`,
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default StatusBadge;

