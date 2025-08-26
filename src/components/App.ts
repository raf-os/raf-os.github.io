import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3, type EngineOptions, type SceneOptions, type Camera } from "@babylonjs/core";

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
    worldEnv: HemisphericLight;

    constructor(canvas: HTMLCanvasElement, opts: AppProps) {
        this._canvas = canvas;
        this._opts = opts;

        this.engine = new Engine(canvas, opts.antialias, opts.engineOptions, opts.adaptToDeviceRatio);
        this.scene = new Scene(this.engine, opts.sceneOptions);

        this.mainCamera = new ArcRotateCamera("MainCamera", Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), this.scene);
        this.mainCamera.attachControl(this.scene, true);

        this.worldEnv = new HemisphericLight("sun", new Vector3(1, 1, 0), this.scene);

        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this.scene);
        sphere.position.y = 0.5;

        const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);

        if (window) {
            window.addEventListener("resize", this.resize);
        }

        this.engine.runRenderLoop(() => this.scene.render());
    }

    get canvas() {
        return this._canvas;
    }

    resize() {
        this.engine.resize();
    }

    kill() {
        window.removeEventListener("resize", this.resize);
        this.engine.dispose();
    }
}