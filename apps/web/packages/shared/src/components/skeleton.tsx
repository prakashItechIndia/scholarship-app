import * as React from "react";
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circle" | "rounded" | "square";
  width?: number | string;
  height?: number | string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", width, height, ...props }, ref) => {
    const getBorderRadius = () => {
      switch (variant) {
        case "circle":
          return "50%";
        case "rounded":
          return "8px";
        case "square":
          return "0";
        default:
          return "4px";
      }
    };

    const style: React.CSSProperties = {
      width: width || "100%",
      height: height || "20px",
      borderRadius: getBorderRadius(),
    };

    return (
      <div ref={ref} className={cn("animate-pulse bg-gray-200", className)} style={style} {...props}>
        <Shimmer shimmerElements={[{ type: ShimmerElementType.line, width: "100%" }]} />
      </div>
    );
  },
);

Skeleton.displayName = "Skeleton";

export { Skeleton };

