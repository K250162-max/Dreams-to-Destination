import { Line, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const EARTH_TEXTURE = "/textures/earth.jpg";

function latLonToVector3(lat: number, lon: number, radius = 2.03) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function Earth() {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(EARTH_TEXTURE);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  useFrame((state, delta) => {
    if (!groupRef.current || !earthRef.current || !cloudRef.current || !atmosphereRef.current) return;
    earthRef.current.rotation.y += delta * 0.055;
    cloudRef.current.rotation.y += delta * 0.072;
    cloudRef.current.rotation.z += delta * 0.006;
    atmosphereRef.current.rotation.z -= delta * 0.012;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.12, 0.035);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -state.pointer.x * 0.09, 0.035);
  });

  return (
    <group ref={groupRef} rotation={[0.09, -0.45, -0.03]}>
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 96, 96]} />
        <meshStandardMaterial map={texture} roughness={0.82} metalness={0.02} emissive="#061a38" emissiveIntensity={0.18} />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.026, 64, 64]} />
        <meshStandardMaterial color="#d9eeff" transparent opacity={0.075} roughness={1} wireframe />
      </mesh>
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.13, 64, 64]} />
        <meshBasicMaterial color="#4a8aff" transparent opacity={0.12} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh scale={[1.07, 1.07, 1.07]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.15, 0.012, 8, 180]} />
        <meshBasicMaterial color="#6ea7ff" transparent opacity={0.38} blending={THREE.AdditiveBlending} />
      </mesh>
      <CountryPins />
    </group>
  );
}

const pinLocations = [
  [51.5, -0.12], [43.65, -79.38], [52.52, 13.4], [25.2, 55.27], [-33.87, 151.21], [40.71, -74],
];

function CountryPins() {
  return (
    <group>
      {pinLocations.map(([lat, lon], index) => {
        const position = latLonToVector3(lat, lon);
        return (
          <group key={`${lat}-${lon}`} position={position} lookAt={[0, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.038, 12, 12]} />
              <meshBasicMaterial color={index % 2 ? "#4a8aff" : "#f4c756"} toneMapped={false} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.085, 0.008, 6, 30]} />
              <meshBasicMaterial color={index % 2 ? "#4a8aff" : "#f4c756"} transparent opacity={0.7} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

type FlightPathProps = { start: [number, number]; end: [number, number]; offset: number; color: string };

function FlightPath({ start, end, offset, color }: FlightPathProps) {
  const planeRef = useRef<THREE.Group>(null);
  const { curve, points } = useMemo(() => {
    const startPoint = latLonToVector3(start[0], start[1], 2.11);
    const endPoint = latLonToVector3(end[0], end[1], 2.11);
    const midpoint = startPoint.clone().add(endPoint).multiplyScalar(0.5).normalize().multiplyScalar(2.85);
    const path = new THREE.CatmullRomCurve3([startPoint, midpoint, endPoint]);
    return { curve: path, points: path.getPoints(70) };
  }, [start, end]);

  useFrame(state => {
    if (!planeRef.current) return;
    const progress = (state.clock.elapsedTime * 0.055 + offset) % 1;
    const point = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(Math.min(0.999, progress + 0.003));
    planeRef.current.position.copy(point);
    planeRef.current.lookAt(point.clone().add(tangent));
  });

  return (
    <group>
      <Line points={points} color={color} transparent opacity={0.55} lineWidth={1} dashed dashScale={7} dashSize={0.42} gapSize={0.3} />
      <group ref={planeRef} scale={0.12}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.26, 1.4, 5]} />
          <meshStandardMaterial color="#f8fbff" emissive={color} emissiveIntensity={0.35} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.15]} scale={[1.8, 0.12, 0.45]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#dbeafe" emissive={color} emissiveIntensity={0.2} />
        </mesh>
        <pointLight color={color} intensity={2.5} distance={1.5} />
      </group>
    </group>
  );
}

function Satellite({ radius = 3.1, speed = 0.18, tilt = 0.4 }: { radius?: number; speed?: number; tilt?: number }) {
  const orbitRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!orbitRef.current) return;
    orbitRef.current.rotation.y += delta * speed;
    orbitRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.1 + tilt;
  });
  return (
    <group ref={orbitRef} rotation={[tilt, 0, 0]}>
      <group position={[radius, 0, 0]} scale={0.2}>
        <mesh>
          <boxGeometry args={[0.75, 0.55, 0.55]} />
          <meshStandardMaterial color="#c8d8ee" metalness={0.8} roughness={0.3} />
        </mesh>
        {[-0.95, 0.95].map(x => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[1.05, 0.04, 0.6]} />
            <meshStandardMaterial color="#2356a8" emissive="#153b78" emissiveIntensity={0.45} metalness={0.65} />
          </mesh>
        ))}
        <pointLight color="#7aa8ff" intensity={2} distance={2} />
      </group>
    </group>
  );
}

function FloatingTravelObjects() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(state => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.13;
  });
  return (
    <group ref={groupRef}>
      <group position={[-3.3, -1.65, 0.4]} rotation={[0.12, -0.5, -0.2]}>
        <mesh>
          <boxGeometry args={[0.9, 1.15, 0.22]} />
          <meshStandardMaterial color="#13386d" metalness={0.35} roughness={0.35} emissive="#0b2551" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[0, 0.72, 0]}>
          <torusGeometry args={[0.2, 0.035, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#d0a848" metalness={0.65} />
        </mesh>
      </group>
      <group position={[3.35, 1.7, -0.6]} rotation={[0.2, 0.35, -0.25]}>
        <mesh>
          <boxGeometry args={[1.4, 0.62, 0.055]} />
          <meshStandardMaterial color="#e8edf6" roughness={0.35} emissive="#5d87c9" emissiveIntensity={0.13} />
        </mesh>
        <mesh position={[0.45, 0, 0.04]}>
          <boxGeometry args={[0.05, 0.43, 0.015]} />
          <meshBasicMaterial color="#2767e8" />
        </mesh>
      </group>
    </group>
  );
}

function MeteorField() {
  const meteors = useMemo(() => Array.from({ length: 5 }, (_, index) => ({
    position: new THREE.Vector3(5 + index * 1.2, 3.8 + index * 0.35, -7 - index),
    speed: 1.8 + index * 0.25,
  })), []);
  const refs = useRef<Array<THREE.Mesh | null>>([]);
  useFrame((_, delta) => {
    refs.current.forEach((meteor, index) => {
      if (!meteor) return;
      meteor.position.x -= delta * meteors[index].speed;
      meteor.position.y -= delta * meteors[index].speed * 0.42;
      if (meteor.position.x < -7) {
        meteor.position.x = 6 + index;
        meteor.position.y = 4 + index * 0.4;
      }
    });
  });
  return (
    <group>
      {meteors.map((meteor, index) => (
        <mesh key={index} ref={node => { refs.current[index] = node; }} position={meteor.position} rotation={[0, 0, -1.14]}>
          <cylinderGeometry args={[0.008, 0.045, 1.35, 5]} />
          <meshBasicMaterial color={index % 2 ? "#76a7ff" : "#f4c756"} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function Aurora() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(state => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.025;
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.045 + Math.sin(state.clock.elapsedTime * 0.55) * 0.018;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0, 0]} scale={[1.4, 0.9, 1]}>
      <torusGeometry args={[3.15, 0.55, 10, 180]} />
      <meshBasicMaterial color="#55d6bf" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    const depth = Math.min(1, window.scrollY / Math.max(window.innerHeight, 1));
    const targetX = pointer.x * 0.32;
    const targetY = pointer.y * 0.22 + depth * 0.26;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.2 + depth * 0.95, 0.028);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#07101f", 8, 20]} />
      <ambientLight intensity={0.46} />
      <directionalLight position={[4, 3, 5]} intensity={2.4} color="#dcecff" />
      <pointLight position={[-4, -2, 3]} intensity={8} color="#2767e8" distance={10} />
      <pointLight position={[3, 1, 4]} intensity={4} color="#f4c756" distance={8} />
      <Stars radius={35} depth={24} count={1000} factor={2.5} saturation={0.25} fade speed={0.45} />
      <Earth />
      <FlightPath start={[51.5, -0.12]} end={[-33.87, 151.21]} offset={0.1} color="#f4c756" />
      <FlightPath start={[43.65, -79.38]} end={[25.2, 55.27]} offset={0.58} color="#4a8aff" />
      <Satellite radius={3.05} speed={0.22} tilt={0.35} />
      <Satellite radius={3.45} speed={-0.14} tilt={-0.5} />
      <FloatingTravelObjects />
      <MeteorField />
      <Aurora />
      <CameraRig />
    </>
  );
}

export default function CinematicGlobeCanvas({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      className="cinematic-globe-canvas"
      camera={{ position: [0, 0, 7.2], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}><Scene /></Suspense>
    </Canvas>
  );
}
