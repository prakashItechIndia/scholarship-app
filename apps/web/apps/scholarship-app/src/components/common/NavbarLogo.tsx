import * as React from "react";
import { LogoWithText } from "./LogoWithText";

interface NavbarLogoProps {
  className?: string;
}

export const NavbarLogo: React.FC<NavbarLogoProps> = ({ className }) => {
  return (
    <LogoWithText
      logoSize="40px"
      titleSize="sm"
      subtitleSize="xs"
      gap="12px"
      className={className}
    />
  );
};

