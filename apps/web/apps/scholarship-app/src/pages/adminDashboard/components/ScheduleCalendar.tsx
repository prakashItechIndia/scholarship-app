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
  const [viewDate, setViewDate] = React.useState(currentMonth);
  const [selectedDay, setSelectedDay] = React.useState<number | null>(new Date().getDate());

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

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    // Add days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Fill the rest of the grid to make it 6 rows (42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  };

  const days = getDaysInMonth(viewDate);
  const monthYear = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  const handlePreviousMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setViewDate(newDate);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setViewDate(newDate);
    onMonthChange?.(newDate);
  };

  const getEventForDate = (day: number) => {
    const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
        height: "10%",
        marginTop: "-2px",
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
            Schedule Calendar
          </h3>
          <p style={{
            fontSize: "12px",
            lineHeight: "16px",
            color: "#616161",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
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
          backgroundColor: "#EFF6FF",
          height: "56px",
          border: "1px solid #BFDBFE",
          borderRadius: "8px 8px 0 0",
          borderBottom: "none"
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
              marginLeft: "12px"
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
              marginRight: "12px"
            }}
          >
            <ChevronRight20Regular style={{ width: "20px", height: "20px", color: "#616161" }} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          border: "1px solid #E0E0E0",
          borderRadius: "0 0 8px 8px",
        }}>
          {/* Day headers */}
          <div style={{
            gridColumn: "1 / 8",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            padding: "12px 20px 16px 18px"
          }}>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#344051",
                  textAlign: "center",
                  paddingTop: "4px",
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: "16px",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div style={{
            gridColumn: "1 / 8",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            padding: "8px 20px 0px 18px",
            borderTop: "2px solid #E0E0E0",
            // marginBottom: "20px",
          }}>
            {days.map((item, index) => {
              const event = item.isCurrentMonth ? getEventForDate(item.day) : null;
              const isSelected = item.isCurrentMonth && item.day === selectedDay;

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 4px 6px 0px",
                  }}
                >
                  <div 
                    onClick={() => item.isCurrentMonth && setSelectedDay(item.day)}
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: isSelected ? "#2453C3" : "transparent",
                      cursor: item.isCurrentMonth ? "pointer" : "default",
                    }}
                  >
                    <span style={{
                      fontSize: "12px",
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? "#ffffff" : (item.isCurrentMonth ? "#344051" : "#808080"),
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {item.day}
                    </span>
                  </div>
                  {item.isCurrentMonth && event && (
                    <div style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: isSelected ? "#2453C3" : "#0f6cbd",
                      marginTop: "2px"
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
