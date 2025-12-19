import * as React from "react";
import { Dropdown, IDropdownProps, IDropdownOption } from "@fluentui/react";
import { cn } from "../lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Input } from "./input";

export interface SelectProps extends Omit<IDropdownProps, "onChange" | "options"> {
  variant?: "default" | "outline" | "filled";
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  options?: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      variant = "default",
      children,
      onValueChange,
      placeholder,
      searchable = false,
      searchPlaceholder = "Search...",
      options = [],
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (onValueChange && option) {
        onValueChange(String(option.key));
      }
      if (searchable) {
        setSearchQuery("");
      }
    };

    const handleOpenChange = (_event: React.FormEvent<HTMLDivElement>, isOpen?: boolean) => {
      setIsOpen(isOpen || false);
      if (!isOpen && searchable) {
        setSearchQuery("");
      }
    };

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) {
        return options;
      }
      const query = searchQuery.toLowerCase();
      return options.filter((opt) => opt.label.toLowerCase().includes(query));
    }, [searchable, searchQuery, options]);

    const dropdownOptions: IDropdownOption[] = filteredOptions.map((opt) => ({
      key: opt.value,
      text: opt.label,
    }));

    if (searchable) {
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <div className="relative w-full">
              <button
                ref={ref as any}
                className={cn(
                  "w-full h-8 px-3 text-left border rounded flex items-center justify-between",
                  className
                )}
                type="button"
              >
                <span className="truncate">
                  {options.find((opt) => opt.value === props.selectedKey)?.label || placeholder}
                </span>
                <span>▼</span>
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="p-2">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              <div className="max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-2 text-center text-sm text-gray-500">No results found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "p-2 cursor-pointer hover:bg-gray-100 rounded",
                        props.selectedKey === option.value && "bg-blue-100"
                      )}
                      onClick={() => {
                        onValueChange?.(option.value);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      {option.label}
                    </div>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Dropdown
        componentRef={ref as any}
        className={cn(className)}
        placeholder={placeholder}
        options={dropdownOptions}
        onChange={handleChange}
        onOpenChange={handleOpenChange}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

// Compound component parts for compatibility
const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <button ref={ref} className={cn("", className)} {...props}>
      {children}
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, children, ...props }, ref) => {
  return (
    <span ref={ref} className={cn("block truncate", className)} {...props}>
      {children || placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  )
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; text?: string }
>(({ className, children, value, text, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {children || text || value}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

