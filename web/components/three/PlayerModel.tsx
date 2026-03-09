"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

interface PlayerModelProps {
  position: [number, number, number];
  color?: string;
}

export function PlayerModel({ position, color = "#1a1a1a" }: PlayerModelProps) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
