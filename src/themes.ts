export const THEME_STORAGE_KEY = 'qai-theme';

export const THEMES = [
  {
    id: 'aurora',
    label: 'Aurora',
    description: 'Deep teal night',
    swatch: ['#0a1a24', '#14b8a6', '#e8f4f1'],
  },
  {
    id: 'graphite',
    label: 'Graphite',
    description: 'Cool charcoal studio',
    swatch: ['#1a1d21', '#5b8def', '#f2f4f7'],
  },
  {
    id: 'meadow',
    label: 'Meadow',
    description: 'Soft sage daylight',
    swatch: ['#1e3a32', '#3d7a5f', '#f3f7f4'],
  },
  {
    id: 'ember',
    label: 'Ember',
    description: 'Warm coal & coral',
    swatch: ['#1c1412', '#e85d4c', '#faf6f4'],
  },
  {
    id: 'midnight',
    label: 'Midnight',
    description: 'Ink blue focus',
    swatch: ['#060b18', '#38bdf8', '#eef3fb'],
  },
  {
    id: 'pearl',
    label: 'Pearl',
    description: 'Bright airy desk',
    swatch: ['#e8eef5', '#0f766e', '#ffffff'],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function readStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(stored)) return stored;
  } catch {
    // ignore
  }
  return 'aurora';
}

export function writeStoredTheme(id: ThemeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function applyThemeToDocument(id: ThemeId) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', id);
}
