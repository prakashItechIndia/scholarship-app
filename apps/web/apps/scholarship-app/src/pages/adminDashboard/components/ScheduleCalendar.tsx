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
  currentMonth = new Date(),
  onMonthChange,
}) => {
  const [selectedDate, setSelectedDate] = React.useState(currentMonth);

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

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
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

  const getEventForDate = (day: number | null) => {
    if (day === null) return null;
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.find((e) => e.date === dateStr);
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
            Stay updated with meetings, deadlines, and activities.
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
          gap: "8px",
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
                padding: "8px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const event = getEventForDate(day);
            const isToday = day === new Date().getDate() &&
              selectedDate.getMonth() === new Date().getMonth() &&
              selectedDate.getFullYear() === new Date().getFullYear();

            return (
              <div
                key={index}
                style={{
                  minHeight: "40px",
                  padding: "4px",
                  border: isToday ? "2px solid #0f6cbd" : "1px solid #e0e0e0",
                  borderRadius: "4px",
                  backgroundColor: isToday ? "#e6f2ff" : "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {day !== null && (
                  <>
                    <span style={{
                      fontSize: "12px",
                      fontWeight: isToday ? 600 : 400,
                      color: isToday ? "#0f6cbd" : "#242424",
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {day}
                    </span>
                    {event && (
                      <div style={{
                        fontSize: "8px",
                        color: "#616161",
                        backgroundColor: "#f3f4f6",
                        padding: "2px 4px",
                        borderRadius: "2px",
                        marginTop: "2px",
                        textAlign: "center",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={event.title}
                      >
                        {event.title}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

