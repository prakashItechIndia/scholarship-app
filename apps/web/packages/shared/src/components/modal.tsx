import * as React from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  DialogProps as FluentDialogProps,
} from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface ModalProps extends Omit<FluentDialogProps, "open" | "onOpenChange" | "children"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string | React.ReactNode;
  headerContent?: React.ReactNode;
  hideDefaultHeader?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full",
};

const Modal = ({
  open,
  onOpenChange,
  title,
  headerContent,
  hideDefaultHeader = false,
  children,
  footer,
  size = "md",
  className,
  ...props
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => onOpenChange?.(data.open || false)}
      modalType="modal"
      {...props}
    >
      <DialogSurface className={cn("bg-white rounded-lg shadow-xl", sizeClasses[size], className)}>
        <DialogBody className="bg-white">
          {!hideDefaultHeader && title && (
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </DialogTitle>
          )}
          {headerContent}
          <DialogContent className="text-gray-700 bg-white">
            {children}
          </DialogContent>
          {footer && (
            <DialogActions className="flex justify-end gap-2 mt-4 bg-white">
              {footer}
            </DialogActions>
          )}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

Modal.displayName = "Modal";

export { Modal };

