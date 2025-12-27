import * as React from "react";
import { Card, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@shared/components";
import { ChevronDown24Regular } from "@fluentui/react-icons";

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
  selectedMonth = "October 2025",
  onMonthChange,
}) => {
  const colors = {
    pending: "#3C50E0",
    inReview: "#6577F3",
    rejected: "#80CAEE",
    approved: "#0FADCF",
  };

  // Calculate angles for donut chart
  const radius = 145;
  const centerX = 120;
  const centerY = 210;
  const strokeWidth = 65;

  // To match the image visual exactly
  const segments = [
    { percent: 40, color: colors.rejected, label: "Rejected" },
    { percent: 15, color: colors.approved, label: "Approved" },
    { percent: 25, color: colors.pending, label: "Pending", exploded: true },
    { percent: 20, color: colors.inReview, label: "In Review" },
  ];


  const createSegmentPath = (startAngle: number, endAngle: number, r: number) => {
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    
    const cx = centerX;
    const cy = centerY;

    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
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
        <div style={{color: "#616161" }}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button
                style={{
                  width: "130px",
                  height: "32px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #E0E0E0",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: selectedMonth ? "#616161" : "#616161",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                }}
              >
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "12px", color: "#616161", fontWeight: 400 }}>
                  {selectedMonth || "Select Month"}
                </span>
                <ChevronDown24Regular style={{ width: "16px", height: "16px", color: "#616161", flexShrink: 0 }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {monthOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onMonthChange?.(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}>
        {/* Donut Chart */}
        <div style={{ position: "relative",marginBottom: "34px",paddingBottom: "114px",marginTop:"-10px" }}>
          <svg width="240" height="240" style={{ overflow: "visible" }}>
            {segments.map((segment, index) => {
              // Calculate angles deterministically based on previous segments
              const previousPercent = segments.slice(0, index).reduce((sum, s) => sum + s.percent, 0);
              const startAngle = -90 + (previousPercent / 100) * 360;
              const endAngle = startAngle + (segment.percent / 100) * 360;
              
              const currentStrokeWidth = segment.exploded ? strokeWidth + 16 : strokeWidth;
              // Align inner circles: Inner Radius = radius - strokeWidth / 2
              const innerRadius = radius - strokeWidth / 2;
              const currentRadius = innerRadius + currentStrokeWidth / 2;
              
              const path = createSegmentPath(startAngle, endAngle, currentRadius);

              return (
                <path
                  key={index}
                  d={path}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={currentStrokeWidth}
                  
                />
              );
            })}
            {/* Center text */}
            <text
              x={centerX}
              y={centerY + 8}
              fontSize="38"
              fontWeight={700}
              fill="#242424"
              fontFamily="'Inter', sans-serif"
              textAnchor="middle"
            >
              2548
            </text>
            <text
              x={centerX}
              y={centerY + 35}
              fontSize="16"
              fontWeight={500}
              fill="#616161"
              fontFamily="'Inter', sans-serif"
              textAnchor="middle"
            >
              Applications
            </text>
          </svg>
          
          {/* Tooltip-like label for Pending - Exact Match */}
         
        </div>

        {/* Legend */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, auto)",
          justifyContent: "center",
          columnGap: "50px",
          rowGap: "16px",
          width: "100%",
        }}>
          {[...segments].sort((a, b) => {
            const order = ["Pending", "In Review","Rejected","Approved"];
            return order.indexOf(a.label) - order.indexOf(b.label);
          }).map((segment, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
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
                gap: "45px",
              }}>
                <span style={{
                  fontSize: "13px",
                  lineHeight: "20px",
                  fontWeight: 400,
                  color: "#424242",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {segment.label}
                </span>
                <span style={{
                  fontSize: "13px",
                  color: "#424242",
                  fontWeight: 400,
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

