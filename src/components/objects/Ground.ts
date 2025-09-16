import { MeshBuilder, Mesh, Vector2, ShaderMaterial, Effect, Color3, type Scene, Vector3, Animation } from "@babylonjs/core";

const vertexShaderSample = `#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform mat4 world;
uniform float time;
uniform float scale;
uniform vec2 mDimensions;

// Varying
out vec2 vUV;
out vec3 vPos;
out vec4 wPos;
out float heightVal;

// Simplex noise
// https://github.com/ashima/webgl-noise
// https://github.com/stegu/webgl-noise
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

#define OCTAVES 3
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;

    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * ((snoise(st) + 1.) / 2.);
        st *= 2.3;
        amplitude *= amplitude;
    }
    return value;
}

void main(void) {
    vec4 mPos = world * vec4(position - vec3(time * 2., 0., 0.), 1.);
    vec2 vMov = (mPos.xz);
    
    float mountain = smoothstep(0., -mDimensions.y, position.z);
    float heightFactor = smoothstep(8., -mDimensions.y * .75, position.z) * 12. + 0.5;
    float myHeight = (fbm(vMov * 0.05)) * heightFactor + mountain * 12.;
    mPos.y = myHeight;
    gl_Position = worldViewProjection * vec4(position + vec3(0., mPos.y, 0.), 1.0);

    vUV = uv;
    vPos = position;
    wPos = world * vec4(position, 1.);
    heightVal = myHeight;
}`;

const fragmentShaderSample = `#version 300 es

precision highp float;

in vec2 vUV;
in vec3 vPos;
in vec4 wPos;
in float heightVal;

uniform float time;
uniform float scale;
uniform vec2 mDimensions;

out vec4 fragColor;

void main(void) {
    vec2 coord = vUV * 1.;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y) / 2.5;
    float color = 1.0 - min(line, 1.0);

    float hParam = smoothstep(11.0, 20.0, heightVal);
    vec4 gColor = mix(vec4(0.7, 0., 0.9, 1.), vec4(0.3, 0.6, 1., 1.), hParam);
    vec4 col = vec4(vec3(color), 1.) * (gColor);
    fragColor = mix(vec4(0.12, 0.12, 0.15, 1.), col * 1.75, color);
    fragColor *= smoothstep(-mDimensions.x + 1., -mDimensions.x + 5., wPos.x) * smoothstep(mDimensions.x - 1., mDimensions.x - 5., wPos.x);
}`;

export default class Ground {
    scene: Scene;
    mesh: Mesh;
    material: ShaderMaterial;
    dimensions = new Vector2(128, 64);
    subdivisions = new Vector2(128, 64);

    constructor(scene: Scene) {
        this.scene = scene;

        this.mesh = MeshBuilder.CreateTiledGround(
            "ground",
            {
                xmin: -this.dimensions.x / 2,
                zmin: -this.dimensions.y / 2,
                xmax: this.dimensions.x / 2,
                zmax: this.dimensions.y / 2,
                subdivisions: {
                    w: this.subdivisions.x,
                    h: this.subdivisions.y,
                },
                updatable: true,
            },
            this.scene
        );
        this.mesh.freezeNormals();
        Effect.ShadersStore['gridVertexShader'] = vertexShaderSample;
        Effect.ShadersStore['gridFragmentShader'] = fragmentShaderSample;
        this.material = new ShaderMaterial("gridShader", this.scene, {
            vertex: "grid",
            fragment: "grid",
        }, {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "scale"],
            needAlphaBlending: true,
        });
        this.material.setFloat("time", 0);
        this.material.setFloat("scale", this.dimensions.x / (this.subdivisions.x / 2));
        this.material.setVector2("mDimensions", this.dimensions.scale(.5));

        let time = 0;
        this.scene.onBeforeRenderObservable.add(() => {
            const deltaTime = this.scene.getEngine().getDeltaTime();
            time += (deltaTime * 0.001);
            this.material.setFloat("time", time);
        });
        this.mesh.material = this.material;

        const framerate = 10;
        const slideAnim = new Animation("slideAnim", "position.x", framerate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
        const keyframes = [{
            frame: 0,
            value: -this.dimensions.x / (this.subdivisions.x),
        }, {
            frame: 10,
            value: this.dimensions.x / (this.subdivisions.x),
        }];
        slideAnim.setKeys(keyframes);
        this.mesh.animations.push(slideAnim);

        this.scene.onReadyObservable.addOnce(() => this.scene.beginAnimation(this.mesh, 0, 1 * framerate, true, 1));
    }
}