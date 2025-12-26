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
    { month: "Jan", budget2024: 1000000, budget2025: 2200000 },
    { month: "Feb", budget2024: 1800000, budget2025: 3000000 },
    { month: "Mar", budget2024: 1800000, budget2025: 1200000 },
    { month: "Apr", budget2024: 1800000, budget2025: 2800000 },
    { month: "May", budget2024: 3200000, budget2025: 3700000 },
    { month: "Jun", budget2024: 3875300, budget2025: 2200000 },
    { month: "Jul", budget2024: 3500000, budget2025: 3800000 },
    { month: "Aug", budget2024: 2200000, budget2025: 3500000 },
    { month: "Sep", budget2024: 2000000, budget2025: 3200000 },
    { month: "Oct", budget2024: 2200000, budget2025: 1265700 },
    { month: "Nov", budget2024: 2500000, budget2025: 3500000 },
    { month: "Dec", budget2024: 2400000, budget2025: 3700000 },
  ],
  selectedYear = "2024 - 2025",
  onYearChange,
}) => {
  const chartHeight = 350;
  const chartWidth = 800;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30; // Increased from 20 to move graph down
  const paddingBottom = 10; // Reduced from 80 to keep total height
  const maxValue = 4500000; // 45L scale

  const yearOptions = [
    { value: "2024 - 2025", label: "2024 - 2025" },
    { value: "2023 - 2024", label: "2023 - 2024" },
    { value: "2022 - 2023", label: "2022 - 2023" },
  ];

  const getY = (value: number) => {
    return chartHeight - (value / maxValue) * chartHeight + paddingTop;
  };

  const getX = (index: number) => {
    return paddingLeft + (index * (chartWidth - paddingLeft - paddingRight)) / (data.length - 1);
  };

  // Helper to create smooth path using Catmull-Rom inspired tangents
  const createSmoothPath = (getValue: (d: FundSpendingDataPoint) => number) => {
    const points = data.map((d, i) => ({ x: getX(i), y: getY(getValue(d)) }));
    if (points.length === 0) return "";

    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      
      // Calculate tangents based on neighboring points
      const prev = points[i - 1] || p0;
      const next = points[i + 2] || p1;
      
      // Tension factor (6 is standard for Catmull-Rom)
      const tension = 6;
      
      const cp1x = p0.x + (p1.x - prev.x) / tension;
      const cp1y = p0.y + (p1.y - prev.y) / tension;
      
      const cp2x = p1.x - (next.x - p0.x) / tension;
      const cp2y = p1.y - (next.y - p0.y) / tension;
      
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
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
            Fund Spending
          </h3>
          <p style={{
            fontSize: "12px",
            lineHeight: "16px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}>
            Total budget utilization
          </p>
        </div>
        <div>
          <Select
            placeholder="Select Year"
            options={yearOptions}
            selectedKey={selectedYear}
            onValueChange={(value) => onYearChange?.(value)}
          />
        </div>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg width={chartWidth} height={chartHeight + paddingTop + paddingBottom} style={{ overflow: "visible" }}>
          {/* Y-axis labels and grid lines */}
          {[1000000, 2000000, 3000000, 4000000].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <text
                  x="0"
                  y={y + 5}
                  fontSize="13"
                  fill="#616161"
                  fontFamily="'Inter', sans-serif"
                >
                  ₹ {val / 100000}L
                </text>
              </g>
            );
          })}
          {/* Vertical Grid Lines */}
          {data.map((_, i) => (
            <line
              key={i}
              x1={getX(i)}
              y1={paddingTop}
              x2={getX(i)}
              y2={getY(1000000)}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* 2024 Line (Blue) */}
          <path
            d={createSmoothPath((d) => d.budget2024)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* 2025 Line (Red) */}
          <path
            d={createSmoothPath((d) => d.budget2025)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Vertical Dashed Lines and Tooltips */}
          {/* Jun (Index 5) */}
          <line
            x1={getX(5)}
            y1={paddingTop}
            x2={getX(5)}
            y2={chartHeight + paddingTop - 50}
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <circle cx={getX(5)} cy={getY(data[5].budget2024)} r="6" fill="#3b82f6" />
          <g transform={`translate(${getX(5) - 45}, ${getY(data[5].budget2024) - 40})`}>
            <rect width="90" height="28" rx="4" fill="#e0f2fe" />
            <text x="45" y="18" fontSize="11" fontWeight="600" fill="#0369a1" textAnchor="middle" fontFamily="'Inter', sans-serif">
              ₹ 38,753,00
            </text>
          </g>

          {/* Oct (Index 9) */}
          <line
            x1={getX(9)}
            y1={paddingTop}
            x2={getX(9)}
            y2={chartHeight + paddingTop - 50}
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <circle cx={getX(9)} cy={getY(data[9].budget2025)} r="6" fill="#ef4444" />
          <g transform={`translate(${getX(9) + 10}, ${getY(data[9].budget2025) - 10})`}>
            <rect width="80" height="24" rx="4" fill="#fee2e2" />
            <text x="40" y="16" fontSize="11" fontWeight="600" fill="#b91c1c" textAnchor="middle" fontFamily="'Inter', sans-serif">
              ₹ 12,657,00
            </text>
          </g>

          {/* X-axis dots and labels */}
          {data.map((d, i) => (
            <g key={i}>
              <circle
                cx={getX(i)}
                cy={chartHeight + paddingTop - 40}
                r="3.5"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
              />
              {/* Highlight Jun and Oct dots */}
              {i === 5 && <circle cx={getX(i)} cy={chartHeight + paddingTop - 40} r="3.5" fill="#3b82f6" stroke="#3b82f6" />}
              {i === 9 && <circle cx={getX(i)} cy={chartHeight + paddingTop - 40} r="3.5" fill="#ef4444" stroke="#ef4444" />}
              
              <text
                x={getX(i)}
                y={chartHeight + paddingTop -15}
                fontSize="13"
                fill="#616161"
                fontFamily="'Inter', sans-serif"
                textAnchor="middle"
              >
                {d.month}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        gap: "32px",
        marginTop: "32px",
        justifyContent: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#3b82f6" }} />
          <span style={{ fontSize: "14px", color: "#616161", fontFamily: "'Inter', sans-serif" }}>
            Total budget 2024
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <span style={{ fontSize: "14px", color: "#616161", fontFamily: "'Inter', sans-serif" }}>
            Total budget 2025
          </span>
        </div>
      </div>
    </Card>
  );
};
