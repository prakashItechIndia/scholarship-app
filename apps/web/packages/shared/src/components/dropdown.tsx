import * as React from "react";
import { ContextualMenu, IContextualMenuItem } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContextType {
  items: IContextualMenuItem[];
  setItems: (items: IContextualMenuItem[]) => void;
  targetElement: HTMLElement | null;
  setTargetElement: (el: HTMLElement | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  items: [],
  setItems: () => {},
  targetElement: null,
  setTargetElement: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [items, setItems] = React.useState<IContextualMenuItem[]>([]);
  const [targetElement, setTargetElement] = React.useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider
      value={{ items, setItems, targetElement, setTargetElement, isOpen, setIsOpen }}
    >
      {children}
      {isOpen && targetElement && (
        <ContextualMenu
          target={targetElement}
          onDismiss={() => setIsOpen(false)}
          items={items}
        />
      )}
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { setTargetElement, setIsOpen } = React.useContext(DropdownMenuContext);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => triggerRef.current!);

  React.useEffect(() => {
    if (triggerRef.current) {
      setTargetElement(triggerRef.current);
    }
  }, [setTargetElement]);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <div ref={triggerRef} onClick={handleClick} className={cn(className)} {...props}>
      {children}
    </div>
  );
});

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, _ref) => {
  const { setItems } = React.useContext(DropdownMenuContext);

  React.useEffect(() => {
    const items: IContextualMenuItem[] = [];
    React.Children.forEach(children, (child, index) => {
      if (React.isValidElement(child) && (child.type as any)?.displayName === "DropdownMenuItem") {
        const props = child.props as any;
        items.push({
          key: props.key || String(index),
          text: props.children || props.label || "",
          onClick: props.onClick,
          iconProps: props.icon ? { iconName: typeof props.icon === "string" ? props.icon : undefined } : undefined,
        });
      }
    });
    setItems(items);
  }, [children, setItems]);

  // This component doesn't render anything visible - it just collects menu items
  return null;
});

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode; label?: string }
>((_props, _ref) => {
  // This is just a marker component - actual rendering happens in DropdownMenuContent
  return null;
});

DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
