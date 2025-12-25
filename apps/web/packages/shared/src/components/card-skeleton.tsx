import * as React from "react";
import { Card } from "./card";
import { Skeleton } from "./skeleton";

export interface CardSkeletonProps {
  /** Variant of the card (matches Card component) */
  variant?: "default" | "outline" | "elevated" | "filled";
  /** Show icon skeleton */
  showIcon?: boolean;
  /** Show header section */
  showHeader?: boolean;
  /** Show content sections */
  contentSections?: number;
  /** Additional CSS class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * CardSkeleton - Reusable skeleton component for card loading states
 * Matches StatCard and other card layouts for consistent UI
 */
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  variant = "elevated",
  showIcon = true,
  showHeader = false,
  contentSections = 2,
  className,
  style,
}) => {
  return (
    <Card 
      variant={variant} 
      className={className}
      style={{
        border: "1px solid #e0e0e0",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "20px",
        ...style,
      }}
    >
      {showHeader && (
        <div style={{ marginBottom: "16px" }}>
          <Skeleton 
            width="60%" 
            height={20} 
            variant="rounded"
            style={{ backgroundColor: "#e5e7eb" }}
          />
        </div>
      )}
      
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        {showIcon && (
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "1px solid #e5e7eb",
          }}>
            <Skeleton 
              width={32} 
              height={32} 
              variant="circle"
              style={{ backgroundColor: "#d1d5db" }}
            />
          </div>
        )}
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}>
          <Skeleton 
            width="70%" 
            height={32} 
            variant="rounded"
            style={{ backgroundColor: "#e5e7eb" }}
          />
          <Skeleton 
            width="50%" 
            height={20} 
            variant="rounded"
            style={{ backgroundColor: "#f3f4f6" }}
          />
        </div>
      </div>

      {contentSections > 0 && (
        <div style={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          {Array.from({ length: contentSections }).map((_, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Skeleton 
                width="40%" 
                height={14} 
                variant="rounded"
                style={{ backgroundColor: "#f3f4f6" }}
              />
              <Skeleton 
                width="90%" 
                height={16} 
                variant="rounded"
                style={{ backgroundColor: "#e5e7eb" }}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

CardSkeleton.displayName = "CardSkeleton";

