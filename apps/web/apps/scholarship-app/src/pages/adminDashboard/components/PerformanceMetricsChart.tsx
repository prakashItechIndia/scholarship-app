import * as React from "react";
import { Card } from "@shared/components";

interface PerformanceMetric {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

interface PerformanceMetricsChartProps {
  metrics?: PerformanceMetric[];
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = ({
  metrics = [
    {
      label: "Average Processing Time",
      value: "8 days",
      percentage: 65,
      color: "#3b82f6",
    },
    {
      label: "Student Retention Rate",
      value: "94.5%",
      percentage: 95,
      color: "#f59e0b",
    },
    {
      label: "Satisfaction Score",
      value: "4.7/5.0",
      percentage: 94,
      color: "#10b981",
    },
    {
      label: "Budget Utilization",
      value: "73%",
      percentage: 73,
      color: "#8b5cf6",
    },
  ],
}) => {
  const centerX = 120;
  const centerY = 120;
  const maxRadius = 100;
  const ringWidth = 20;

  const renderRing = (radius: number, percentage: number, color: string, index: number) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const rotation = -90; // Start from top

    return (
      <circle
        key={index}
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={ringWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(${rotation} ${centerX} ${centerY})`}
        style={{
          transition: "stroke-dashoffset 0.5s ease",
        }}
      />
    );
  };

  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "24px",
    }}>
      <div style={{
        marginBottom: "24px",
      }}>
        <h3 style={{
          fontSize: "18px",
          lineHeight: "24px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "4px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Performance Metrics
        </h3>
        <p style={{
          fontSize: "14px",
          lineHeight: "20px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
        }}>
          Key performance Indicators for scholarship programs.
        </p>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}>
        {/* Concentric Rings Chart */}
        <div style={{ position: "relative" }}>
          <svg width="240" height="240">
            {/* Background circles */}
            {metrics.map((_, index) => {
              const radius = maxRadius - (metrics.length - index - 1) * (ringWidth + 5);
              return (
                <circle
                  key={`bg-${index}`}
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="#e0e0e0"
                  strokeWidth={ringWidth}
                />
              );
            })}
            {/* Filled rings */}
            {metrics.map((metric, index) => {
              const radius = maxRadius - (metrics.length - index - 1) * (ringWidth + 5);
              return renderRing(radius, metric.percentage, metric.color, index);
            })}
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 20}
              fontSize="16"
              fontWeight={600}
              fill="#242424"
              fontFamily="'Inter', sans-serif"
              textAnchor="middle"
            >
              {metrics[0]?.value}
            </text>
            <text
              x={centerX}
              y={centerY}
              fontSize="14"
              fill="#616161"
              fontFamily="'Inter', sans-serif"
              textAnchor="middle"
            >
              {metrics[0]?.label}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          width: "100%",
        }}>
          {metrics.map((metric, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: metric.color,
              }} />
              <div style={{
                display: "flex",
                flexDirection: "column",
              }}>
                <span style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#242424",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {metric.label}
                </span>
                <span style={{
                  fontSize: "12px",
                  color: "#616161",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

