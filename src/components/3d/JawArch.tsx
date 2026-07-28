'use client';

import { Tooth } from './Tooth';

interface JawArchProps {
  teeth: Array<{ number: number; name: string; position: [number, number, number]; rotation?: [number, number, number] }>;
  selectedTooth: number | null;
  highlightedTooth: number | null;
  onToothClick?: (toothNumber: number) => void;
  jawType?: 'upper' | 'lower';
}

export function JawArch({ teeth, selectedTooth, highlightedTooth, onToothClick, jawType = 'upper' }: JawArchProps) {
  const yOffset = jawType === 'upper' ? 0.5 : -0.5;
  const yRotation = jawType === 'upper' ? 0 : Math.PI;

  return (
    <group position={[0, yOffset, 0]} rotation={[yRotation, 0, 0]}>
      {teeth.map((tooth) => (
        <Tooth
          key={tooth.number}
          toothNumber={tooth.number}
          position={tooth.position}
          rotation={tooth.rotation || [0, 0, 0]}
          isSelected={selectedTooth === tooth.number}
          isHighlighted={highlightedTooth === tooth.number}
          onClick={onToothClick}
        />
      ))}
    </group>
  );
}
