import * as React from "react";
import logoImage from "@shared/assets/icons/Logo.svg";

export interface LogoWithTextProps {
  logoSize?: string;
  titleSize?: "sm" | "md" | "lg";
  subtitleSize?: "sm" | "xs";
  showLogo?: boolean;
  logoBackground?: "gradient" | "none" | "transparent";
  className?: string;
  containerClassName?: string;
  gap?: string;
}

// Simple JS function to return SVG logo
const LogoSVG = ({ width = "45", height = "45" }: { width?: string; height?: string }) => {
  return (
    <img 
      src={logoImage} 
      alt="Leo Muthu Scholarship Logo" 
      style={{ width, height, display: "block" }} 
    />
  );
};

export const LogoWithText: React.FC<LogoWithTextProps> = ({
  logoSize = "45px",
  titleSize = "md",
  subtitleSize = "xs",
  showLogo = true,
  logoBackground = "none",
  className,
  containerClassName,
  gap = "12px",
}) => {
  const titleStyles: Record<"sm" | "md" | "lg", React.CSSProperties> = {
    sm: { fontSize: "14px", lineHeight: "22px" },
    md: { fontSize: "16px", lineHeight: "22px" },
    lg: { fontSize: "18px", lineHeight: "24px" },
  };

  const subtitleStyles: Record<"xs" | "sm", React.CSSProperties> = {
    xs: { fontSize: "12px", lineHeight: "16px" },
    sm: { fontSize: "14px", lineHeight: "18px" },
  };

  const getLogoBackground = () => {
    switch (logoBackground) {
      case "gradient":
        return "linear-gradient(to bottom right, #3b82f6, #06b6d4)";
      case "transparent":
        return "transparent";
      default:
        return "none";
    }
  };

  return (
    <div 
      className={`flex items-center ${containerClassName || ""}`}
      style={{ gap }}
    >
      {showLogo && (
        <div
          className="flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center"
          style={{
            width: logoSize,
            height: logoSize,
            background: getLogoBackground(),
          }}
        >
          <LogoSVG width={logoSize} height={logoSize} />
        </div>
      )}
      <div className={`flex flex-col ${className || ""}`}>
        <span
          className="font-semibold text-gray-900"
          style={{
            ...titleStyles[titleSize],
            fontFamily: "Inter, sans-serif",
            color: "#242424",
          }}
        >
          Shri. Leo Muthu Scholarship (LMS)
        </span>
        <span
          className="text-gray-600"
          style={{
            ...subtitleStyles[subtitleSize],
            fontFamily: "Inter, sans-serif",
            color: "#707070",
            marginTop: subtitleSize === "xs" ? "2px" : "4px",
          }}
        >
          An Initiative of ARAM Foundation
        </span>
      </div>
    </div>
  );
};

