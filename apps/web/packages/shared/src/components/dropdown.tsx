import * as React from "react";
import { ContextualMenu, IContextualMenuProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface DropdownMenuProps {
  children: React.ReactNode;
}

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  targetElement: HTMLElement | null;
  setTargetElement: (el: HTMLElement | null) => void;
}>({
  open: false,
  setOpen: () => {},
  targetElement: null,
  setTargetElement: () => {},
});

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(null);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, targetElement, setTargetElement }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ children, asChild, ...props }, ref) => {
  const { setOpen, setTargetElement } = React.useContext(DropdownMenuContext);
  const triggerRef = React.useRef<HTMLElement>(null);

  React.useImperativeHandle(ref, () => triggerRef.current!);

  React.useEffect(() => {
    if (triggerRef.current) {
      setTargetElement(triggerRef.current);
    }
  }, [setTargetElement]);

  const handleClick = () => {
    setOpen(true);
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

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

type DropdownMenuContentProps = {
  align?: "start" | "end" | "center";
  children: React.ReactNode;
};

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, children, align, ...props }, ref) => {
    const { open, setOpen, targetElement } = React.useContext(DropdownMenuContext);
    const [menuItems, setMenuItems] = React.useState<IContextualMenuProps["items"]>([]);

    React.useEffect(() => {
      // Extract menu items from children
      const items: IContextualMenuProps["items"] = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && (child.type as any)?.displayName === "DropdownMenuItem") {
          items.push({
            key: (child.props as any).key || String(items.length),
            text: (child.props as any).children || (child.props as any).label,
            onClick: (child.props as any).onClick,
            iconProps: (child.props as any).icon ? { iconName: (child.props as any).icon } : undefined,
          });
        }
      });
      setMenuItems(items);
    }, [children]);

    if (!open || !targetElement) return null;

    return (
      <ContextualMenu
        target={targetElement}
        onDismiss={() => setOpen(false)}
        items={menuItems}
        {...props}
      />
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode; label?: string }
>(({ className, children, icon, label, onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 cursor-pointer hover:bg-gray-100", className)}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children || label}
    </div>
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("h-px bg-gray-200 my-1", className)} {...props} />
));

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
  )
);

DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};

