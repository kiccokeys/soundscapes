import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import { IoClose } from 'react-icons/io5/index';

import { cn } from '@/helpers/styles';

import styles from './soundscape-drawer.module.css';

const DRAWER_VAR = '--soundscape-drawer-pad';

type SoundscapeDrawerProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
};

export function SoundscapeDrawer({
  open,
  onOpen,
  onClose,
  children,
}: SoundscapeDrawerProps) {
  const shellRef = useRef<HTMLDivElement>(null);

  const syncPadding = useCallback(() => {
    const el = shellRef.current;
    if (!el) return;
    const h = el.offsetHeight;
    document.documentElement.style.setProperty(DRAWER_VAR, `${h}px`);
  }, []);

  useLayoutEffect(() => {
    syncPadding();
  }, [open, syncPadding]);

  useEffect(() => {
    const el = shellRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => syncPadding());
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, syncPadding]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty(DRAWER_VAR);
    };
  }, []);

  return (
    <div ref={shellRef} className={styles.root}>
      <div className={cn(styles.sheet, open && styles.sheetOpen)}>
        {open ? (
          <div className={styles.peekRow}>
            <span className={styles.peekTitle}>Ambientazioni sonore</span>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Chiudi ambientazioni sonore"
              onClick={onClose}
            >
              <IoClose aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.peekRow}
            aria-expanded={false}
            aria-controls="soundscape-drawer-panel"
            onClick={onOpen}
          >
            <span className={styles.peekTitle}>Ambientazioni sonore</span>
          </button>
        )}

        <div
          id="soundscape-drawer-panel"
          className={`${styles.body} ${open ? styles.bodyOpen : ''}`}
          aria-hidden={!open}
        >
          <div className={styles.bodyInner}>{children}</div>
        </div>
      </div>
    </div>
  );
}
