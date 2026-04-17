/**
 * WebGL aurora shader — adattato da React Bits (MIT)
 * @see https://www.reactbits.dev/backgrounds/aurora
 * @see https://github.com/DavidHDev/react-bits
 */
import { useEffect, useRef } from 'react';
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';

import styles from './aurora-background.module.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float uvY = 1.0 - uv.y;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.055, uTime * 0.14)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uvY * 2.0 - height + 0.2);
  float intensity = 0.48 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export interface AuroraBackgroundProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
}

const DEFAULT_STOPS = ['#5227FF', '#7cff67', '#5227FF'];

type AuroraBoost = { ampMul: number; blendAdd: number; blendCap: number };

/**
 * Su lg / laptop l’aurora WebGL risulta spesso troppo tenue (layout a due colonne, banda più sottile).
 * Tier rinforzato per 1024–1920px; fallback per schermi molto larghi.
 */
function getAuroraVisibilityBoost(): AuroraBoost {
  if (typeof window === 'undefined') {
    return { ampMul: 1, blendAdd: 0, blendCap: 1 };
  }

  const w = window.innerWidth;
  const h = window.innerHeight;

  if (
    (w >= 1024 && w <= 1920) ||
    h <= 860 ||
    (w <= 1440 && h <= 1000)
  ) {
    return { ampMul: 2.15, blendAdd: 0.32, blendCap: 1 };
  }

  if (w <= 1920 && h <= 1080) {
    return { ampMul: 1.55, blendAdd: 0.24, blendCap: 0.94 };
  }

  return { ampMul: 1.12, blendAdd: 0.12, blendCap: 1 };
}

export function AuroraBackground({
  colorStops = DEFAULT_STOPS,
  amplitude = 0.78,
  blend = 0.64,
  speed = 0.38,
}: AuroraBackgroundProps) {
  const propsRef = useRef({
    amplitude,
    blend,
    colorStops,
    speed,
  });
  propsRef.current = { amplitude, blend, colorStops, speed };

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';
    gl.canvas.style.pointerEvents = 'none';

    let program: Program | undefined;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }

    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const initial = propsRef.current;
    const colorStopsArray = initial.colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: initial.amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: initial.blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      if (!program) return;

      const p = propsRef.current;
      const timeFactor = reduceMotion ? 0.22 : t * 0.01;
      program.uniforms.uTime.value = timeFactor * p.speed * 0.1;

      const boost = getAuroraVisibilityBoost();
      program.uniforms.uAmplitude.value = p.amplitude * boost.ampMul;
      program.uniforms.uBlend.value =
        boost.blendAdd > 0
          ? Math.min(boost.blendCap, p.blend + boost.blendAdd)
          : p.blend;
      program.uniforms.uColorStops.value = p.colorStops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // Mount once; uniforms follow props via propsRef (come React Bits).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional single WebGL init
  }, []);

  return <div ref={ctnDom} className={styles.root} aria-hidden="true" />;
}
