import * as React from "react";
import { Card } from "@shared/components";

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  showCurrency?: boolean;
  iconBgColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  showCurrency = false,
  iconBgColor = "#2453C3",
}) => {
  const formatValue = (val: number): string => {
    if (showCurrency) {
      return ` ${val.toLocaleString("en-IN")}`;
    }
    return val.toLocaleString("en-IN");
  };

  return (
    <Card 
      variant="elevated" 
      style={{
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "20px",
        height: "100%",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        {/* Icon on left */}
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "8px",
          backgroundColor: `${iconBgColor}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Content on right */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flex: 1,
        }}>
          {/* Value on top */}
          <div style={{
            fontSize: "28px",
            lineHeight: "36px",
            fontWeight: 700,
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {formatValue(value)}
          </div>

          {/* Label below */}
          <div style={{
            fontSize: "13px",
            lineHeight: "18px",
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
