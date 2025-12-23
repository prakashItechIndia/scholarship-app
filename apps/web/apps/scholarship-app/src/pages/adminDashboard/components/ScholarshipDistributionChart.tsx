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
  const maxValue = Math.max(
    ...data.map((d) => d.meritExcellence + d.stemInnovation + d.concessions + d.sports)
  );
  const chartHeight = 200;
  const chartWidth = 700;
  const barWidth = 60;
  const barGap = 20;

  const periodOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Yearly", label: "Yearly" },
  ];

  const colors = {
    meritExcellence: "#3b82f6",
    stemInnovation: "#f59e0b",
    concessions: "#10b981",
    sports: "#8b5cf6",
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
            Scholarship Program Distribution
          </h3>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Analysis and manage Program Wise Scholarship Distribution.
          </p>
        </div>
        <div style={{ width: "120px" }}>
          <Select
            placeholder="Select Period"
            options={periodOptions}
            selectedKey={selectedPeriod}
            onValueChange={(value) => onPeriodChange?.(value)}
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
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={value}>
              <text
                x="0"
                y={chartHeight - (value / 100) * chartHeight + 5}
                fontSize="12"
                fill="#616161"
                fontFamily="'Inter', sans-serif"
              >
                {value}
              </text>
              <line
                x1="30"
                y1={chartHeight - (value / 100) * chartHeight}
                x2={chartWidth}
                y2={chartHeight - (value / 100) * chartHeight}
                stroke="#e0e0e0"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </g>
          ))}

          {/* Stacked bars */}
          {data.map((item, index) => {
            const x = 40 + index * (barWidth + barGap);
            let currentY = chartHeight;

            const segments = [
              { value: item.meritExcellence, color: colors.meritExcellence, label: "Merit Excellence" },
              { value: item.stemInnovation, color: colors.stemInnovation, label: "STEM Innovation" },
              { value: item.concessions, color: colors.concessions, label: "Concessions" },
              { value: item.sports, color: colors.sports, label: "Sports" },
            ];

            return (
              <g key={index}>
                {segments.map((segment, segIndex) => {
                  const segmentHeight = (segment.value / 100) * chartHeight;
                  currentY -= segmentHeight;
                  return (
                    <rect
                      key={segIndex}
                      x={x}
                      y={currentY}
                      width={barWidth}
                      height={segmentHeight}
                      fill={segment.color}
                      rx="4"
                    />
                  );
                })}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  fontSize="10"
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

        {/* Legend */}
        <div style={{
          display: "flex",
          gap: "24px",
          marginTop: "16px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}>
          {Object.entries(colors).map(([key, color]) => (
            <div key={key} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                backgroundColor: color,
                borderRadius: "4px",
              }} />
              <span style={{
                fontSize: "12px",
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
              }}>
                {key === "meritExcellence" ? "Merit Excellence" :
                 key === "stemInnovation" ? "STEM Innovation" :
                 key === "concessions" ? "Concessions" : "Sports"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

