import * as React from "react";
import { Pivot, PivotItem, IPivotProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface TabsProps extends Omit<IPivotProps, "onLinkClick" | "styles"> {
  variant?: "default" | "pills" | "underline";
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant = "default", defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [selectedKey, setSelectedKey] = React.useState<string | undefined>(
      value || defaultValue
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedKey(value);
      }
    }, [value]);

    const handleLinkClick = (item?: PivotItem, _ev?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
      if (item?.props.itemKey) {
        setSelectedKey(item.props.itemKey);
        onValueChange?.(item.props.itemKey);
      }
    };

    // Internal styles - maintained within component
    const internalStyles = React.useMemo(() => ({
      root: {
        width: "100%",
      },
      link: {
        fontSize: "14px",
        fontWeight: "400" as const,
        color: "#323130",
        padding: "8px 16px",
      },
      linkIsSelected: {
        fontSize: "14px",
        fontWeight: "600" as const,
        color: "#0078d4",
        borderBottom: "2px solid #0078d4",
      },
      linkContent: {
        fontSize: "14px",
      },
    } as any), []);

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <Pivot
          selectedKey={selectedKey}
          onLinkClick={handleLinkClick}
          styles={internalStyles}
          {...props}
        >
          {children}
        </Pivot>
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-flex h-10 items-center justify-center rounded-md", className)} {...props} />
  )
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
  variant?: "default" | "pills" | "underline";
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, icon, variant, ...props }, ref) => {
    const headerText = typeof children === "string" ? children : String(children);
    return (
      <PivotItem
        componentRef={ref as any}
        itemKey={value}
        headerText={headerText}
        className={cn(className)}
        {...(props as any)}
      />
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

const TabList = TabsList;
const Tab = TabsTrigger;
const TabPanel = TabsContent;

export { Tabs, TabsList, TabsTrigger, TabsContent, TabList, Tab, TabPanel };
