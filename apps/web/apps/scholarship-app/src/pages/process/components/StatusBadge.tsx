import * as React from "react";


interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<string, {
    bgColor: string;
    textColor: string;
    borderColor: string;
  }> = {
    Completed: {
      bgColor: "#f1faf1",
      textColor: "#0e700e",
      borderColor: "#9fd89f",
    },
    Verified: { // Same as Completed
      bgColor: "#f1faf1",
      textColor: "#0e700e",
      borderColor: "#9fd89f",
    },
    Approved: { // Same as Completed
      bgColor: "#f1faf1",
      textColor: "#0e700e",
      borderColor: "#9fd89f",
    },
    Review: {
      bgColor: "#fff9f5",
      textColor: "#bc4b09",
      borderColor: "#fdcfb4",
    },
    Waiting: { // Same as Review
      bgColor: "#fff9f5",
      textColor: "#bc4b09",
      borderColor: "#fdcfb4",
    },
    Registered: {
      bgColor: "#aeb9f600",
      textColor: "#115ea3",
      borderColor: "#b4d6fa",
    },
    "Documents Submitted": { // Blue text, light blue bg, blue border
      bgColor: "#ebf3fc",
      textColor: "#0F6CBD",
      borderColor: "#0F6CBD",
    },
    Rejected: {
      bgColor: "#ffffff",
      textColor: "#616161",
      borderColor: "#e0e0e0",
    },
  };

  const config = statusConfig[status] || {
    bgColor: "#f5f5f5",
    textColor: "#424242",
    borderColor: "#d1d1d1",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 10px",
        borderRadius: "10000px",
        fontSize: "12px",
        lineHeight: "16px",
        fontWeight: 500,
        border: `1px solid ${config.borderColor}`,
        backgroundColor: config.bgColor,
        color: config.textColor,
        fontFamily: "'Inter', sans-serif",
        minWidth: "140px",
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

