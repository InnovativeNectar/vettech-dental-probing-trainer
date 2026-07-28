'use client';

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-3, 5, -3]} intensity={0.3} />
      <hemisphereLight
        color="#b1e1ff"
        groundColor="#d4a574"
        intensity={0.3}
      />
    </>
  );
}
