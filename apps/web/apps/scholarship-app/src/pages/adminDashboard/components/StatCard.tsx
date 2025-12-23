import * as React from "react";
import { Card } from "@shared/components";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => {
  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: color ?? "#ffffff",
      borderRadius: "8px",
      padding: "20px",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          <div style={{
            fontSize: "32px",
            lineHeight: "40px",
            fontWeight: 600,
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 400,
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            {label}
          </div>
        </div>
      </div>
    </Card>
  );
};

