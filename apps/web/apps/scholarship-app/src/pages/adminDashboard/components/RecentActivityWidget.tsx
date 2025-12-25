import * as React from "react";
import { Card, Select } from "@shared/components";
import { ActivityItem } from "./ActivityItem";

interface Activity {
  name: string;
  action: string;
  timestamp: string;
  color: string;
}

interface RecentActivityWidgetProps {
  activities?: Activity[];
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities = [
    {
      name: "Saravanan",
      action: "Submitted Application - Merit Excellence Scholarship",
      timestamp: "Just now",
      color: "#10b981",
    },
    {
      name: "Muthamilselvan",
      action: "Updated Profile",
      timestamp: "12 minutes ago",
      color: "#f59e0b",
    },
    {
      name: "Sarathi",
      action: "Uploaded Document - Academic Transcript",
      timestamp: "30 minutes ago",
      color: "#eab308",
    },
    {
      name: "Parasuraman",
      action: "Application Approved - STEM Innovation Grant",
      timestamp: "12 hours ago",
      color: "#3b82f6",
    },
    {
      name: "Annadurai",
      action: "Registered Account",
      timestamp: "Yesterday, 11:59 AM",
      color: "#8b5cf6",
    },
  ],
  selectedMonth = "September 2025",
  onMonthChange,
}) => {
  const monthOptions = [
    { value: "September 2025", label: "September 2025" },
    { value: "August 2025", label: "August 2025" },
    { value: "July 2025", label: "July 2025" },
    { value: "June 2025", label: "June 2025" },
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
            Recent Activity
          </h3>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Monitor the most recent interactions and updates our staff.
          </p>
        </div>
        <div style={{ 
          width: "150px",
          flexShrink: 0,
        }}>
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
        gap: "12px",
      }}>
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            name={activity.name}
            action={activity.action}
            timestamp={activity.timestamp}
            color={activity.color}
          />
        ))}
      </div>
    </Card>
  );
};

