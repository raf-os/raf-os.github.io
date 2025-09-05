'use client';

import { GlobalAppContext } from "../page";
import { jersey10, redHatMono } from "@lib/fonts";
import { cn } from "../lib/utils";
import { useContext, useEffect, useState, useRef } from "react";
import { useAnimate, motion, useMotionValue, useTransform } from "motion/react";
import { steps } from "motion";

export type TitleScreenProps = React.ComponentPropsWithRef<'div'> & {
    forceMount: boolean;
}

export default function TitleScreen({
    forceMount,
    className,
    style,
    ...rest
}: TitleScreenProps) {
    const typeWriterText = [
        "Fullstack web developer",
        "Mechanical engineer"
    ];

    const triggeredAnimation = useRef<boolean>(false);
    const [ isShowing, setIsShowing ] = useState<boolean>(forceMount);
    const [ scope, animate ] = useAnimate();
    const ctx = useContext(GlobalAppContext);

    const currentRenderText = useRef<string>("");
    const strCount = useMotionValue(0);
    const strCountTarget = useTransform(strCount, (latest) => Math.round(latest));
    const strDisplay = useTransform(strCountTarget, (latest) => currentRenderText.current.slice(0, latest));

    const fadeInAnim = () => {
        setIsShowing(true);
        triggeredAnimation.current = true;
        animSequence();
    }

    const animSequence = async () => {
        await animate('[data-slot="title-name"]', { opacity: 1, y: 0 }, { duration: 0.5, y: { duration: 1, ease: "circOut" } });
        await animate('[data-slot="title-console"]', { opacity: 1, width: "100%" }, { delay: 1, duration: 0.5 } );
        await typingAnimation(typeWriterText);
    }

    const typingAnimation = async (stringLines: string[]) => {
        for (const line of stringLines) {
            const lineSize = line.length;
            const _nl = currentRenderText.current.length + 2;
            currentRenderText.current += "> " + line;
            strCount.jump(_nl);
            const fullSize = lineSize + _nl;
            await animate(strCount, fullSize, { duration: 1, delay: 1, ease: "linear" });
            currentRenderText.current += "\n";
            strCount.jump(fullSize + 2);
        }

        currentRenderText.current += "> ";
        strCount.jump(currentRenderText.current.length);
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
            ref={scope}
            {...rest}
        >
            <div
                className="flex flex-col gap-4 items-center relative p-4 md:p-0 md:w-[800px]"
                style={{ visibility: isShowing? "visible" : "hidden" }}
                data-slot="animatable-container"
            >
                <div
                    className={`text-[64px] md:text-[96px] text-center leading-none border-1 border-neutral-950/50 bg-neutral-950/20 px-4 py-2 rounded-lg ${jersey10.className}`}
                    data-slot="title-name"
                    style={{ opacity: 0, transform: "translateY(48px)", boxShadow: "0 2px 6px -1px rgb(0 0 0 / 50%) inset" }}
                >
                    <span
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundColor: "#B50792",
                            backgroundImage: "linear-gradient(to bottom, #35077D 25%, #B50792 55%, #FFCD05 100%)",
                        }}
                    >
                        Rafael Aguiar
                    </span>
                </div>

                <div
                    className={`block rounded-lg text-base font-medium bg-gray-800 border-2 border-green-400 text-green-400 overflow-hidden ${redHatMono.className}`}
                    data-slot="title-console"
                    style={{ opacity: 0, width: 0 }}
                >
                    <div
                        className="w-full text-sm font-semibold px-2 py-1 bg-green-400 text-gray-800"
                    >
                        Terminal
                    </div>
                    <div className="px-3 py-2">
                        <motion.div className="inline whitespace-pre-line">{strDisplay}</motion.div>
                        <motion.p
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: steps(2) }}
                            className="inline"
                        >
                            _
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}