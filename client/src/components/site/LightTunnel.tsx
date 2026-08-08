import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import "./LightTunnel.css";

type FlowDirection = "inward" | "outward";

export type LightTunnelProps = {
  cableColor?: string;
  pulseColor?: string;
  tunnelColor?: string;
  tunnelOpacity?: number;
  speed?: number;
  flowDirection?: FlowDirection;
  pulseSpeed?: number;
  pulseLength?: number;
  pulseBlend?: number;
  pulseWidth?: number;
  cableCount?: number;
  thickness?: number;
  rimWidth?: number;
  waviness?: number;
  sway?: number;
  size?: number;
  centerX?: number;
  centerY?: number;
  glow?: number;
  fadeNear?: number;
  fadeFar?: number;
  brightness?: number;
  colorVariance?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  className?: string;
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uFlowDir;
uniform float uPulseSpeed;
uniform float uPulseLength;
uniform float uPulseBlend;
uniform float uPulseWidth;
uniform float uCableCount;
uniform float uThickness;
uniform float uRimWidth;
uniform float uWaviness;
uniform float uSway;
uniform float uSize;
uniform vec2 uCenter;
uniform vec2 uMouseOffset;
uniform float uGlow;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uBrightness;
uniform float uColorVariance;
uniform float uOpacity;
uniform vec3 uCableColor;
uniform vec3 uPulseColor;
uniform vec3 uTunnelColor;
uniform float uTunnelOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
out vec4 fragColor;

void mainImage(out vec4 o, in vec2 fragCoord) {
  float size = uSize * 2.0;
  float speedBase = uSpeed * 4.0 * uFlowDir;
  float waviness = uWaviness * 0.15;
  float rotationOsc = uSway * 0.5;
  float baseThick = uThickness * 0.35 + 0.05;
  float borderWeight = uRimWidth * 0.15 + 0.01;
  float cablesCount = floor(uCableCount);

  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord - 0.5 * res) / min(res.y, res.x);
  uv -= (uCenter + uMouseOffset);
  uv /= (size + 0.0001);

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float depth = -log(r + 0.0001);
  float swing = sin(iTime * (uSpeed * 0.5 + 0.1)) * rotationOsc;
  float waveOffset = sin(depth * 1.2 + iTime * speedBase * 0.25) * waviness;
  float angleNormalized = (angle / 6.2831853) + 0.5;
  float finalAngle = fract(angleNormalized + waveOffset + swing);

  float cableID = floor(finalAngle * cablesCount);
  float gvX = fract(finalAngle * cablesCount) - 0.5;
  float rand = fract(sin(cableID * 12.9898) * 43758.5453);
  float randSpeed = (0.4 + rand * 0.6) * speedBase * uPulseSpeed;
  float cableThick = baseThick * (0.6 + rand * 0.4);

  vec3 cableCol = uCableColor;
  cableCol *= 1.0 + (rand - 0.5) * 0.4 * uColorVariance;
  cableCol = mix(cableCol, uPulseColor, rand * 0.25 * uColorVariance);

  float scroll = depth + (iTime * randSpeed);
  float pulseFact = fract(scroll);
  float distToCore = abs(gvX);
  float wireMask = smoothstep(cableThick, cableThick - 0.05, distToCore);
  float rimGlow = smoothstep(borderWeight, 0.0, abs(distToCore - cableThick));
  float pulseThick = cableThick * uPulseWidth;
  float pulseMask = smoothstep(pulseThick, pulseThick - 0.05 * uPulseWidth, distToCore);
  float pulseDist = abs(pulseFact - 0.5);
  float pulseTotal = uPulseLength;
  float pulseCore = pulseTotal * (1.0 - uPulseBlend);
  float pulseLo = min(pulseCore, pulseTotal - max(fwidth(scroll), 1e-4));
  float dataPulse = 1.0 - smoothstep(pulseLo, pulseTotal, pulseDist);
  float aBody = wireMask * uTunnelOpacity;
  float aRim = rimGlow;
  float aPulse = clamp(dataPulse * pulseMask, 0.0, 1.0);
  vec3 fiberCol = uTunnelColor * aBody
    + cableCol * aRim * 1.3 * uGlow
    + uPulseColor * dataPulse * 3.0 * pulseMask;
  float distFade = smoothstep(0.0, uFadeNear, r) * smoothstep(uFadeFar, uFadeFar - 0.9, r);
  float inten = clamp(aBody + aRim + aPulse, 0.0, 1.0) * distFade;
  vec3 finalCol = fiberCol * uBrightness;
  float alpha = clamp(inten, 0.0, 1.0) * uOpacity;
  vec3 outRgb = finalCol * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }
  o = vec4(outRgb, alpha);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  fragColor = o;
}
`;

type TunnelContext = {
  renderer: Renderer;
  program: Program;
  mesh: Mesh;
};

const contextMap = new WeakMap<HTMLDivElement, TunnelContext>();

export default function LightTunnel({
  cableColor = "#4A8AFF",
  pulseColor = "#F4C756",
  tunnelColor = "#12366F",
  tunnelOpacity = 0.05,
  speed = 0.08,
  flowDirection = "outward",
  pulseSpeed = 2.2,
  pulseLength = 0.24,
  pulseBlend = 0.85,
  pulseWidth = 0.9,
  cableCount = 18,
  thickness = 0.25,
  rimWidth = 0.12,
  waviness = 0.24,
  sway = 0.32,
  size = 0.95,
  centerX = 0.2,
  centerY = 0,
  glow = 0.9,
  fadeNear = 0.3,
  fadeFar = 2,
  brightness = 0.9,
  colorVariance = true,
  grain = true,
  grainIntensity = 0.025,
  opacity = 0.5,
  mouseInteraction = true,
  mouseStrength = 0.05,
  className = "",
}: LightTunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseEnabledRef = useRef(mouseInteraction);
  const mouseStrengthRef = useRef(mouseStrength);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: Renderer;

    try {
      renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    } catch {
      container.dataset.fallback = "true";
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: speed },
        uFlowDir: { value: flowDirection === "outward" ? -1 : 1 },
        uPulseSpeed: { value: pulseSpeed },
        uPulseLength: { value: pulseLength },
        uPulseBlend: { value: pulseBlend },
        uPulseWidth: { value: pulseWidth },
        uCableCount: { value: cableCount },
        uThickness: { value: thickness },
        uRimWidth: { value: rimWidth },
        uWaviness: { value: waviness },
        uSway: { value: sway },
        uSize: { value: size },
        uCenter: { value: new Float32Array([centerX, centerY]) },
        uMouseOffset: { value: new Float32Array([0, 0]) },
        uGlow: { value: glow },
        uFadeNear: { value: fadeNear },
        uFadeFar: { value: fadeFar },
        uBrightness: { value: brightness },
        uColorVariance: { value: colorVariance ? 1 : 0 },
        uOpacity: { value: opacity },
        uCableColor: { value: new Float32Array(hexToRgb(cableColor)) },
        uPulseColor: { value: new Float32Array(hexToRgb(pulseColor)) },
        uTunnelColor: { value: new Float32Array(hexToRgb(tunnelColor)) },
        uTunnelOpacity: { value: tunnelOpacity },
        uGrain: { value: grain ? 1 : 0 },
        uGrainIntensity: { value: grainIntensity },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    contextMap.set(container, { renderer, program, mesh });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const resolution = program.uniforms.iResolution.value as Float32Array;
      resolution[0] = gl.drawingBufferWidth;
      resolution[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    setSize();

    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse = [(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height];
    };
    const handleMouseLeave = () => { targetMouse = [0.5, 0.5]; };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let frame = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const startTime = performance.now();

    const loop = (time: number) => {
      program.uniforms.iTime.value = (time - startTime) * 0.001;
      const target = mouseEnabledRef.current ? targetMouse : [0.5, 0.5];
      currentMouse[0] += 0.05 * (target[0] - currentMouse[0]);
      currentMouse[1] += 0.05 * (target[1] - currentMouse[1]);
      const offset = program.uniforms.uMouseOffset.value as Float32Array;
      offset[0] = (currentMouse[0] - 0.5) * mouseStrengthRef.current;
      offset[1] = (currentMouse[1] - 0.5) * mouseStrengthRef.current;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (!reducedMotion && isVisible && isPageVisible && frame === 0) frame = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      isVisible ? tryStart() : tryStop();
    });
    intersectionObserver.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    tryStart();

    return () => {
      tryStop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      contextMap.delete(container);
      if (canvas.parentElement === container) container.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  useEffect(() => {
    mouseEnabledRef.current = mouseInteraction;
    mouseStrengthRef.current = mouseStrength;
    const container = containerRef.current;
    const context = container ? contextMap.get(container) : undefined;
    if (!context) return;
    const uniforms = context.program.uniforms;
    uniforms.uSpeed.value = speed;
    uniforms.uFlowDir.value = flowDirection === "outward" ? -1 : 1;
    uniforms.uPulseSpeed.value = pulseSpeed;
    uniforms.uPulseLength.value = pulseLength;
    uniforms.uPulseBlend.value = pulseBlend;
    uniforms.uPulseWidth.value = pulseWidth;
    uniforms.uCableCount.value = cableCount;
    uniforms.uThickness.value = thickness;
    uniforms.uRimWidth.value = rimWidth;
    uniforms.uWaviness.value = waviness;
    uniforms.uSway.value = sway;
    uniforms.uSize.value = size;
    const center = uniforms.uCenter.value as Float32Array;
    center[0] = centerX;
    center[1] = centerY;
    uniforms.uGlow.value = glow;
    uniforms.uFadeNear.value = fadeNear;
    uniforms.uFadeFar.value = fadeFar;
    uniforms.uBrightness.value = brightness;
    uniforms.uColorVariance.value = colorVariance ? 1 : 0;
    uniforms.uGrain.value = grain ? 1 : 0;
    uniforms.uGrainIntensity.value = grainIntensity;
    uniforms.uOpacity.value = opacity;
    const cable = hexToRgb(cableColor);
    const pulse = hexToRgb(pulseColor);
    const tunnel = hexToRgb(tunnelColor);
    (uniforms.uCableColor.value as Float32Array).set(cable);
    (uniforms.uPulseColor.value as Float32Array).set(pulse);
    (uniforms.uTunnelColor.value as Float32Array).set(tunnel);
    uniforms.uTunnelOpacity.value = tunnelOpacity;
  }, [cableColor, pulseColor, tunnelColor, tunnelOpacity, speed, flowDirection, pulseSpeed, pulseLength, pulseBlend, pulseWidth, cableCount, thickness, rimWidth, waviness, sway, size, centerX, centerY, glow, fadeNear, fadeFar, brightness, colorVariance, grain, grainIntensity, opacity, mouseInteraction, mouseStrength]);

  return <div ref={containerRef} className={`light-tunnel-container ${className}`.trim()} aria-hidden="true" />;
}
