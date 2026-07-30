'use client';

import { useProbeStore } from '@/stores';

interface TouchControlsProps {
  onTakeReading: () => void;
}

export function TouchControls({ onTakeReading }: TouchControlsProps) {
  const setProbePosition = useProbeStore((s) => s.setProbePosition);
  const setProbeDepth = useProbeStore((s) => s.setProbeDepth);
  const setProbeRotation = useProbeStore((s) => s.setProbeRotation);
  const currentProbe = useProbeStore((s) => s.currentProbe);

  const handleAction = (action: string) => {
    switch (action) {
      case 'up':
        setProbePosition([currentProbe.position[0], currentProbe.position[1], currentProbe.position[2] + 0.5]);
        break;
      case 'down':
        setProbePosition([currentProbe.position[0], currentProbe.position[1], currentProbe.position[2] - 0.5]);
        break;
      case 'left':
        setProbePosition([currentProbe.position[0] - 0.5, currentProbe.position[1], currentProbe.position[2]]);
        break;
      case 'right':
        setProbePosition([currentProbe.position[0] + 0.5, currentProbe.position[1], currentProbe.position[2]]);
        break;
      case 'withdraw':
        setProbeDepth(Math.max(0, currentProbe.depth - 0.5));
        break;
      case 'insert':
        setProbeDepth(currentProbe.depth + 0.5);
        break;
      case 'rotateLeft':
        setProbeRotation([currentProbe.rotation[0], currentProbe.rotation[1] + 0.1, currentProbe.rotation[2]]);
        break;
      case 'rotateRight':
        setProbeRotation([currentProbe.rotation[0], currentProbe.rotation[1] - 0.1, currentProbe.rotation[2]]);
        break;
      case 'reading':
        onTakeReading();
        break;
    }
  };

  const buttonClass = (variant: 'primary' | 'secondary' | 'accent') => {
    const base = 'flex h-14 w-14 items-center justify-center rounded-xl text-white text-lg font-bold shadow-lg active:scale-95 transition-transform select-none touch-manipulation';
    if (variant === 'primary') return `${base} bg-blue-600 active:bg-blue-700`;
    if (variant === 'secondary') return `${base} bg-gray-600 active:bg-gray-700`;
    return `${base} bg-green-600 active:bg-green-700`;
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 flex-none md:hidden" aria-label="Touch probe controls">
      <div className="flex items-end justify-between gap-3">
        {/* D-pad */}
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button className={buttonClass('primary')} onTouchStart={() => handleAction('up')} onMouseDown={() => handleAction('up')}>▲</button>
          <div />
          <button className={buttonClass('primary')} onTouchStart={() => handleAction('left')} onMouseDown={() => handleAction('left')}>◀</button>
          <button className={buttonClass('secondary')} onTouchStart={() => handleAction('down')} onMouseDown={() => handleAction('down')}>▼</button>
          <button className={buttonClass('primary')} onTouchStart={() => handleAction('right')} onMouseDown={() => handleAction('right')}>▶</button>
        </div>

        {/* Depth + Rotate column */}
        <div className="flex flex-col gap-2">
          <button className={buttonClass('secondary')} onTouchStart={() => handleAction('withdraw')} onMouseDown={() => handleAction('withdraw')}>↕</button>
          <button className={buttonClass('secondary')} onTouchStart={() => handleAction('insert')} onMouseDown={() => handleAction('insert')}>↕↓</button>
          <button className={buttonClass('secondary')} onTouchStart={() => handleAction('rotateLeft')} onMouseDown={() => handleAction('rotateLeft')}>↺</button>
          <button className={buttonClass('secondary')} onTouchStart={() => handleAction('rotateRight')} onMouseDown={() => handleAction('rotateRight')}>↻</button>
        </div>

        {/* Reading button */}
        <button className={`${buttonClass('accent')} h-16 w-16 text-sm`} onTouchStart={() => handleAction('reading')} onMouseDown={() => handleAction('reading')}>
          📏
        </button>
      </div>
    </div>
  );
}