import { Engine, Scene, ArcRotateCamera, Animation, CubicEase, EasingFunction, MeshBuilder, Vector3, type EngineOptions, type SceneOptions, type Camera } from "@babylonjs/core";
import BuildingSpawner from "./objects/BuildingSpawner";

import MeshLoader from "./singletons/MeshLoader";
import WorldEnvironment from "./singletons/WorldEnvironment";

interface AppProps {
    antialias?: boolean,
    engineOptions?: EngineOptions,
    adaptToDeviceRatio?: boolean,
    sceneOptions?: SceneOptions,
}

export default class App {
    private _canvas: HTMLCanvasElement;
    private _opts: AppProps;
    engine: Engine;
    scene: Scene;
    mainCamera: Camera;

    constructor(canvas: HTMLCanvasElement, opts: AppProps) {
        this._canvas = canvas;
        this._opts = opts;

        this.engine = new Engine(canvas, opts.antialias, opts.engineOptions, opts.adaptToDeviceRatio);
        this.scene = new Scene(this.engine, opts.sceneOptions);

        MeshLoader.setScene(this.scene);
        MeshLoader.loadAssets();

        WorldEnvironment.setup(this.scene);
        
        const cameraInitialHeight = 80;
        this.mainCamera = new ArcRotateCamera("MainCamera", Math.PI / 2, Math.PI / 2.1, 100, new Vector3(0, cameraInitialHeight, 0), this.scene);
        //this.mainCamera.attachControl(this.scene, true);

        this.scene.onReadyObservable.addOnce(() => {
            const buildingSpawner = new BuildingSpawner(this.scene);

            const ground = MeshBuilder.CreateGround("ground", { width: 200, height: 200 }, this.scene);

            const framerate = 30;

            const lowerCamera = new Animation("lowerCamera", "target.y", framerate, Animation.ANIMATIONTYPE_FLOAT);
            const lowerCameraDuration = 8;

            const keyFrames = [{
                frame: 0,
                value: cameraInitialHeight,
            }, {
                frame: lowerCameraDuration * framerate,
                value: 10,
            }];

            lowerCamera.setKeys(keyFrames);

            const easingFn = new CubicEase();
            easingFn.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
            lowerCamera.setEasingFunction(easingFn);

            this.mainCamera.animations.push(lowerCamera);

            setTimeout(() => {
                this.scene.beginAnimation(this.mainCamera, 0, lowerCameraDuration * framerate, false);
            }, 2000);
        });

        if (window) {
            window.addEventListener("resize", this.resize);
        }

        this.engine.runRenderLoop(() => this.scene.render());
    }

    get canvas() {
        return this._canvas;
    }

    resize = () => {
        this.scene.getEngine().resize();
    }

    kill() {
        window.removeEventListener("resize", this.resize);
        this.engine.dispose();
    }
}