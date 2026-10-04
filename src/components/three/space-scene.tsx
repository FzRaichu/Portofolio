"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  Group,
  MeshBasicMaterial,
  Points,
  ShaderMaterial,
} from "three";
import type { MotionValue } from "motion/react";
import { sceneAtProgress } from "@/lib/journey";

const starVertex =
  "attribute float aSize; varying float vAlpha; void main() { vec4 view = modelViewMatrix * vec4(position, 1.0); vAlpha = aSize * 0.5 + 0.35; gl_Position = projectionMatrix * view; gl_PointSize = clamp(aSize * 24.0 / -view.z, 1.0, 3.2); }";
const starFragment =
  "varying float vAlpha; void main() { float radius = length(gl_PointCoord - 0.5); float alpha = smoothstep(0.5, 0.05, radius) * vAlpha; gl_FragColor = vec4(0.94, 0.82, 0.7, alpha); }";
const coreVertex =
  "varying vec3 vPosition; void main() { vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
const coreFragment = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vPosition;
  void main() {
    float signal = pow(0.5 + 0.5 * sin(vPosition.y * 3.0 + vPosition.x * 2.0 - uTime * 0.7), 5.0);
    float gradient = smoothstep(-1.5, 1.5, vPosition.y + vPosition.x * 0.35);
    vec3 color = mix(vec3(0.95, 0.39, 0.18), vec3(0.72, 0.3, 0.43), gradient);
    color = mix(color, vec3(1.0, 0.8, 0.53), signal * 0.65);
    gl_FragColor = vec4(color, (0.16 + signal * 0.7) * uEnergy);
  }
`;
function makeStars(count: number) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - 0.5) * 65;
    positions[i * 3 + 1] = (random() - 0.5) * 40;
    positions[i * 3 + 2] = -random() * 55;
    sizes[i] = 0.5 + random() * 1.8;
  }
  return { positions, sizes };
}
export function SpaceScene({
  progress,
  compact,
  onContextLost,
  onDegrade,
}: {
  progress: MotionValue<number>;
  compact: boolean;
  onContextLost: () => void;
  onDegrade: () => void;
}) {
  const sculpture = useRef<Group>(null);
  const stars = useRef<Points>(null);
  const coreMaterial = useRef<ShaderMaterial>(null);
  const wireMaterial = useRef<MeshBasicMaterial>(null);
  const echoMaterial = useRef<MeshBasicMaterial>(null);
  const time = useRef(0);
  const smoothProgress = useRef(progress.get());
  const pointer = useRef({ x: 0, y: 0 });
  const stats = useRef({ frames: 0, total: 0, degraded: false });
  const { gl } = useThree();
  const field = useMemo(() => makeStars(compact ? 650 : 1600), [compact]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uEnergy: { value: 1 } }),
    [],
  );
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onContextLost]);
  useEffect(() => {
    if (compact) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [compact]);
  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    time.current += delta;
    const damping = 1 - Math.exp(-delta * 4.2);
    smoothProgress.current +=
      (progress.get() - smoothProgress.current) * damping;
    const pose = sceneAtProgress(smoothProgress.current);
    camera.position.x +=
      (pointer.current.x * 0.32 - camera.position.x) * damping;
    camera.position.y +=
      (-pointer.current.y * 0.2 - camera.position.y) * damping;
    camera.position.z = pose.z;
    camera.lookAt(0, 0, 0);
    if (sculpture.current) {
      sculpture.current.position.set(
        compact ? pose.x * 0.12 : pose.x,
        compact ? 1.25 : pose.y,
        0,
      );
      sculpture.current.rotation.set(
        pose.rx + Math.sin(time.current * 0.1) * 0.08,
        pose.ry + time.current * 0.055,
        pose.rz,
      );
      sculpture.current.scale.setScalar(pose.scale * (compact ? 0.73 : 1));
    }
    if (stars.current) {
      stars.current.rotation.z = time.current * 0.002;
      stars.current.position.z = smoothProgress.current * 10;
    }
    // Let the sculpture recede as the work and conversation take focus.
    if (wireMaterial.current) wireMaterial.current.opacity = 0.19 * pose.energy;
    if (echoMaterial.current) echoMaterial.current.opacity = 0.11 * pose.energy;
    if (coreMaterial.current) {
      coreMaterial.current.uniforms.uTime.value = time.current;
      coreMaterial.current.uniforms.uEnergy.value = pose.energy;
    }
    // Ignore warm-up and background-tab gaps; adapt only after sustained slow frames.
    const sample = stats.current;
    if (time.current > 3 && rawDelta < 0.15 && !sample.degraded) {
      sample.frames++;
      sample.total += rawDelta;
      if (sample.frames === 120) {
        if (sample.total / sample.frames > 1 / 38) {
          sample.degraded = true;
          onDegrade();
        }
        sample.frames = 0;
        sample.total = 0;
      }
    }
  });
  return (
    <>
      <points ref={stars} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[field.positions, 3]}
          />
          <bufferAttribute attach="attributes-aSize" args={[field.sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={starVertex}
          fragmentShader={starFragment}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
      <group ref={sculpture}>
        <mesh>
          <torusKnotGeometry
            args={[1.35, 0.34, compact ? 100 : 180, 12, 2, 3]}
          />
          <meshBasicMaterial
            ref={wireMaterial}
            color="#e9a16d"
            wireframe
            transparent
            opacity={0.19}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh scale={1.065} rotation={[0, 0, 0.025]}>
          <torusKnotGeometry
            args={[1.35, 0.34, compact ? 100 : 180, 6, 2, 3]}
          />
          <meshBasicMaterial
            ref={echoMaterial}
            color="#c98196"
            wireframe
            transparent
            opacity={0.11}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
        <mesh scale={0.97}>
          <torusKnotGeometry args={[1.35, 0.05, 160, 5, 2, 3]} />
          <shaderMaterial
            ref={coreMaterial}
            uniforms={uniforms}
            vertexShader={coreVertex}
            fragmentShader={coreFragment}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </>
  );
}
