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
      <Input
        ref={ref}
        placeholder={searchPlaceHolder || "Search"}
        {...(typeof searchValue !== "undefined" ? { value: searchValue } : {})}
        className={cn("min-h-10 w-full max-w-[500px]", className)}
        prefixIcon={<Search20Regular />}
        iconClassName="text-[#707070]"
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        {...props}
      />
    );
  }
);

Search.displayName = "SearchFilter";

