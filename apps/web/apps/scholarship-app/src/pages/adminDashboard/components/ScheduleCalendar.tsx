import * as React from "react";
import { Card } from "@shared/components";
import { CalendarEvent } from "../types";
import { mockCalendarEvents } from "../constants";
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";

interface ScheduleCalendarProps {
  events?: CalendarEvent[];
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  events = mockCalendarEvents,
  currentMonth,
  onMonthChange,
}) => {
  // Default to October 2025 to match the design
  const defaultDate = currentMonth ?? new Date(2025, 9, 1); // October 2025 (month is 0-indexed)
  const [selectedDate, setSelectedDate] = React.useState(defaultDate);
  const [hoveredDate, setHoveredDate] = React.useState<number | null>(null);
  
  // Use events prop or fallback to mock data
  const displayEvents = (events && events.length > 0) ? events : mockCalendarEvents;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const days: ({ day: number; isCurrentMonth: boolean } | null)[] = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    // Add all days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Add days from next month to fill the grid (42 cells total for 6 weeks)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const monthYear = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
    onMonthChange?.(newDate);
  };

  const getEventForDate = (day: number | null, isCurrentMonth: boolean) => {
    if (day === null || !isCurrentMonth) return null;
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const event = displayEvents.find((e) => e.date === dateStr);
    return event ?? null;
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
            Schedule Calendar
          </h3>
          <p style={{
            fontSize: "14px",
            lineHeight: "20px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
          }}>
            Stay Updated with Meetings, Deadlines, and Activities.
          </p>
        </div>
      </div>

      <div>
        {/* Month Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}>
          <button
            onClick={handlePreviousMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronLeft20Regular style={{ width: "20px", height: "20px", color: "#616161" }} />
          </button>
          <span style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#242424",
            fontFamily: "'Inter', sans-serif",
          }}>
            {monthYear}
          </span>
          <button
            onClick={handleNextMonth}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronRight20Regular style={{ width: "20px", height: "20px", color: "#616161" }} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}>
          {/* Day headers */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#616161",
                textAlign: "center",
                padding: "8px 4px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((dayData, index) => {
            if (dayData === null) {
              return (
                <div
                  key={index}
                  style={{
                    minHeight: "48px",
                    padding: "4px",
                  }}
                />
              );
            }

            const { day, isCurrentMonth } = dayData;
            const event = getEventForDate(day, isCurrentMonth);
            const isHovered = hoveredDate === day && isCurrentMonth;
            const isSelected = event && isHovered;

            return (
              <div
                key={index}
                style={{
                  minHeight: "48px",
                  padding: "4px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: event ? "pointer" : "default",
                }}
                onMouseEnter={() => {
                  if (isCurrentMonth) {
                    setHoveredDate(day);
                  }
                }}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Date number with circular background for selected dates */}
                <div style={{
                  width: isSelected ? "32px" : "auto",
                  height: isSelected ? "32px" : "auto",
                  borderRadius: isSelected ? "50%" : "0",
                  backgroundColor: isSelected ? "#0f6cbd" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: event ? "4px" : "0",
                }}>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? "#ffffff" : (isCurrentMonth ? "#242424" : "#d1d5db"),
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {day}
                  </span>
                </div>
                {/* Blue dot indicator for dates with events */}
                {event && (
                  <div style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#0f6cbd",
                    marginTop: "2px",
                  }} />
                )}
                {/* Tooltip for events - show when hovering over dates with events */}
                {event && isHovered && (
                  <div style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    marginBottom: "8px",
                    padding: "6px 12px",
                    backgroundColor: "#242424",
                    color: "#ffffff",
                    borderRadius: "4px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    zIndex: 1000,
                    fontFamily: "'Inter', sans-serif",
                    pointerEvents: "none",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}>
                    {event.title}
                    <div style={{
                      position: "absolute",
                      bottom: "-4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: "4px solid #242424",
                    }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

