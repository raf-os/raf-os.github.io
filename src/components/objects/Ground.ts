import { MeshBuilder, Mesh, Vector2, ShaderMaterial, Effect, Color3, type Scene, Vector3, Matrix } from "@babylonjs/core";

const vertexShaderSample = `#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform mat4 world;
uniform float time;

// Varying
out vec2 vUV;
out vec3 vPos;
out vec2 vFx;

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

#define NUM_OCTAVES 3
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main(void) {
    // float tt = time * .5;
    // vec4 mPos = world * vec4(position, 1.);
    // vec2 vMov = mPos.xz + vec2(tt, 0.);
    
    // vec2 base = floor(vMov);
    // vec2 offs = fract(vMov);
    
    // float fx1 = fbm(vec2(base.x, 0.));
    // float fx2 = fbm(vec2(base.x, 0.) + vec2(1., 0.));
    // float fx = mix(fx1, fx2, offs.x);
    
    // float fy1 = fbm(vec2(0., base.y));
    // float fy2 = fbm(vec2(0., base.y) + vec2(0., 1.));
    // float fy = mix(fy1, fy2, offs.y);
    
    // mPos.y = fbm(vMov) * 2.;
    // gl_Position = worldViewProjection * mPos;

    // vUV = uv;
    // vPos = position;
    // vFx = vec2(fx, fy);
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;
}`;

const fragmentShaderSample = `#version 300 es

precision highp float;

in vec2 vUV;

uniform float time;

out vec4 fragColor;

void main(void) {
    vec2 coord = vUV + vec2(time * 4., 0.);
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y) / 2.;
    float color = 1.0 - min(line, 1.0);
    color = pow(color, 1.0 / 2.2);
    vec4 col = vec4(vec3(color) * vec3(0.7, 0., 1.0), 1.);
    fragColor = mix(vec4(0.1, 0.1, 0.125, 1.), col, color);
}`;

export default class Ground {
    scene: Scene;
    mesh: Mesh;
    material: ShaderMaterial;
    dimensions: Vector2 = new Vector2(100, 100);
    startTime = 0;

    constructor(scene: Scene) {
        this.scene = scene;

        this.mesh = MeshBuilder.CreateTiledGround(
            "ground",
            {
                xmin: -8,
                zmin: -8,
                xmax: 8,
                zmax: 8,
                subdivisions: {
                    w: 32,
                    h: 32,
                },
                updatable: true,
            },
            this.scene
        );
        // TODO: Make movement animation with node geometry, maybe?
        //this.mesh.position = new Vector3(-4, 0, -4);
        //this.mesh = MeshBuilder.CreateGround("ground", { width: 16, height: 16, subdivisions: 128}, this.scene);
        Effect.ShadersStore['gridVertexShader'] = vertexShaderSample;
        Effect.ShadersStore['gridFragmentShader'] = fragmentShaderSample;
        this.material = new ShaderMaterial("gridShader", this.scene, {
            vertex: "grid",
            fragment: "grid",
        }, {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time"]
        });
        this.material.setFloat("time", 0);
        //this.material.diffuseColor = new Color3(1, 1, 1);
        //this.material.backFaceCulling = true;
        this.startTime = performance.now();
        this.scene.onBeforeRenderObservable.add(() => {
            const time = (performance.now() - this.startTime) * .001;
            this.material.setFloat("time", time);
        });
        this.mesh.material = this.material;
    }
}