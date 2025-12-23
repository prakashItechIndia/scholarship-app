import * as React from "react";
import { Card, Select } from "@shared/components";
import { ApplicationActivityData } from "../types";
import { mockApplicationActivityData } from "../constants";

interface ApplicationActivityChartProps {
  data?: ApplicationActivityData[];
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export const ApplicationActivityChart: React.FC<ApplicationActivityChartProps> = ({
  data = mockApplicationActivityData,
  selectedMonth = "September 2024",
  onMonthChange,
}) => {
  const maxValue = Math.max(...data.map((d) => d.count));
  const chartHeight = 200;
  const chartWidth = 800;
  const barWidth = chartWidth / data.length - 2;

  const monthOptions = [
    { value: "September 2024", label: "September 2024" },
    { value: "August 2024", label: "August 2024" },
    { value: "July 2024", label: "July 2024" },
    { value: "June 2024", label: "June 2024" },
  ];

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
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <div>
          <h3 style={{
            fontSize: "18px",
            lineHeight: "24px",
            fontWeight: 600,
            color: "#242424",
            marginBottom: "4px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Application Activity
          </h3>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Track the number of applications received each month.
          </p>
        </div>
        <div style={{ width: "180px" }}>
          <Select
            placeholder="Select Month"
            options={monthOptions}
            selectedKey={selectedMonth}
            onValueChange={(value) => onMonthChange?.(value)}
          />
        </div>
      </div>

      <div style={{
        width: "100%",
        overflowX: "auto",
      }}>
        <svg
          width={chartWidth}
          height={chartHeight + 40}
          style={{
            minWidth: "100%",
          }}
        >
          {/* Y-axis labels */}
          {[0, 100, 200, 300, 400].map((value) => (
            <g key={value}>
              <text
                x="0"
                y={chartHeight - (value / maxValue) * chartHeight + 5}
                fontSize="12"
                fill="#616161"
                fontFamily="'Inter', sans-serif"
              >
                {value}
              </text>
              <line
                x1="30"
                y1={chartHeight - (value / maxValue) * chartHeight}
                x2={chartWidth}
                y2={chartHeight - (value / maxValue) * chartHeight}
                stroke="#e0e0e0"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </g>
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.count / maxValue) * chartHeight;
            const x = 30 + index * (barWidth + 2);
            const y = chartHeight - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#0f6cbd"
                  rx="4"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize="10"
                  fill="#242424"
                  fontFamily="'Inter', sans-serif"
                  textAnchor="middle"
                >
                  {item.count}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = 30 + index * (barWidth + 2) + barWidth / 2;
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
                {item.date}
              </text>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};

