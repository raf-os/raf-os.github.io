import { Engine, Scene, Observable, type EngineOptions, type SceneOptions } from "@babylonjs/core";
import BuildingSpawner from "./objects/BuildingSpawner";
import ViewCamera from "./objects/ViewCamera";
import Ground from "./objects/Ground";
import Sun from "./objects/Sun";

//import MeshLoader from "./singletons/MeshLoader";
import WorldEnvironment from "./singletons/WorldEnvironment";

interface AppProps {
    antialias?: boolean,
    engineOptions?: EngineOptions,
    adaptToDeviceRatio?: boolean,
    sceneOptions?: SceneOptions,
}

interface IAppObservables {
    onAssetsLoaded: Observable<void>;
}

export default class App {
    private _canvas: HTMLCanvasElement;
    private _opts: AppProps;
    engine: Engine;
    scene: Scene;
    mainCamera: ViewCamera;
    observables: IAppObservables;

    constructor(canvas: HTMLCanvasElement, opts: AppProps) {
        this._canvas = canvas;
        this._opts = opts;

        this.engine = new Engine(canvas, opts.antialias, opts.engineOptions, opts.adaptToDeviceRatio);
        this.scene = new Scene(this.engine, opts.sceneOptions);

        this.observables = {
            onAssetsLoaded: new Observable(undefined, true),
        }
        
        this.mainCamera = new ViewCamera(this.scene);

        WorldEnvironment.setup(this.scene);
        const ground = new Ground(this.scene);
        const sun = new Sun(this.scene);

        this.scene.onReadyObservable.addOnce(() => {
            WorldEnvironment.glowLayer.addIncludedOnlyMesh(ground.mesh);
            WorldEnvironment.glowLayer.addIncludedOnlyMesh(sun.mesh);

            this.observables.onAssetsLoaded.notifyObservers();

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