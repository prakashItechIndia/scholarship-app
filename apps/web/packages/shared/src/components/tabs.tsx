import * as React from "react";
import {
  TabList,
  Tab,
  TabValue,
  SelectTabEvent,
  SelectTabData,
} from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  variant?: "default" | "pills" | "underline";
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = "default", defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<TabValue | undefined>(
      value || defaultValue
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
      setSelectedValue(data.value);
      if (onValueChange && typeof data.value === "string") {
        onValueChange(data.value);
      }
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <TabList selectedValue={selectedValue} onTabSelect={handleTabSelect}>
          {children}
        </TabList>
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

const TabsList = TabList;
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
  variant?: "default" | "pills" | "underline";
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, icon, variant, ...props }, ref) => {
    return (
      <Tab
        ref={ref}
        value={value}
        icon={icon}
        className={cn(className)}
        {...props}
      >
        {children}
      </Tab>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      role="tabpanel"
      className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
      {...props}
    />
  )
);
TabsContent.displayName = "TabsContent";

const TabPanel = TabsContent;

export { Tabs, TabsList, TabsTrigger, TabsContent, TabPanel };
