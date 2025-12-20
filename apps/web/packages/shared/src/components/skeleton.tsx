import * as React from "react";
import { Skeleton as FluentSkeleton, SkeletonProps as FluentSkeletonProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface SkeletonProps extends Omit<FluentSkeletonProps, "shape"> {
  variant?: "default" | "circle" | "rounded" | "square";
  width?: number | string;
  height?: number | string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", width, height, ...props }, ref) => {
    const getShape = (): "rectangle" | "circle" => {
      return variant === "circle" ? "circle" : "rectangle";
    };

    const style: React.CSSProperties = {
      width: width || "100%",
      height: height || "20px",
      borderRadius: variant === "rounded" ? "8px" : variant === "square" ? "0" : undefined,
    };

    return (
      <FluentSkeleton
        ref={ref}
        shape={getShape()}
        className={cn(className)}
        style={style}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
