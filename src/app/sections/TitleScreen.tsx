'use client';

import { GlobalAppContext } from "@/app/GlobalContext";
import { jersey10, redHatMono } from "@lib/fonts";
import { cn } from "../lib/utils";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useAnimate, motion, useMotionValue, useTransform } from "motion/react";
import { steps } from "motion";
import TextShaderApp from "@/components/TextShaderApp";

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

    const animSequence = async () => {
        await animate('[data-slot="title-name"]', { opacity: 1, y: 0 }, { duration: 0.5, y: { duration: 1, ease: "circOut" } });
        await animate('[data-slot="title-console"]', { opacity: 1, width: "100%" }, { delay: 1, duration: 0.5 } );
        await typingAnimation(typeWriterText);
    }

    const fadeInAnim = useCallback(() => {
        setIsShowing(true);
        triggeredAnimation.current = true;
        animSequence();
    }, [animSequence]);

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
    }, [forceMount, ctx.appObj, fadeInAnim]);

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
                    style={{ opacity: 0, boxShadow: "0 2px 6px -1px rgb(0 0 0 / 50%) inset" }}
                >
                    <TextWackyShader />
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

function TextWackyShader() {
    const textTexture = useRef<HTMLCanvasElement>(null);
    const webglCanvas = useRef<HTMLCanvasElement>(null);
    const appObj = useRef<TextShaderApp>(null);

    useEffect(() => {
        const canvas = webglCanvas.current;
        if (!canvas) return;
        if (!textTexture.current) return;

        const gl = canvas.getContext("webgl2");
        if (!gl) return;

        appObj.current = new TextShaderApp(canvas, textTexture.current);

        const handleResize = () => {
            canvas.width = (textTexture.current as HTMLCanvasElement).width;
            canvas.height = (textTexture.current as HTMLCanvasElement).height;
        }

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            appObj.current?.kill();
        }
    }, [webglCanvas, textTexture]);

    return (
        <>
            <TextCanvasTexture cRef={textTexture} />
            <canvas ref={webglCanvas} />
        </>
    )
}

function TextCanvasTexture({ cRef }: { cRef: React.RefObject<HTMLCanvasElement | null> }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const desiredText = "Rafael Aguiar";
    const textSize = 48;
    const fontStyle = `${textSize}px ${jersey10.style.fontFamily}`;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        cRef.current = canvas;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.font = fontStyle;
            canvas.width = getPowerOfTwo(ctx.measureText(desiredText).width);
            canvas.height = getPowerOfTwo(1 * textSize);

            ctx.font = fontStyle;
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(desiredText, canvas.width / 2, canvas.height / 2);
        }
    }, [canvasRef, cRef, fontStyle]);

    return (
        <canvas ref={canvasRef} style={{display: "none"}} />
    )
}

function getPowerOfTwo(value: number, pow: number = 1) {
	while(pow<value) {
		pow *= 2;
	}
	return pow;
}