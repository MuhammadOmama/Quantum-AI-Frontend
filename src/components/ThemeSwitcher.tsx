import type { CSSProperties } from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className={`theme-switcher${compact ? ' is-compact' : ''}`} role="group" aria-label="Appearance">
      {!compact ? <span className="theme-switcher-label">Theme</span> : null}
      <div className="theme-swatch-row">
        {themes.map((item) => {
          const active = theme === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`theme-swatch${active ? ' is-active' : ''}`}
              aria-pressed={active}
              aria-label={`${item.label} theme`}
              title={`${item.label} — ${item.description}`}
              onClick={() => setTheme(item.id)}
              style={
                {
                  '--swatch-a': item.swatch[0],
                  '--swatch-b': item.swatch[1],
                  '--swatch-c': item.swatch[2],
                } as CSSProperties
              }
            >
              <span className="theme-swatch-orb" aria-hidden="true" />
              {!compact ? <span className="theme-swatch-name">{item.label}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
