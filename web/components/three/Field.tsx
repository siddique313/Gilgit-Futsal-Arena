"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

export function Field() {
  const meshRef = useRef<Mesh>(null);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.x = -Math.PI / 2;
  });

  return (
    <group>
      <mesh ref={meshRef} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[20, 40]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </group>
  );
}
