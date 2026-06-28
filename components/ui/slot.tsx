import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal Slot: renders its single child element, merging className and props.
 * Enough for the `asChild` pattern (e.g. <Button asChild><Link/></Button>).
 */
export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    return React.cloneElement(child, {
      ...props,
      ...childProps,
      ref,
      className: cn(className, childProps.className as string | undefined),
    });
  },
);
Slot.displayName = "Slot";
