import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getDepthColor(depthMm: number): string {
  if (depthMm <= 2) return '#22c55e';
  if (depthMm <= 4) return '#eab308';
  if (depthMm <= 6) return '#f97316';
  return '#ef4444';
}

export function getDepthLabel(depthMm: number): string {
  if (depthMm <= 2) return 'Healthy';
  if (depthMm <= 4) return 'Mild';
  if (depthMm <= 6) return 'Moderate';
  return 'Severe';
}

export function calculateScore(weights: Record<string, number>, values: Record<string, number>): number {
  let total = 0;
  let weightSum = 0;
  for (const key of Object.keys(weights)) {
    total += (weights[key] ?? 0) * (values[key] ?? 0);
    weightSum += weights[key] ?? 0;
  }
  return weightSum > 0 ? Math.round(total / weightSum) : 0;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
