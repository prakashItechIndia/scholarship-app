import * as React from "react";
import { Persona, PersonaSize, IPersonaProps } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface AvatarProps extends Omit<IPersonaProps, "size" | "styles"> {
  size?: "sm" | "md" | "lg" | "xl";
  name?: string;
  imageUrl?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", name, imageUrl, children, ...props }, ref) => {
    // Extract imageUrl from children if provided (for compatibility with AvatarImage)
    let extractedImageUrl = imageUrl;

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child.type as any)?.displayName === "AvatarImage") {
        extractedImageUrl = (child.props as any).src || extractedImageUrl;
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

    return (
      <div ref={ref} className={cn(className)}>
        <Persona
          imageUrl={extractedImageUrl}
          text={name}
          size={getPersonaSize()}
          {...props}
        />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// Placeholder components for compatibility with compound component pattern
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
