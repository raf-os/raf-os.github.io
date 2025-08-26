'use client';

import { useEffect, useRef } from "react";
import type { Scene, EngineOptions, SceneOptions } from "@babylonjs/core";
import App from "./App";

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
    ...rest
}: BabylonAppProps) {
    const reactCanvas = useRef<HTMLCanvasElement>(null);
    const appObj = useRef<App>(null);

    useEffect(() => {
        const { current: canvas } = reactCanvas;
        if (!canvas) return;

        appObj.current = new App(canvas, { antialias: true });

        return () => {
            appObj.current?.kill();
        }
    }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

    return (
        <canvas id="webglCanvas" ref={reactCanvas} {...rest} />
    )
}