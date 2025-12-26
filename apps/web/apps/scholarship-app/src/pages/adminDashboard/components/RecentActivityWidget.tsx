import * as React from "react";
import { Card } from "@shared/components";
import { ActivityItem } from "./ActivityItem";

interface Activity {
  name: string;
  action: string;
  timestamp: string;
  color: string;
  border:string
}

interface RecentActivityWidgetProps {
  activities?: Activity[];
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities = [
    {
      name: "Saravanan",
      action: "Submitted Application - Merit Excellence Scholarship",
      timestamp: "Just now",
      color: "#E0F9E7",
      border:"1px solid #58DB95"
    },
    {
      name: "Muthamilselvan",
      action: "Updated Profile",
      timestamp: "12 minutes ago",
      color: "#FDEEE4",
      border:"1px solid #F58969"
    },
    {
      name: "Sarathi",
      action: "Uploaded Document - Academic Transcript",
      timestamp: "30 minutes ago",
      color: "#FFF8E5",
      border:"1px solid #FECE79"
    },
    {
      name: "Parasuraman",
      action: "Application Approved - STEM Innovation Grant",
      timestamp: "12 hours ago",
      color: "#EFF6FF",
      border:"1px solid #BFDBFE"
    },
    {
      name: "Annadurai",
      action: "Registered Account",
      timestamp: "Yesterday, 11:59 AM",
      color: "#FAF5FF",
      border:" 1px solid #E9D5FF"
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
        gap: "15px",
      }}>
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            name={activity.name}
            action={activity.action}
            timestamp={activity.timestamp}
            color={activity.color}
            border={activity.border}
          />
        ))}
      </div>
    </Card>
  );
};

