import * as React from "react";
import { Card } from "@shared/components";
import {
  Search20Regular,
} from "@fluentui/react-icons";

interface ActivityItem {
  name: string;
  action: string;
  timestamp: string;
  color: string;
}

interface RecentActivityWidgetProps {
  activities?: ActivityItem[];
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
}) => {
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
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}>
        {activities.map((activity, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              backgroundColor: `${activity.color}15`,
              borderLeft: `4px solid ${activity.color}`,
              borderRadius: "4px",
            }}
          >
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: activity.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <Search20Regular style={{ width: "16px", height: "16px", color: "#ffffff" }} />
            </div>
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}>
              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#242424",
                fontFamily: "'Inter', sans-serif",
              }}>
                {activity.name}
              </div>
              <div style={{
                fontSize: "12px",
                color: "#616161",
                fontFamily: "'Inter', sans-serif",
              }}>
                {activity.action}
              </div>
              <div style={{
                fontSize: "11px",
                color: "#9ca3af",
                fontFamily: "'Inter', sans-serif",
              }}>
                {activity.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

