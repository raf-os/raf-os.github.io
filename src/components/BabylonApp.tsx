'use client';

import { useEffect, useRef, useState } from "react";
import type { Scene, EngineOptions, SceneOptions } from "@babylonjs/core";
import App from "./App";
import { cn } from "@lib/utils";

interface BabylonAppProps extends React.ComponentPropsWithoutRef<'canvas'> {
    antialias?: boolean,
    engineOptions?: EngineOptions,
    adaptToDeviceRatio?: boolean,
    sceneOptions?: SceneOptions,
    onSceneReady?: (scene: Scene) => void,
    onRender?: (scene: Scene) => void,
}

export default function BabylonApp({
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
    className,
    ...rest
}: BabylonAppProps) {
    const reactCanvas = useRef<HTMLCanvasElement>(null);
    const appObj = useRef<App>(null);
    const [ isAppReady, setIsAppReady ] = useState<boolean>(false);
    const [ appErrorMessage, setAppErrorMessage ] = useState<React.ReactNode>(null);

    useEffect(() => {
        const { current: canvas } = reactCanvas;
        if (!canvas) return;

        const isWebgl = canvas.getContext("webgl2");
        if (!isWebgl) { // TESTING
            setAppErrorMessage("Your browser does not support WebGL.");
            return;
        }

        appObj.current = new App(canvas, { antialias: true });

        appObj.current.observables.onAssetsLoaded.addOnce(() => setIsAppReady(true));

        return () => {
            appObj.current?.kill();
        }
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

    return (
        <div className="flex w-full h-dvh fixed top-0 left-0 -z-50">
            <canvas
                id="webglCanvas"
                ref={reactCanvas}
                className={cn(
                    "outline-none grow-1",
                    className
                )}
                {...rest}
            />

            { (isAppReady === false) && (
                <LoadingScreen />
            )}

            { (appErrorMessage && isAppReady) && (
                <div className="absolute top-0 left-0 p-4 text-sm">
                    { appErrorMessage }
                </div>
            ) }

            
        </div>
    )
}

function LoadingScreen() {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black">
            loading...
        </div>
    )
}