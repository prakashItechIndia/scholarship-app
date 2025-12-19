import * as React from "react";
import { Persona, PersonaSize, IPersonaProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface AvatarProps extends Omit<IPersonaProps, "size"> {
  variant?: "default" | "square" | "rounded";
  size?: "sm" | "md" | "lg" | "xl";
  name?: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, variant = "default", size = "md", name, imageUrl, children, ...props }, ref) => {
    // Extract image and fallback from children
    let extractedImageUrl = imageUrl;
    let extractedInitials: string | undefined;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if ((child.type as any)?.displayName === "AvatarImage") {
          extractedImageUrl = (child.props as any).src;
        } else if ((child.type as any)?.displayName === "AvatarFallback") {
          extractedInitials = String((child.props as any).children || "");
        }
      }
    });

    const getPersonaSize = (): PersonaSize => {
      switch (size) {
        case "sm":
          return PersonaSize.size24;
        case "lg":
          return PersonaSize.size56;
        case "xl":
          return PersonaSize.size72;
        default:
          return PersonaSize.size40;
      }
    };

    const getInitials = (): string | undefined => {
      if (extractedInitials) return extractedInitials;
      if (name) {
        return name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      return undefined;
    };

    const getBorderRadius = () => {
      switch (variant) {
        case "square":
          return "4px";
        case "rounded":
          return "8px";
        default:
          return "50%";
      }
    };

    return (
      <div ref={ref} className={cn("flex-shrink-0", className)}>
        <Persona
          imageUrl={extractedImageUrl}
          text={name}
          size={getPersonaSize()}
          initials={getInitials()}
          styles={{
            root: {
              borderRadius: getBorderRadius(),
            },
          }}
          {...props}
        />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(() => null);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(() => null);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };

