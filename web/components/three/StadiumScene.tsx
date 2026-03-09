"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Field } from "./Field";

export function StadiumScene() {
  return (
    <Canvas camera={{ position: [0, 12, 20], fov: 50 }} className="bg-muted">
      <ambient light intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <Field />
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
}
