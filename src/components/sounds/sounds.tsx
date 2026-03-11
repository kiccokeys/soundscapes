import { useRef } from 'react';

import { Sound } from './sound';
import styles from './sounds.module.css';

import type { Sounds } from '@/data/types';

interface SoundsProps {
  functional: boolean;
  id: string;
  sounds: Sounds;
}

export function Sounds({ functional, id, sounds }: SoundsProps) {
  const firstNewSound = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className={styles.sounds}>
        {sounds.map((sound, index) => (
          <Sound
            key={sound.label}
            {...sound}
            functional={functional}
            hidden={false}
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
