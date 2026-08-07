import type { CSSProperties } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeId } from '../themes';

type ThemeSwitcherProps = {
  variant?: 'dialog' | 'inline';
  onSelect?: (id: ThemeId) => void;
};

export function ThemeSwitcher({ variant = 'inline', onSelect }: ThemeSwitcherProps) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div
      className={`theme-switcher theme-switcher--${variant}`}
      role="group"
      aria-label="Appearance themes"
    >
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
              onClick={() => {
                setTheme(item.id);
                onSelect?.(item.id);
              }}
              style={
                {
                  '--swatch-a': item.swatch[0],
                  '--swatch-b': item.swatch[1],
                  '--swatch-c': item.swatch[2],
                } as CSSProperties
              }
            >
              <span className="theme-swatch-orb" aria-hidden="true" />
              <span className="theme-swatch-name">{item.label}</span>
              {variant === 'dialog' ? (
                <span className="theme-swatch-desc">{item.description}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
