import * as React from "react";
import { Card, Select } from "@shared/components";

interface FundSpendingDataPoint {
  month: string;
  budget2024: number;
  budget2025: number;
}

interface FundSpendingChartProps {
  data?: FundSpendingDataPoint[];
  selectedYear?: string;
  onYearChange?: (year: string) => void;
}

export const FundSpendingChart: React.FC<FundSpendingChartProps> = ({
  data = [
    { month: "Jan", budget2024: 150000, budget2025: 180000 },
    { month: "Feb", budget2024: 180000, budget2025: 200000 },
    { month: "Mar", budget2024: 220000, budget2025: 250000 },
    { month: "Apr", budget2024: 280000, budget2025: 300000 },
    { month: "May", budget2024: 320000, budget2025: 350000 },
    { month: "Jun", budget2024: 367530, budget2025: 380000 },
    { month: "Jul", budget2024: 350000, budget2025: 370000 },
    { month: "Aug", budget2024: 330000, budget2025: 360000 },
    { month: "Sep", budget2024: 310000, budget2025: 340000 },
    { month: "Oct", budget2024: 290000, budget2025: 320000 },
    { month: "Nov", budget2024: 270000, budget2025: 300000 },
    { month: "Dec", budget2024: 250000, budget2025: 280000 },
  ],
  selectedYear = "2024 - 2025",
  onYearChange,
}) => {
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.budget2024, d.budget2025])
  );
  const chartHeight = 200;
  const chartWidth = 700;
  const padding = 40;

  const yearOptions = [
    { value: "2024 - 2025", label: "2024 - 2025" },
    { value: "2023 - 2024", label: "2023 - 2024" },
    { value: "2022 - 2023", label: "2022 - 2023" },
  ];

  const formatAmount = (value: number): string => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const getY = (value: number) => {
    return chartHeight - (value / maxValue) * chartHeight;
  };

  const getX = (index: number) => {
    return padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
  };

  // Create path for line
  const createLinePath = (getValue: (d: FundSpendingDataPoint) => number) => {
    return data
      .map((point, index) => {
        const x = getX(index);
        const y = getY(getValue(point));
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "24px",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
        gap: "16px",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: "18px",
            lineHeight: "24px",
            fontWeight: 600,
            color: "#242424",
            marginBottom: "4px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Fund Spending
          </h3>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Total budget utilization.
          </p>
        </div>
        <div style={{ width: "150px", flexShrink: 0 }}>
          <Select
            placeholder="Select Year"
            options={yearOptions}
            selectedKey={selectedYear}
            onValueChange={(value) => onYearChange?.(value)}
          />
        </div>
      </div>

      <div style={{
        width: "100%",
        overflowX: "auto",
      }}>
        <svg
          width={chartWidth}
          height={chartHeight + 60}
          style={{
            minWidth: "100%",
          }}
        >
          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4].map((value) => {
            const yValue = (value / 4) * maxValue;
            const y = getY(yValue);
            return (
              <g key={value}>
                <text
                  x="0"
                  y={y + 5}
                  fontSize="12"
                  fill="#616161"
                  fontFamily="'Inter', sans-serif"
                >
                  {formatAmount(yValue)}
                </text>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              </g>
            );
          })}

          {/* Grid lines */}
          {data.map((_, index) => {
            const x = getX(index);
            return (
              <line
                key={index}
                x1={x}
                y1={0}
                x2={x}
                y2={chartHeight}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            );
          })}

          {/* 2024 Line */}
          <path
            d={createLinePath((d) => d.budget2024)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 2024 Data points */}
          {data.map((point, index) => {
            const x = getX(index);
            const y = getY(point.budget2024);
            return (
              <circle
                key={`2024-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}

          {/* 2025 Line */}
          <path
            d={createLinePath((d) => d.budget2025)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 2025 Data points */}
          {data.map((point, index) => {
            const x = getX(index);
            const y = getY(point.budget2025);
            return (
              <circle
                key={`2025-${index}`}
                cx={x}
                cy={y}
                r="4"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = getX(index);
            return (
              <text
                key={index}
                x={x}
                y={chartHeight + 20}
                fontSize="10"
                fill="#616161"
                fontFamily="'Inter', sans-serif"
                textAnchor="middle"
              >
                {point.month}
              </text>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{
          display: "flex",
          gap: "24px",
          marginTop: "16px",
          justifyContent: "center",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{
              width: "16px",
              height: "3px",
              backgroundColor: "#3b82f6",
            }} />
            <span style={{
              fontSize: "12px",
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
            }}>
              Total budget 2024
            </span>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{
              width: "16px",
              height: "3px",
              backgroundColor: "#ef4444",
            }} />
            <span style={{
              fontSize: "12px",
              color: "#616161",
              fontFamily: "'Inter', sans-serif",
            }}>
              Total budget 2025
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

