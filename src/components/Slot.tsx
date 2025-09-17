import { cn } from "@lib/utils";
import { Children, isValidElement, cloneElement } from "react";

export default function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
    if (Children.count(children) > 1) {
        throw new Error("Tried to render slot component with more than one child node.");
    }

    if (isValidElement(children)) {
        const element = Children.only(children) as React.ReactElement<HTMLElement>;
        const { className: elementClassName, style: elementStyle, ...childProps } = element.props;
        return cloneElement(element, {
            ...props,
            ...childProps,
            style: {
                ...props.style,
                ...elementStyle,
            },
            className: cn(
                props.className,
                elementClassName
            )
        });
    }

    return null;
}