import * as React from "react";
import { Card, Select } from "@shared/components";

interface ApplicationStatusData {
  pending: number;
  inReview: number;
  rejected: number;
  approved: number;
}

interface ApplicationStatusChartProps {
  data?: ApplicationStatusData;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export const ApplicationStatusChart: React.FC<ApplicationStatusChartProps> = ({
  data = {
    pending: 1656, // 65%
    inReview: 866, // 34%
    rejected: 102, // 4%
    approved: 178, // 7%
  },
  selectedMonth = "October 2025",
  onMonthChange,
}) => {
  const total = data.pending + data.inReview + data.rejected + data.approved;
  const pendingPercent = Math.round((data.pending / total) * 100);
  const inReviewPercent = Math.round((data.inReview / total) * 100);
  const rejectedPercent = Math.round((data.rejected / total) * 100);
  const approvedPercent = Math.round((data.approved / total) * 100);

  const colors = {
    pending: "#3b82f6",
    inReview: "#06b6d4",
    rejected: "#ef4444",
    approved: "#10b981",
  };

  // Calculate angles for donut chart
  const radius = 80;
  const innerRadius = 50;
  const centerX = 120;
  const centerY = 120;

  let currentAngle = -90; // Start from top

  const segments = [
    { value: data.pending, percent: pendingPercent, color: colors.pending, label: "Pending" },
    { value: data.inReview, percent: inReviewPercent, color: colors.inReview, label: "In Review" },
    { value: data.rejected, percent: rejectedPercent, color: colors.rejected, label: "Rejected" },
    { value: data.approved, percent: approvedPercent, color: colors.approved, label: "Approved" },
  ];

  const createArc = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = centerX + outerR * Math.cos(start);
    const y1 = centerY + outerR * Math.sin(start);
    const x2 = centerX + innerR * Math.cos(start);
    const y2 = centerY + innerR * Math.sin(start);
    const x3 = centerX + innerR * Math.cos(end);
    const y3 = centerY + innerR * Math.sin(end);
    const x4 = centerX + outerR * Math.cos(end);
    const y4 = centerY + outerR * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x4} ${y4} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2} ${y2} Z`;
  };

  const monthOptions = [
    { value: "October 2025", label: "October 2025" },
    { value: "September 2025", label: "September 2025" },
    { value: "August 2025", label: "August 2025" },
    { value: "July 2025", label: "July 2025" },
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
            Application Status
          </h3>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            View real-time updates on submitted applications.
          </p>
        </div>
        <div style={{ width: "150px" }}>
          <Select
            placeholder="Select Month"
            options={monthOptions}
            selectedKey={selectedMonth}
            onValueChange={(value) => onMonthChange?.(value)}
          />
        </div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}>
        {/* Donut Chart */}
        <div style={{ position: "relative" }}>
          <svg width="240" height="240">
            {segments.map((segment, index) => {
              const startAngle = currentAngle;
              const endAngle = currentAngle + (segment.value / total) * 360;
              const path = createArc(startAngle, endAngle, innerRadius, radius);
              currentAngle = endAngle;

              return (
                <path
                  key={index}
                  d={path}
                  fill={segment.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              );
            })}
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 10}
              fontSize="20"
              fontWeight={600}
              fill="#242424"
              fontFamily="'Inter', sans-serif"
              textAnchor="middle"
            >
              {total.toLocaleString()}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              fontSize="14"
              fill="#616161"
              fontFamily="'Inter', sans-serif"
              textAnchor="middle"
            >
              Applications
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
          {segments.map((segment, index) => (
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
                backgroundColor: segment.color,
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
                  {segment.label}
                </span>
                <span style={{
                  fontSize: "12px",
                  color: "#616161",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {segment.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

