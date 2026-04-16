import { useRef } from 'react';

import { Sound } from './sound';
import { cn } from '@/helpers/styles';

import styles from './sounds.module.css';

import type { Sounds } from '@/data/types';

interface SoundsProps {
  functional: boolean;
  id: string;
  sounds: Sounds;
  /** Pannello mobile nel drawer: griglia compatta senza min-height viewport */
  layout?: 'default' | 'drawer';
}

export function Sounds({ functional, id, layout = 'default', sounds }: SoundsProps) {
  const firstNewSound = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(styles.wrap, layout === 'drawer' && styles.wrapDrawer)}
    >
      <div className={styles.sounds}>
        {sounds.map((sound, index) => (
          <Sound
            key={sound.label}
            {...sound}
            functional={functional}
            hidden={false}
            inDrawer={layout === 'drawer'}
            ref={index === 6 ? firstNewSound : undefined}
            selectHidden={() => {}}
            unselectHidden={() => {}}
          />
        ))}

        {sounds.length < 2 &&
          new Array(2 - sounds.length)
            .fill(null)
            .map((_, index) => <div key={index} />)}
      </div>

    </div>
  );
}
