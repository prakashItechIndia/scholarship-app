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
      percentage: 90,
      color: "#3B82F6",
    },
    {
      label: "Student Retention Rate",
      value: "94.5%",
      percentage: 87,
      color: "#F59E0B",
    },
    {
      label: "Satisfaction Score",
      value: "4.7/5.0",
      percentage: 83,
      color: "#14B8A6",
    },
    {
      label: "Budget Utilization",
      value: "73%",
      percentage: 79,
      color: "#A855F7",
    },
  ],
}) => {
  const size = 350;
  const centerX = size / 2 - 10;
  const centerY = size / 2 + 20;
  const ringWidth = 16;
  const gap = 16;
  const startRadius = 60;

  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{
          fontSize: "16px",
          lineHeight: "22px",
          fontWeight: 600,
          color: "#242424",
          marginBottom: "4px",
          fontFamily: "'Inter', sans-serif",
        }}>
          Performance Metrics
        </h3>
        <p style={{
          fontSize: "12px",
          lineHeight: "16px",
          color: "#616161",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
        }}>
          Key performance Indicators for scholarship programs.
        </p>
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        gap: "32px",
      }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {metrics.map((metric, index) => {
            const radius = startRadius + (metrics.length - 1 - index) * (ringWidth + gap);
            const circumference = 2 * Math.PI * radius;
            
            // The design shows rings that are almost full circles.
            // Gap is at the top.
            const totalTrackAngle = 320; // degrees
            const trackLength = (totalTrackAngle / 360) * circumference;
            
            // Progress is a percentage of the visible track (0-100)
            const progressLength = (Math.min(100, Math.max(0, metric.percentage)) / 100) * trackLength;
            
            // Start rotation: Top (-90deg)
            const startRotation = -90;

            // Label position: In the gap at the top.
            const labelX = centerX+50;
            const labelY = centerY - radius;

            return (
              <g key={index}>
                {/* Progress ring - Growing counter-clockwise */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth={ringWidth}
                  strokeDasharray={`${progressLength} ${circumference}`}
                  // strokeLinecap="round"
                  // Flip horizontally to make it grow counter-clockwise from the top
                  transform={`translate(${centerX * 2}, 0) scale(-1, 1) rotate(${startRotation} ${centerX} ${centerY})`}
                  style={{
                    transition: "stroke-dasharray 0.5s ease",
                  }}
                />
                {/* Value Label */}
                <text
                  x={labelX}
                  y={labelY}
                  fontSize="12"
                  // lineHeight="12px"
                  fontWeight={500}
                  fill="#242424"
                  fontFamily="'Inter', sans-serif"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {metric.value}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, auto)",
          justifyContent: "center",
          columnGap: "48px",
          rowGap: "12px",
          width: "100%",
          marginTop: "12px",
           marginLeft:"52px"
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
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: metric.color,
              }} />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                width: "180px",
                gap: "12px",
              }}>
                <span style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight:"20px",
                  color: "#424242",
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: "nowrap",
                }}>
                  {metric.label}
                </span>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};





