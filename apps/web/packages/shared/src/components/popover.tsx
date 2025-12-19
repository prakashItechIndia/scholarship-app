import * as React from "react";
import { Callout, ICalloutProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const Popover = ({ open: controlledOpen, onOpenChange, children }: PopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
};

Popover.displayName = "Popover";

const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const { open, setOpen } = React.useContext(PopoverContext);
  const triggerRef = React.useRef<HTMLElement>(null);

  React.useImperativeHandle(ref, () => triggerRef.current!);

  const handleClick = () => {
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      ...props,
    } as any);
  }

  return (
    <div ref={triggerRef as any} onClick={handleClick} {...props}>
      {children}
    </div>
  );
});

PopoverTrigger.displayName = "PopoverTrigger";

type PopoverContentProps = Omit<ICalloutProps, "target"> & {
  align?: "start" | "end" | "center";
};

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, children, align, ...props }, ref) => {
    const { open, setOpen } = React.useContext(PopoverContext);
    const triggerRef = React.useRef<HTMLElement>(null);

    if (!open) return null;

    return (
      <Callout
        componentRef={ref as any}
        target={triggerRef.current}
        onDismiss={() => setOpen(false)}
        className={cn("z-50 w-72 rounded-md border bg-white p-4 shadow-md", className)}
        {...props}
      >
        {children}
      </Callout>
    );
  }
);

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };

