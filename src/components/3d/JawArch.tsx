'use client';

import { Tooth, type ToothClass } from './Tooth';

interface JawToothData {
  number: number;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  toothClass: ToothClass;
  width: number;
  height: number;
  isUpper: boolean;
}

interface JawArchProps {
  teeth: JawToothData[];
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
          toothClass={tooth.toothClass}
          position={tooth.position}
          rotation={tooth.rotation || [0, 0, 0]}
          width={tooth.width}
          height={tooth.height}
          isUpper={tooth.isUpper}
          isSelected={selectedTooth === tooth.number}
          isHighlighted={highlightedTooth === tooth.number}
          onClick={onToothClick}
        />
      ))}
    </group>
  );
}
