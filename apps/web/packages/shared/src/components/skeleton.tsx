import * as React from "react";
import { Skeleton as FluentSkeleton, SkeletonProps as FluentSkeletonProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface SkeletonProps extends Omit<FluentSkeletonProps, "shape"> {
  variant?: "default" | "circle" | "rounded" | "square";
  width?: number | string;
  height?: number | string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", width, height, style, ...props }, ref) => {
    const combinedStyle: React.CSSProperties = {
      width: width || "100%",
      height: height || "20px",
      borderRadius: variant === "rounded" ? "8px" : variant === "circle" ? "50%" : variant === "square" ? "0" : undefined,
      backgroundColor: "#e5e7eb", // Default gray color for skeleton
      ...style, // Allow style prop to override
    };

    return (
      <FluentSkeleton
        ref={ref}
        className={cn(className)}
        animation="wave"
        appearance="opaque"
        style={combinedStyle}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
