'use client';

interface ProbeOverlayProps {
  depth: number;
  isInSulcus: boolean;
  currentTooth: number | null;
  currentLocation: string | null;
  readingsCount: number;
}

export function ProbeOverlay({ depth, isInSulcus, currentTooth, currentLocation, readingsCount }: ProbeOverlayProps) {
  const depthColor = depth <= 2 ? 'text-green-400' : depth <= 4 ? 'text-yellow-400' : 'text-red-400';
  const depthBg = depth <= 2 ? 'bg-green-900/50' : depth <= 4 ? 'bg-yellow-900/50' : 'bg-red-900/50';

  return (
    <div className="absolute left-4 top-4 z-10 space-y-3">
      {/* Depth Readout */}
      <div className={`rounded-lg border border-white/10 px-4 py-3 ${depthBg} backdrop-blur-sm`}>
        <div className="text-xs font-medium text-gray-400">Probe Depth</div>
        <div className={`text-3xl font-bold tabular-nums ${depthColor}`}>
          {depth.toFixed(1)}<span className="ml-1 text-sm font-normal">mm</span>
        </div>
      </div>

      {/* Sulcus Status */}
      <div className={`rounded-lg border px-3 py-2 backdrop-blur-sm ${isInSulcus ? 'border-green-500/30 bg-green-900/50' : 'border-white/10 bg-black/50'}`}>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isInSulcus ? 'bg-green-400' : 'bg-gray-500'}`} />
          <span className="text-xs text-gray-300">
            {isInSulcus ? 'In Sulcus' : 'Outside Sulcus'}
          </span>
        </div>
      </div>

      {/* Current Location */}
      {currentTooth !== null && (
        <div className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-sm">
          <div className="text-xs text-gray-400">Tooth</div>
          <div className="font-medium text-white">#{currentTooth}</div>
          {currentLocation && (
            <div className="text-xs text-gray-400 capitalize">{currentLocation}</div>
          )}
        </div>
      )}

      {/* Readings Count */}
      <div className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-sm">
        <div className="text-xs text-gray-400">Readings</div>
        <div className="font-medium text-white">{readingsCount}</div>
      </div>
    </div>
  );
}
