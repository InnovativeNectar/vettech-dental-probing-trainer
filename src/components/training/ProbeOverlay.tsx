'use client';

import { useProbeStore } from '@/stores';
import { SITE_LABELS, SITE_FULL_NAMES } from '@/types';
import type { ProbingSite } from '@/types';

const DEPTH_THRESHOLDS = {
  healthy: 2,
  gingivitis: 4,
  periodontal: 12,
} as const;

function getDepthColor(depth: number): string {
  if (depth <= DEPTH_THRESHOLDS.healthy) return 'text-green-400';
  if (depth <= DEPTH_THRESHOLDS.gingivitis) return 'text-yellow-400';
  return 'text-red-400';
}

function getDepthBg(depth: number): string {
  if (depth <= DEPTH_THRESHOLDS.healthy) return 'bg-green-900/50';
  if (depth <= DEPTH_THRESHOLDS.gingivitis) return 'bg-yellow-900/50';
  return 'bg-red-900/50';
}

function getDepthLabel(depth: number): string {
  if (depth <= DEPTH_THRESHOLDS.healthy) return 'Healthy';
  if (depth <= DEPTH_THRESHOLDS.gingivitis) return 'Gingivitis';
  return 'Periodontal Pocket';
}

function DepthGauge({ depth }: { depth: number }) {
  const pct = Math.min(100, (depth / DEPTH_THRESHOLDS.periodontal) * 100);
  const color =
    depth <= DEPTH_THRESHOLDS.healthy
      ? 'bg-green-500'
      : depth <= DEPTH_THRESHOLDS.gingivitis
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full transition-all duration-150 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ForceIndicator({ force }: { force: number }) {
  const maxForce = 25;
  const pct = Math.min(100, (force / maxForce) * 100);
  const color =
    force < 5 ? 'bg-green-500' : force < 12 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-gray-400">
        <span>Resistance</span>
        <span>{force.toFixed(1)}N</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-150 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function AngleIndicator({
  angleDeg,
  isValid,
  deviation,
}: {
  angleDeg: number;
  isValid: boolean;
  deviation: number;
}) {
  const color = isValid ? 'text-green-400' : 'text-red-400';
  const bg = isValid ? 'bg-green-900/50' : 'bg-red-900/50';

  return (
    <div className={`rounded-lg border px-3 py-2 backdrop-blur-sm ${isValid ? 'border-green-500/30' : 'border-red-500/30'} ${bg}`}>
      <div className="text-xs text-gray-400">Approach Angle</div>
      <div className={`text-lg font-bold tabular-nums ${color}`}>
        {angleDeg.toFixed(1)}°
      </div>
      <div className="text-xs text-gray-400">
        {isValid ? 'Valid approach' : 'Adjust angle'}
        {deviation > 0 && (
          <span className="ml-1 opacity-70">({deviation.toFixed(2)}x)</span>
        )}
      </div>
    </div>
  );
}

function SiteIndicator({ site }: { site: ProbingSite | null }) {
  if (!site) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-sm">
        <div className="text-xs text-gray-400">Probing Site</div>
        <div className="text-sm text-gray-500">—</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-900/50 px-3 py-2 backdrop-blur-sm">
      <div className="text-xs text-gray-400">Probing Site</div>
      <div className="text-lg font-bold text-blue-300">{SITE_LABELS[site]}</div>
      <div className="text-xs text-gray-400">{SITE_FULL_NAMES[site]}</div>
    </div>
  );
}

function SiteGrid({ currentSite }: { currentSite: ProbingSite | null }) {
  const allSites: ProbingSite[] = [
    'mesiobuccal', 'midbuccal', 'distobuccal',
    'mesiolingual', 'midlingual', 'distolingual',
  ];

  return (
    <div className="rounded-lg border border-white/10 bg-black/50 p-2 backdrop-blur-sm">
      <div className="mb-1.5 text-xs text-gray-400">6-Point Probe</div>
      <div className="grid grid-cols-3 gap-1">
        {allSites.map((site) => {
          const isActive = site === currentSite;
          return (
            <div
              key={site}
              className={`rounded px-1.5 py-1 text-center text-[10px] font-medium transition-colors ${
                isActive
                  ? 'bg-blue-500/40 text-blue-200'
                  : 'bg-white/5 text-gray-500'
              }`}
            >
              {SITE_LABELS[site]}
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-center gap-2 text-[9px] text-gray-600">
        <span>Buccal</span>
        <span>Lingual</span>
      </div>
    </div>
  );
}

export function ProbeOverlay() {
  const currentProbe = useProbeStore((s) => s.currentProbe);
  const currentSite = useProbeStore((s) => s.currentSite);
  const angleValidation = useProbeStore((s) => s.angleValidation);
  const resistanceForce = useProbeStore((s) => s.resistanceForce);
  const readings = useProbeStore((s) => s.readings);

  const { depth, isInSulcus, currentTooth, currentLocation } = currentProbe;
  const depthColor = getDepthColor(depth);
  const depthBg = getDepthBg(depth);

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-10 w-52 space-y-2">
      {/* Depth Readout */}
      <div className={`rounded-lg border border-white/10 px-4 py-3 ${depthBg} backdrop-blur-sm`}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-gray-400">Probe Depth</span>
          <span className="text-[10px] text-gray-500">{getDepthLabel(depth)}</span>
        </div>
        <div className={`text-3xl font-bold tabular-nums ${depthColor}`}>
          {depth.toFixed(1)}<span className="ml-1 text-sm font-normal">mm</span>
        </div>
        <DepthGauge depth={depth} />
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
            <div className="text-xs text-gray-400">
              {SITE_LABELS[currentLocation as ProbingSite]}
              {' — '}
              {SITE_FULL_NAMES[currentLocation as ProbingSite]}
            </div>
          )}
        </div>
      )}

      {/* Probing Site */}
      <SiteIndicator site={currentSite} />

      {/* 6-Point Site Grid */}
      <SiteGrid currentSite={currentSite} />

      {/* Angle Validation */}
      {angleValidation && (
        <AngleIndicator
          angleDeg={angleValidation.approachAngle}
          isValid={angleValidation.isValid}
          deviation={angleValidation.deviation}
        />
      )}

      {/* Force Indicator */}
      <ForceIndicator force={resistanceForce} />

      {/* Readings Count */}
      <div className="rounded-lg border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-sm">
        <div className="text-xs text-gray-400">Readings</div>
        <div className="font-medium text-white">{readings.length}</div>
      </div>
    </div>
  );
}
