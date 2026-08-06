import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ThemeSwitcher } from './ThemeSwitcher';

type ThemeMenuProps = {
  /** Visual tone for the trigger on dark/light chrome */
  tone?: 'header' | 'login';
};

export function ThemeMenu({ tone = 'header' }: ThemeMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!dialogOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialogOpen(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [dialogOpen]);

  const dialog =
    dialogOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="theme-dialog-backdrop"
            role="presentation"
            onClick={() => setDialogOpen(false)}
          >
            <div
              className="theme-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => event.stopPropagation()}
            >
              <header className="theme-dialog-header">
                <div>
                  <h2 id={titleId}>Choose a theme</h2>
                  <p>Pick an appearance for QuantumAI. Your choice is saved on this device.</p>
                </div>
                <button
                  type="button"
                  className="theme-dialog-close"
                  aria-label="Close themes"
                  onClick={() => setDialogOpen(false)}
                >
                  ×
                </button>
              </header>
              <div className="theme-dialog-body">
                <ThemeSwitcher variant="dialog" onSelect={() => setDialogOpen(false)} />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className={`theme-menu theme-menu--${tone}`} ref={rootRef}>
        <button
          type="button"
          className="theme-menu-trigger"
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">⋯</span>
        </button>

        {menuOpen ? (
          <div className="theme-menu-dropdown" role="menu">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setDialogOpen(true);
              }}
            >
              Themes
            </button>
          </div>
        ) : null}
      </div>

      {dialog}
    </>
  );
}
