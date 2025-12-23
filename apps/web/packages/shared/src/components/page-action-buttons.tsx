import * as React from "react";
import { Button } from "./button";
import { AddFilled, AddRegular } from "@fluentui/react-icons";
import { MoreIcon } from "./more-icon";

export interface PageActionButtonsProps {
  /** Title text to display (can be string or ReactNode for JSX support) */
  title?: string | React.ReactNode;
  /** Label for the primary action button */
  primaryButtonLabel?: string;
  /** Click handler for the primary action button */
  onPrimaryAction?: () => void;
  /** Click handler for the more options button */
  onMoreClick?: () => void;
  /** Additional content to render after the buttons */
  children?: React.ReactNode;
}

/**
 * PageActionButtons - Reusable component for page action buttons
 * 
 * Displays a title (optional) and action buttons including:
 * - Primary action button (e.g., "Add Role")
 * - More options icon button
 */
export const PageActionButtons = React.forwardRef<
  HTMLDivElement,
  PageActionButtonsProps
>(({ 
  title, 
  primaryButtonLabel = "Add Role", 
  onPrimaryAction,
  onMoreClick,
  children 
}, ref) => {
  return (
    <div 
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        width: "100%",
      }}
    >
      {/* Title Section */}
      {title && (
        <div style={{
          margin: 0,
          fontFamily: "'Inter', sans-serif",
          flex: 1,
        }}>
          {typeof title === 'string' ? (
            <h1 style={{
              fontSize: "32px",
              lineHeight: "40px",
              fontWeight: 700,
              color: "#242424",
              margin: 0,
            }}>
              {title}
            </h1>
          ) : (
            title
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        {onPrimaryAction && (
          <Button
            // appearance="primary"
            onClick={onPrimaryAction}
            style={{
              backgroundColor: "#0f6cbd",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderRadius: "7px",
              // padding:"3px",
              width: "120px",
              height: "40px",
              border:"none"
            }}
          >
            <AddFilled style={{ width: "16px", height: "16px",fontSize:"12px",fontWeight:600 }} />
            {primaryButtonLabel}
          </Button>
        )}
        {onMoreClick && (
          <Button
            appearance="subtle"
            onClick={onMoreClick}
            aria-label="More options"
            style={{
              width: "36px",
              height: "36px",
              padding: 0,
              border: "1px solid #e0e0e0",
              minHeight: "35px",
              minWidth: "35px",
              // border:"none"
            }}
          >
            <MoreIcon width={20} height={20} style={{width:"16px",height:"16px",fontSize:"12px",fontWeight:600}} />
          </Button>
        )}
        {children}
      </div>
    </div>
  );
});

PageActionButtons.displayName = "PageActionButtons";

