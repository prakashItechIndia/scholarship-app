import * as React from "react";
import { Input, InputProps } from "./input";
import { Search20Regular } from "@fluentui/react-icons";
import { cn } from "../lib/utils";

export interface SearchProps extends Omit<InputProps, "onChange"> {
  searchPlaceHolder?: string;
  onChange?: (value: string) => void;
  searchValue?: string;
}

export const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ searchPlaceHolder, onChange, searchValue, className, ...props }, ref) => {
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <Input
          ref={ref}
          placeholder={searchPlaceHolder || "Search"}
          {...(typeof searchValue !== "undefined" ? { value: searchValue } : {})}
          className={cn("min-h-10 w-full max-w-[500px] border-none", className)}
          onChange={(e) => {
            onChange?.(e.target.value);
          }}
          style={{
            paddingLeft: "20px", // 2px gap + 20px icon + 12px text padding
          }}
          {...props}
        />
        <div
          style={{
            position: "absolute",
            left: "2px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Search20Regular style={{ width: "20px", height: "20px", color: "#707070" }} />
        </div>
      </div>
    );
  }
);

Search.displayName = "SearchFilter";

