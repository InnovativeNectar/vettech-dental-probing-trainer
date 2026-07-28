'use client';

interface TrainingControlsProps {
  moduleId: string;
  showProbe: boolean;
  onToggleProbe: () => void;
  probeActive: boolean;
  onToggleProbeActive: () => void;
  onProbeReading: () => void;
  readingsCount: number;
  onResetSession?: () => void;
}

export function TrainingControls({
  moduleId,
  showProbe,
  onToggleProbe,
  probeActive,
  onToggleProbeActive,
  onProbeReading,
  readingsCount,
  onResetSession,
}: TrainingControlsProps) {
  return (
    <div className="flex w-72 flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Training Controls</h2>
        <p className="text-sm text-gray-500">Module: {moduleId}</p>
      </div>

      <div className="flex-1 space-y-4 p-4">
        {/* Probe Controls */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">Probe</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showProbe}
                onChange={onToggleProbe}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Show probe</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={probeActive}
                onChange={onToggleProbeActive}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Probe active</span>
            </label>
          </div>
        </div>

        {/* Take Reading */}
        <button
          onClick={onProbeReading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Take Reading ({readingsCount})
        </button>

        {/* Keyboard Shortcuts */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">Keyboard Shortcuts</h3>
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Move probe</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">WASD</kbd>
            </div>
            <div className="flex justify-between">
              <span>Insert/withdraw</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">Q / E</kbd>
            </div>
            <div className="flex justify-between">
              <span>Take reading</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">Space</kbd>
            </div>
            <div className="flex justify-between">
              <span>Rotate probe</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">R / F</kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onResetSession}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Session
        </button>
      </div>
    </div>
  );
}
