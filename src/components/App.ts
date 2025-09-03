import { Engine, Scene, type EngineOptions, type SceneOptions } from "@babylonjs/core";
import BuildingSpawner from "./objects/BuildingSpawner";
import ViewCamera from "./objects/ViewCamera";
import Ground from "./objects/Ground";

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
        this.mainCamera = new ViewCamera(this.scene);

        WorldEnvironment.setup(this.scene);

        MeshLoader.setScene(this.scene);
        MeshLoader.loadAssets(() => {
            this.scene.onReadyObservable.addOnce(() => {
                const buildingSpawner = new BuildingSpawner(this.scene);

                const ground = new Ground(this.scene);

                this.mainCamera.descentAnim();
            });
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