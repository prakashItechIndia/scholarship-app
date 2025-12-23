import * as React from "react";
import { Button, Popover, PopoverTrigger, PopoverContent } from "@shared/components";
import { FilterRegular } from "@fluentui/react-icons";

interface ProcessFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProcessFilters: React.FC<ProcessFiltersProps> = ({ open, onOpenChange }) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <Button
          appearance="outline"
          onClick={() => onOpenChange(!open)}
          aria-label="Filter"
          style={{
            width: "32px",
            minWidth: "32px",
            maxWidth: "32px",
            height: "32px",
            padding: 0,
            borderColor: "#d1d5db",
            backgroundColor: "#fff",
          }}
        >
          <FilterRegular style={{ width: "20px", height: "20px", color: "#616161" }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: "256px", padding: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 600,
            color: "#242424",
            marginBottom: "12px",
            fontFamily: "'Inter', sans-serif",
          }}>
            Filter Options
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 500,
              color: "#424242",
              fontFamily: "'Inter', sans-serif",
            }}>
              Status
            </label>
            <select style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d1d1",
              borderRadius: "6px",
              fontSize: "14px",
              lineHeight: "20px",
              fontFamily: "'Inter', sans-serif",
              backgroundColor: "#ffffff",
              color: "#242424",
            }}>
              <option>All Status</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 500,
              color: "#424242",
              fontFamily: "'Inter', sans-serif",
            }}>
              Date Range
            </label>
            <input
              type="date"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d1d1",
                borderRadius: "6px",
                fontSize: "14px",
                lineHeight: "20px",
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "#ffffff",
                color: "#242424",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", paddingTop: "8px" }}>
            <Button
              appearance="primary"
              size="small"
              onClick={() => onOpenChange(false)}
              style={{ flex: 1 }}
            >
              Apply
            </Button>
            <Button
              appearance="outline"
              size="small"
              onClick={() => onOpenChange(false)}
              style={{ flex: 1 }}
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProcessFilters;

