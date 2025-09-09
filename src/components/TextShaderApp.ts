import { Engine, Scene, HemisphericLight, FreeCamera, Vector3, Color4, Observable } from "@babylonjs/core";
import { AdvancedDynamicTexture, Image } from "@babylonjs/gui";

export default class TextShaderApp {
    private _sceneCanvas: HTMLCanvasElement;
    private _textureCanvas: HTMLCanvasElement;
    engine: Engine;
    scene: Scene;
    camera: FreeCamera;
    light!: HemisphericLight;
    gui!: AdvancedDynamicTexture;
    tImg!: Image;
    observables: {
        onTextureUpdate: Observable<void>
    };

    constructor(webglCanvas: HTMLCanvasElement, textureCanvas: HTMLCanvasElement) {
        this._sceneCanvas = webglCanvas;
        this._textureCanvas = textureCanvas;

        this.observables = {
            onTextureUpdate: new Observable<void>(),
        }

        this.engine = new Engine(this._sceneCanvas, true, { alpha: true });
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(0, 0, 0, 0);

        this.camera = new FreeCamera("cam", new Vector3(0, 0, 0), this.scene);
        this.camera.attachControl(this._sceneCanvas, true);

        this.scene.onReadyObservable.addOnce(async () => {
            this.light = new HemisphericLight("worldEnv", new Vector3(0, 1, 0), this.scene);
            this.gui = AdvancedDynamicTexture.CreateFullscreenUI("ui");

            const imageDataUrl = this._textureCanvas.toDataURL();

            this.tImg = new Image("itxt", imageDataUrl);
            this.tImg.width = 1;
            this.tImg.height = 1;
            this.gui.addControl(this.tImg);
        });

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        if (window) {
            window.addEventListener("resize", this.resize);
        }
    }

    async updateCanvasTexture() {
        this.scene.onReadyObservable.addOnce(() => {
            const imageDataUrl = this._textureCanvas.toDataURL();

            this.tImg.source = imageDataUrl;
            this.gui.update();
            this.observables.onTextureUpdate.notifyObservers();
        });
    }

    resize = () => {
        this.engine.resize();
    }

    kill() {
        window.removeEventListener("resize", this.resize);
        this.observables.onTextureUpdate.clear();
        this.engine.dispose();
    }
}