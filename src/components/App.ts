import { Engine, Scene, ArcRotateCamera, Animation, CubicEase, EasingFunction, MeshBuilder, Vector3, type EngineOptions, type SceneOptions, type Camera } from "@babylonjs/core";
import BuildingSpawner from "./objects/BuildingSpawner";
import ViewCamera from "./objects/ViewCamera";

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
    mainCamera: ViewCamera;

    constructor(canvas: HTMLCanvasElement, opts: AppProps) {
        this._canvas = canvas;
        this._opts = opts;

        this.engine = new Engine(canvas, opts.antialias, opts.engineOptions, opts.adaptToDeviceRatio);
        this.scene = new Scene(this.engine, opts.sceneOptions);

        MeshLoader.setScene(this.scene);
        MeshLoader.loadAssets();

        WorldEnvironment.setup(this.scene);
        
        const cameraInitialHeight = 80;
        this.mainCamera = new ViewCamera(this.scene);
        //this.mainCamera.attachControl(this.scene, true);

        this.scene.onReadyObservable.addOnce(() => {
            const buildingSpawner = new BuildingSpawner(this.scene);

            const ground = MeshBuilder.CreateGround("ground", { width: 200, height: 200 }, this.scene);

            this.mainCamera.descentAnim();
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