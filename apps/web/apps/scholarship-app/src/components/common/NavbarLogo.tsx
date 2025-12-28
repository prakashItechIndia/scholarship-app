import * as React from "react";
import { LogoWithText } from "./LogoWithText";

interface NavbarLogoProps {
  className?: string;
  textColor?: string;
  subtitleColor?: string;
}

export const NavbarLogo: React.FC<NavbarLogoProps> = ({ className, textColor, subtitleColor }) => {
  return (
    <LogoWithText
      logoSize="40px"
      titleSize="sm"
      subtitleSize="xs"
      gap="12px"
      className={className}
      textColor={textColor}
      subtitleColor={subtitleColor}
    />
  );
};

