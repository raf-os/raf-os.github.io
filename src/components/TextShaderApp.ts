import { Engine, Scene, HemisphericLight, FreeCamera, Vector3, Color4, Observable, PostProcess, Effect, Texture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Image, Control } from "@babylonjs/gui";

const vertexShaderSample = `#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;

// Varying
out vec2 vUV;

void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);

    vUV = uv;
}`;

const fragmentShaderSample = `#version 300 es
precision highp float;

in vec2 vUV;

uniform sampler2D textureSampler;
uniform float time;

out vec4 fragColor;

// Noise + fBM algorithm credit: thebookofshaders.com
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .75;
    }
    return value * 2. - 1.;
}

void main(void) {
    vec2 uv = vUV;
    uv.x += fbm(vUV * 8. + time * .2) * .05;
    uv.y = 1.0 - vUV.y;
    vec4 color = texture(textureSampler, uv);
    float fade = smoothstep(.2, 1.0, vUV.y);
    color.a *= fade;
    color.rgb *= fade;
    fragColor = color;
}`;

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

        this.engine = new Engine(this._sceneCanvas, true, { alpha: true, antialias: true });
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(0, 0, 0, 0);

        this.camera = new FreeCamera("cam", new Vector3(0, 0, 0), this.scene);
        this.camera.attachControl(this._sceneCanvas, true);

        this.scene.onReadyObservable.addOnce(async () => {
            Effect.ShadersStore["myShaderVertexShader"] = vertexShaderSample;
            Effect.ShadersStore["myShaderFragmentShader"] = fragmentShaderSample;

            const startTime = Date.now();

            const myShader = new PostProcess(
                "myShader",
                "myShader",
                ["time", "screenSize"],
                null,
                1.0,
                this.camera,
                Texture.BILINEAR_SAMPLINGMODE,
                this.engine,
                false,
            );

            myShader.onApply = (effect) => {
                const time = (Date.now() - startTime) * .001;
                effect.setFloat("time", time);
            }

            this.light = new HemisphericLight("worldEnv", new Vector3(0, 1, 0), this.scene);
            this.gui = AdvancedDynamicTexture.CreateFullscreenUI("ui");

            const imageDataUrl = this._textureCanvas.toDataURL();

            this.tImg = new Image("itxt", imageDataUrl);
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
            this.tImg.width = 1;
            this.tImg.height = 0.5;
            //this.tImg.stretch = Image.STRETCH_NONE;
            this.tImg.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
            this.tImg.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
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