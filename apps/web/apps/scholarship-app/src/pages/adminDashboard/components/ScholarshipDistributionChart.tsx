import * as React from "react";
import { Card, Select } from "@shared/components";
import { ScholarshipDistributionData } from "../types";
import { mockScholarshipDistributionData } from "../constants";

interface ScholarshipDistributionChartProps {
  data?: ScholarshipDistributionData[];
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
}

export const ScholarshipDistributionChart: React.FC<ScholarshipDistributionChartProps> = ({
  data = mockScholarshipDistributionData,
  selectedPeriod = "Monthly",
  onPeriodChange,
}) => {
  const chartHeight = 300;
  const chartWidth = 800;
  const paddingLeft = 100;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;
  
  const groupGap = 40;
  const barWidth = 14;
  const barGap = 6;
  const groupWidth = (barWidth * 4) + (barGap * 4);

  const periodOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Yearly", label: "Yearly" },
  ];

  const colors = {
    meritExcellence: "#7086FD",
    stemInnovation: "#6FD195",
    achievement: "#FFAE4C",
    sports: "#07DBFA",
  };

  const getY = (value: number) => {
    return chartHeight - (value / 100) * chartHeight + paddingTop;
  };

  const getGroupX = (index: number) => {
    return paddingLeft + index * (groupWidth + groupGap);
  };

  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "24px",
      height: "100%",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
      }}>
        <div>
          <h3 style={{
            fontSize: "16px",
            lineHeight: "22px",
            fontWeight: 600,
            color: "#242424",
            marginBottom: "4px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Scholarship Program Distribution
          </h3>
          <p style={{
            fontSize: "12px",
            lineHeight: "16px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}>
            Analysis and manage Program Wise Scholarship Distribution.
          </p>
        </div>
        <div>
          <Select
            placeholder="Select Period"
            options={periodOptions}
            selectedKey={selectedPeriod}
            onValueChange={(value) => onPeriodChange?.(value)}
          />
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg width={chartWidth} height={chartHeight + paddingTop + paddingBottom} style={{ overflow: "visible" }}>
          {/* Horizontal Grid Lines */}
          {[0, 20, 40, 60, 80, 100].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <text
                  x="35"
                  y={y + 5}
                  fontSize="13"
                  fill="#616161"
                  fontFamily="'Inter', sans-serif"
                >
                  {val}
                </text>
                <line
                  x1={paddingLeft-20}
                  y1={y}
                  x2={chartWidth - paddingRight+133}
                  y2={y}
                  stroke={val === 0 ? "#9ca3af" : "#e5e7eb"}
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? "0" : "3,3"}
                />
              </g>
            );
          })}

          {/* Reference Line at 50 */}
          {/* Vertical Grid Lines */}
          {data.map((_, i) => (
            <line
              key={`v-${i}`}
              x1={getGroupX(i) - (groupGap / 2)}
              y1={paddingTop}
              x2={getGroupX(i) - (groupGap / 2)}
              y2={chartHeight + paddingTop}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
          ))}
          <line
            x1={getGroupX(data.length - 1) + groupWidth + (groupGap / 3)}
            y1={paddingTop}
            x2={getGroupX(data.length - 1) + groupWidth + (groupGap / 3)}
            y2={chartHeight + paddingTop}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="3,3"
          />

          {/* Grouped bars */}
          {data.map((item, index) => {
            const groupX = getGroupX(index);
            
            const bars = [
              { value: item.meritExcellence, color: colors.meritExcellence },
              { value: item.stemInnovation, color: colors.stemInnovation },
              { value: item.achievement, color: colors.achievement },
              { value: item.sports, color: colors.sports },
            ];

            return (
              <g key={index}>
                {bars.map((bar, barIndex) => {
                  const barX = groupX + barIndex * (barWidth + barGap);
                  const barHeight = (bar.value / 100) * chartHeight;
                  return (
                    <rect
                      key={barIndex}
                      x={barX}
                      y={getY(bar.value)}
                      width={barWidth}
                      height={barHeight}
                      fill={bar.color}
                    />
                  );
                })}
                {/* Month Label */}
                <text
                  x={groupX + groupWidth / 2}
                  y={chartHeight + paddingTop + 25}
                  fontSize="13"
                  fill="#616161"
                  fontFamily="'Inter', sans-serif"
                  textAnchor="middle"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        gap: "24px",
        marginTop: "32px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", backgroundColor: colors.meritExcellence }} />
          <span style={{ fontSize: "13px", color: "#000000B2", fontFamily: "'Inter', sans-serif" }}>
            Merit Excellence
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", backgroundColor: colors.stemInnovation }} />
          <span style={{ fontSize: "13px", color: "#000000B2", fontFamily: "'Inter', sans-serif" }}>
            STEM Innovation
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", backgroundColor: colors.achievement }} />
          <span style={{ fontSize: "13px", color: "#000000B2", fontFamily: "'Inter', sans-serif" }}>
            Achievement
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", backgroundColor: colors.sports }} />
          <span style={{ fontSize: "13px", color: "#000000B2", fontFamily: "'Inter', sans-serif" }}>
            Sports
          </span>
        </div>
      </div>
    </Card>
  );
};
