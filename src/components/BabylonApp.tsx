'use client';

import { useEffect, useRef, useState, useContext, useCallback } from "react";
import type { Scene, EngineOptions, SceneOptions } from "@babylonjs/core";
import App from "./App";
import { GlobalAppContext } from "@/app/GlobalContext";
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
    const [ showLoadingOverlay, setShowLoadingOverlay ] = useState<boolean>(true);

    const { updateAppObj } = useContext(GlobalAppContext);

    const hideLoadingOverlay = () => {
        setShowLoadingOverlay(false);
    }

    useEffect(() => {
        const { current: canvas } = reactCanvas;
        if (!canvas) return;

        const isWebgl = canvas.getContext("webgl2");
        if (!isWebgl) { // TESTING
            setAppErrorMessage("Your browser does not support WebGL.");
            return;
        }

        appObj.current = new App(canvas, { antialias: true });
        updateAppObj(appObj.current);

        appObj.current.observables.onAssetsLoaded.addOnce(() => setIsAppReady(true));

        return () => {
            appObj.current?.kill();
            updateAppObj(undefined);
        }
    }, []);

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

            { (showLoadingOverlay && !appErrorMessage) && <LoadingOverlay loadingStatus={isAppReady} disposeFn={hideLoadingOverlay} /> }

            { (appErrorMessage && isAppReady) && (
                <div className="absolute top-0 left-0 p-4 text-sm">
                    { appErrorMessage }
                </div>
            ) }

            
        </div>
    )
}

function LoadingOverlay({
    loadingStatus,
    disposeFn
}: {
    loadingStatus: boolean,
    disposeFn: () => void,
}) {
    const [ loadBuffer, setLoadBuffer ] = useState<boolean>(loadingStatus);
    const loadOverlayRef = useRef<HTMLDivElement>(null);

    const fadedOut = useCallback(() => {
        disposeFn();
    }, [disposeFn]);

    useEffect(() => {
        if (!loadOverlayRef.current) return;

        if (loadingStatus === true && loadBuffer === false) {
            setLoadBuffer(true);
            loadOverlayRef.current.addEventListener(
                "transitionend",
                () => fadedOut(),
                { once: true }
            );
        }
    }, [loadingStatus, loadBuffer, fadedOut]);

    return (
            <div
                ref={loadOverlayRef}
                className={cn(
                    "absolute flex items-center justify-center top-0 left-0 w-full h-full transition-colors duration-4000",
                    loadingStatus?"bg-transparent":"bg-black"
                )}
            >
                { !loadingStatus && (
                    <div
                        className="p-2 text-lg font-semibold"
                    >
                        Loading app...
                    </div>
                )}
            </div>
    )
}