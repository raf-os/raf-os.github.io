'use client';

import { cn } from "@/app/lib/utils";

export default function Separator({
    className,
    ...rest
}: React.ComponentPropsWithRef<'div'>) {
    return (
        <div
            className={cn(
                "w-3/4 max-w-[900px] self-center h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent",
                className
            )}
            data-slot="separator"
            {...rest}
        />
    )
}