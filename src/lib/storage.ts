import { useEffect, useState } from 'react';

export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode etc.) — app still works in-memory
  }
}

export function usePersistentState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(() => loadState(key, fallback));

  useEffect(() => {
    saveState(key, state);
  }, [key, state]);

  return [state, setState] as const;
}

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function resetStoredData(): void {
  const keys = ['cc.profile', 'cc.classes', 'cc.registrations', 'cc.lostfound'];
  keys.forEach((k) => localStorage.removeItem(k));
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDayShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function nowTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
