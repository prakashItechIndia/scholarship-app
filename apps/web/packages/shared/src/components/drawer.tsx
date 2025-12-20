import * as React from "react";
import { cn } from "../lib/utils";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
  width?: string;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  children,
  side = "right",
  width = "400px",
  className,
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          animation: "fadeIn 0.2s ease-in-out",
        }}
      />
      
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          [side]: 0,
          bottom: 0,
          width: width,
          maxWidth: "90vw",
          backgroundColor: "#ffffff",
          zIndex: 1000,
          boxShadow: "-4px 0 16px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          animation: side === "right" ? "slideInRight 0.3s ease-out" : "slideInLeft 0.3s ease-out",
          fontFamily: "'Inter', sans-serif",
        }}
        className={cn(className)}
      >
        {children}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export { Drawer };

