'use client';

import { GlobalAppContext } from "../page";
import { jersey10 } from "@lib/fonts";
import { cn } from "../lib/utils";
import { useContext, useEffect, useState, useRef } from "react";

export type TitleScreenProps = React.ComponentPropsWithRef<'div'> & {
    forceMount: boolean;
}

export default function TitleScreen({
    forceMount,
    className,
    style,
    ...rest
}: TitleScreenProps) {
    const triggeredAnimation = useRef<boolean>(false);
    const [ isShowing, setIsShowing ] = useState<boolean>(forceMount);
    const ctx = useContext(GlobalAppContext);

    const fadeInAnim = () => {
        triggeredAnimation.current = true;
        setIsShowing(true);
    }

    useEffect(() => {
        if (triggeredAnimation.current) return;
        if (forceMount) {
            fadeInAnim();
        } else if (ctx.appObj !== undefined) {
            ctx.appObj.observables.onAssetsLoaded.addOnce(() => fadeInAnim());
        }
    }, [forceMount, ctx.appObj]);

    return (
        <div
            className={cn(
                "flex flex-col w-full h-dvh items-center justify-center relative"
            )}
            {...rest}
        >
            <div
                className={`text-[64px] ${jersey10.className}`}
                style={{
                    translate: isShowing? "0px" : "0px 64px",
                    opacity: isShowing? "100%" : "0%",
                    transition: "translate 1s cubic-bezier(0.33, 1, 0.68, 1), opacity 1s linear"
                }}
                data-slot="title-name"
            >
                Name
            </div>
        </div>
    )
}