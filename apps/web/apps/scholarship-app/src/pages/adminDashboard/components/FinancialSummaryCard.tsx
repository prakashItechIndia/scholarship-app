import * as React from "react";
import { Card } from "@shared/components";

interface FinancialSummaryCardProps {
  label: string;
  amount: number;
  color: string;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  label,
  amount,
  color,
}) => {
  const formatAmount = (value: number): string => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "24px",
      minHeight: "120px",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <div style={{
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: 500,
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          {label}
        </div>
        <div style={{
          fontSize: "32px",
          lineHeight: "40px",
          fontWeight: 700,
          color: color,
          fontFamily: "'Inter', sans-serif",
        }}>
          {formatAmount(amount)}
        </div>
      </div>
    </Card>
  );
};

