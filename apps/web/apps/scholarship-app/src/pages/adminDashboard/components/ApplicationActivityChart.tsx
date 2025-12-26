import * as React from "react";
import { Card, DatePicker, CalendarIcon } from "@shared/components";
import { ApplicationActivityData } from "../types";
import { mockApplicationActivityData } from "../constants";

interface ApplicationActivityChartProps {
  data?: ApplicationActivityData[];
  selectedDate?: Date;
  onDateChange?: (date: Date | null | undefined) => void;
}

export const ApplicationActivityChart: React.FC<ApplicationActivityChartProps> = ({
  data = mockApplicationActivityData,
  selectedDate = new Date(2024, 8, 1),
  onDateChange,
}) => {
  const maxValue = 400;
  const chartHeight = 230;
  const chartPaddingTop = 15; // Added padding to ensure top labels are visible
  const spacing = 35.2; // Increased spacing between bars
  const barWidth = 16; // Reduced bar width
  const chartWidth = Math.max(600, 30 + data.length * (barWidth + spacing));

  return (
    <Card variant="elevated" style={{
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      padding: "24px",
      paddingTop:"15px",
      height: "370px",
      boxShadow: "none"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
        marginTop:"2px"
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: "16px",
            lineHeight: "22px",
            fontWeight: 600,
            color: "#242424",
            marginBottom: "4px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Application Activity
          </h3>
          <p style={{
            fontSize: "12px",
            lineHeight: "16px",
            color: "#616161",
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif",
          }}>
            Track the number of applications received each month.
          </p>
        </div>
        <div style={{ width: "180px", position: "relative" }}>
          <DatePicker
            value={selectedDate}
            onSelectDate={onDateChange}
            placeholder="Select Date"
            allowTextInput={false}
            styles={{
              icon: { display: "none" }
            }}
            textField={{
              styles: {
                fieldGroup: {
                  height: "32px",
                  minHeight: "32px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                },
                field: {
                  height: "32px",
                  lineHeight: "32px",
                  fontSize: "14px",
                  paddingLeft: "34px", // Space for icon
                },
              }
            }}
          />
          <div style={{ 
            position: "absolute", 
            left: "10px", 
            top: "16px", // Centered vertically for 32px height
            transform: "translateY(-50%)", 
            pointerEvents: "none",
            display: "flex",
            alignItems: "center"
          }}>
            <CalendarIcon style={{ color: "#242424" }} />
          </div>
        </div>
      </div>

      <div style={{
        width: "100%",
        overflowX: "auto",
      }}>
        <svg
          width={chartWidth}
          height={chartHeight + chartPaddingTop + 40}
          style={{
            minWidth: "100%",
          }}
        >
          {/* Y-axis labels */}
          {[0, 100, 200, 300, 400].map((value) => {
            const y = chartHeight - (value / maxValue) * chartHeight + chartPaddingTop;
            return (
              <g key={value}>
                <text
                  x="0"
                  y={y + 4}
                  fontSize="12"
                  fill="#616161"
                  fontFamily="'Inter', sans-serif"
                >
                  {value}
                </text>
                <line
                  x1="30"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#e0e0e0"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (Math.min(item.count, maxValue) / maxValue) * chartHeight;
            const x = 40 + index * (barWidth + spacing);
            const y = chartHeight - barHeight + chartPaddingTop;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#0f6cbd"
                  ry="10"
                />
                {/* <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  fontSize="10"
                  fill="#242424"
                  fontFamily="'Inter', sans-serif"
                  textAnchor="middle"
                >
                  {item.count}
                </text> */}
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = 40 + index * (barWidth + spacing) + barWidth / 2;
            return (
              <text
                key={index}
                x={x}
                y={chartHeight + chartPaddingTop + 20}
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

