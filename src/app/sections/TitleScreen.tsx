'use client';

import { GlobalAppContext } from "@/app/GlobalContext";
import { redHatMono } from "@lib/fonts";
import LanguageSelector from "@/components/LanguageSelector";
import { cn } from "@lib/utils";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useAnimate, motion, useMotionValue, useTransform } from "motion/react";
import { steps } from "motion";
import TextShaderApp from "@/components/TextShaderApp";
import { useLocalization } from "@/app/hooks/useLocalization";

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
    const [ scope, animate ] = useAnimate();
    const ctx = useContext(GlobalAppContext);

    const currentRenderText = useRef<string>("");
    const strCount = useMotionValue(0);
    const strCountTarget = useTransform(strCount, (latest) => Math.round(latest));
    const strDisplay = useTransform(strCountTarget, (latest) => currentRenderText.current.slice(0, latest));

    const fadeInAnim = useCallback(() => {
        const typeWriterText = [
            "Fullstack web developer",
            "Mechanical engineer",
            "(...)",
            "Full profile attached below"
        ];

        const typingAnimation = async (stringLines: string[], opts?: { showEndline?: boolean, typingSpeed?: number, typingDelay?: number, prefix?: string }) => {
            const typingSpeed = opts?.typingSpeed || 0.05;
            const typingDelay = opts?.typingDelay || 0;
            const prefix = opts?.prefix || "> ";
            for (const line of stringLines) {
                const lineSize = line.length;
                const _nl = currentRenderText.current.length + prefix.length;
                currentRenderText.current += prefix + line;
                strCount.jump(_nl);
                const fullSize = lineSize + _nl;
                await animate(strCount, fullSize, { duration: lineSize * typingSpeed, delay: typingDelay, ease: "linear" });
                currentRenderText.current += "\n";
                strCount.jump(fullSize + 2);
            }
            
            if (opts?.showEndline === true) currentRenderText.current += "> ";
            strCount.jump(currentRenderText.current.length);
        }

        const animSequence = async () => {
            //await new Promise(resolve => setTimeout(resolve, 1000));
            animate('[data-slot="animatable-container"]', { y: 0, opacity: 1 }, { duration: 1, delay: 1, y: { ease: "circOut" } });
            //await animate('[data-slot="title-name"]', { opacity: 1 }, { duration: 2 });
            await animate('[data-slot="title-console"]', { opacity: 1, width: "100%", height: "auto", y: 0 }, { delay: 1, duration: 0.5, ease: "circOut" });
            await typingAnimation(typeWriterText, { showEndline: true, typingDelay: 0.25 });
            animate('[data-slot="title-footer"]', { opacity: 1 }, {  duration: 1 });
        }
        
        setIsShowing(true);
        triggeredAnimation.current = true;
        animSequence();
        // eslint-disable-next-line
    }, [animate]);

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
                "flex flex-col w-full h-dvh items-center relative py-8 overflow-hidden"
            )}
            ref={scope}
            {...rest}
        >
            <div
                className="flex flex-col justify-baseline gap-4 relative p-2 w-full h-full md:p-0 md:w-[800px]"
                style={{ visibility: isShowing? "visible" : "hidden", transform: "translateY(32px)", opacity: "0" }}
                data-slot="animatable-container"
            >
                <div
                    className="flex flex-col items-center w-full relative h-2/5"
                    data-slot="title-name"
                >
                    <TextWackyShader />
                </div>

                <div className="flex flex-col w-full h-2/5 z-1">
                    <div
                        className={`flex flex-col rounded-lg text-base font-medium bg-green-400 border-2 border-green-400 text-green-400 overflow-hidden ${redHatMono.className}`}
                        data-slot="title-console"
                        style={{ opacity: 0, width: 0, height: 0, transform: "translateY(48px)" }}
                    >
                        <div
                            className="w-full text-sm font-semibold px-2 py-1 text-gray-800"
                        >
                            Terminal: User Profile
                        </div>
                        <div className="px-3 py-2 overflow-hidden bg-gray-800 rounded-md">
                            
                            <motion.div className="inline whitespace-pre-wrap">{strDisplay}</motion.div>
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

                <div
                    className="flex flex-col items-center justify-end gap-4 w-full h-1/5"
                    data-slot="title-footer"
                    style={{ opacity: 0 }}
                >
                    <LanguageSelector />
                    <FooterText />
                </div>
            </div>
        </div>
    )
}

function FooterText() {
    const localized = useLocalization(
        {
            "en-us": "All rights reserved.",
            "pt-br": "Todos os direitos reservados."
        }
    );
    return (
        <div className="font-medium bg-gray-800 py-3 px-4 rounded-lg">Rafael Aguiar, 2025. {localized}</div>
    )
}

function TextWackyShader() {
    const textTexture = useRef<HTMLCanvasElement>(null);
    const webglCanvas = useRef<HTMLCanvasElement>(null);
    const appObj = useRef<TextShaderApp>(null);

    const updateTexture = useCallback(() => {
        if (!appObj.current) return;

        appObj.current.updateCanvasTexture();
    }, []);

    useEffect(() => {
        const canvas = webglCanvas.current;
        if (!canvas) return;
        if (!textTexture.current) return;

        const gl = canvas.getContext("webgl2");
        if (!gl) return;

        appObj.current = new TextShaderApp(canvas, textTexture.current);

        const handleResize = () => {
            canvas.width = (textTexture.current as HTMLCanvasElement).width;
            canvas.height = (textTexture.current as HTMLCanvasElement).height * 2;
        }

        handleResize();

        window.addEventListener("resize", handleResize);
        const observer = appObj.current.observables.onTextureUpdate.add(() => handleResize());

        return () => {
            window.removeEventListener("resize", handleResize);
            appObj.current?.observables.onTextureUpdate.remove(observer);
            appObj.current?.kill();
        }
    }, [webglCanvas, textTexture]);

    return (
        <>
            <TextCanvasTexture cRef={textTexture} texUpdateFn={updateTexture} />
            <div className="absolute top-[72px] translate-x-[20px] overflow-hidden flex items-center h-full">
                <canvas ref={webglCanvas} className="outline-none" />
            </div>
        </>
    )
}

function TextCanvasTexture({ cRef, texUpdateFn }: { cRef: React.RefObject<HTMLCanvasElement | null>, texUpdateFn: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const desiredText = "Rafael Aguiar";
    const textSize = 80;
    
    useEffect(() => {
        const loadAndDraw = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            cRef.current = canvas;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const fontStyle = `${textSize}px shaderFontJ10`;
            // FONT CREDITS: https://www.dafont.com/suntowns.font
            const font = new FontFace("shaderFontJ10", "url('fonts/Suntowns.ttf')", { weight: '400' });
            await font.load();
            document.fonts.add(font);

            ctx.font = fontStyle;
            canvas.width = getPowerOfTwo(ctx.measureText(desiredText).width);
            canvas.height = getPowerOfTwo(1 * textSize);

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0.1, "#31E4EB");
            gradient.addColorStop(0.6, "#B03FE0");
            gradient.addColorStop(1, "#FFEFA6");

            ctx.font = fontStyle;
            ctx.fillStyle = gradient;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(desiredText, canvas.width / 2, canvas.height / 2);

            texUpdateFn();
        }

        loadAndDraw();
    }, [canvasRef, cRef, texUpdateFn]);

    return (
        <div style={{ height: textSize }} className="absolute top-1/2 -translate-y-1/2 flex items-center">
            <canvas ref={canvasRef} />
        </div>
    )
}

function getPowerOfTwo(value: number, pow: number = 1) {
	while(pow<value) {
		pow *= 2;
	}
	return pow;
}