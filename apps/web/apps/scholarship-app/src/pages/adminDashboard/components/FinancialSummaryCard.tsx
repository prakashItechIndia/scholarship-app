import * as React from "react";
import { Card } from "@shared/components";

interface FinancialSummaryCardProps {
  icon?: React.ReactNode;
  value: number | string;
  label: string;
  showCurrency?: boolean;
  iconBgColor?: string;
  color?: string;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  icon,
  value,
  label,
  showCurrency = false,
  iconBgColor = "#2453C3",
  color,
}) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === "number") {
      // If currency icon is shown, don't add ₹ symbol to the value
      if (showCurrency && icon) {
        return val.toLocaleString("en-IN");
      }
      if (showCurrency) {
        return `₹${val.toLocaleString("en-IN")}`;
      }
      return val.toLocaleString("en-IN");
    }
    return val;
  };

  return (
    <Card 
      variant="elevated" 
      style={{
        // border: "1px solid #e0e0e0",
        backgroundColor: color ?? "#ffffff",
        borderRadius: "12px",
        padding: "10px 0px 20px 20px",
        height: "96px",
        minHeight: "100px",
        width: "100%",
        // gap: "16px",
        // boxShadow: "0px 2px 4px 0px #00000024",
        margin: "2px",
        boxShadow: "none",
        position: "relative"
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        {/* Icon on left */}
        {icon && (
          <div style={{
            width: "50px",
            height: "50px",
            // borderRadius: "8px",
            // padding:"0px 0px 0px 20px",
            left:"20px",
            top:"23px",
            backgroundColor: iconBgColor === "#FFFFFF" ? "#FFFFFF" : `${iconBgColor}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: iconBgColor === "#FFFFFF" ? "1.5px solid #CBD0DC" : "none",
            borderRadius: iconBgColor === "#FFFFFF" ? "28px" : "50%",
          }}>
            {icon}
          </div>
        )}

        {/* Content on right */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          flex: 1,
        }}>
          {/* Value on top */}
          <div style={{
            fontSize: "40px",
            lineHeight: "52px",
            fontWeight: 600,
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {formatValue(value)}
          </div>

          {/* Label below */}
          <div style={{
            fontSize: "12px",
            lineHeight: "16px",
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
