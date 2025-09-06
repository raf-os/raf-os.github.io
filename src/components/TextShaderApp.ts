import { Engine, Scene, HemisphericLight, FreeCamera, Vector3, Color4, DynamicTexture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Image } from "@babylonjs/gui";

export default class TextShaderApp {
    private _sceneCanvas: HTMLCanvasElement;
    private _textureCanvas: HTMLCanvasElement;
    engine: Engine;
    scene: Scene;
    camera: FreeCamera;
    light!: HemisphericLight;
    gui!: AdvancedDynamicTexture;

    constructor(webglCanvas: HTMLCanvasElement, textureCanvas: HTMLCanvasElement) {
        this._sceneCanvas = webglCanvas;
        this._textureCanvas = textureCanvas;

        this.engine = new Engine(this._sceneCanvas, true, { alpha: true });
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(0, 0, 0, 0);

        this.camera = new FreeCamera("cam", new Vector3(0, 0, 0), this.scene);
        this.camera.attachControl(this._sceneCanvas, true);

        this.scene.onReadyObservable.addOnce(() => {
            this.light = new HemisphericLight("worldEnv", new Vector3(0, 1, 0), this.scene);
            this.gui = AdvancedDynamicTexture.CreateFullscreenUI("ui");

            const imageDataUrl = this._textureCanvas.toDataURL();

            const tImg = new Image("itxt", imageDataUrl);
            tImg.width = 1;
            tImg.height = 1;
            this.gui.addControl(tImg);
        });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        if (window) {
            window.addEventListener("resize", this.resize);
        }
    }

    resize = () => {
        this.engine.resize();
    }

    kill() {
        window.removeEventListener("resize", this.resize);
        this.engine.dispose();
    }
}