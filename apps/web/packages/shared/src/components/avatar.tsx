import * as React from "react";
import { Avatar as FluentAvatar, AvatarProps as FluentAvatarProps } from "@fluentui/react-components";
import { cn } from "../lib/utils";

export interface AvatarProps extends Omit<FluentAvatarProps, "size"> {
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

    const getFluentSize = (): "16" | "20" | "24" | "28" | "32" | "36" | "40" | "48" | "56" | "64" | "72" | "96" | "120" | "128" => {
      switch (size) {
        case "sm":
          return "24";
        case "lg":
          return "56";
        case "xl":
          return "72";
        default:
          return "40";
      }
    };

    return (
      <FluentAvatar
        ref={ref}
        image={{ src: extractedImageUrl }}
        name={name}
        size={getFluentSize()}
        className={cn(className)}
        {...props}
      >
        {children}
      </FluentAvatar>
    );
  }
);

Avatar.displayName = "Avatar";

// Placeholder components for compatibility with compound component pattern
const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>((props, ref) => {
  return <img ref={ref} {...props} />;
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn(className)} {...props}>
    {children}
  </span>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
