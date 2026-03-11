import { PlayButton } from './play';
import { UnselectButton } from './unselect';

import { useSoundStore } from '@/stores/sound';

import styles from './buttons.module.css';

export function Buttons() {
  const noSelected = useSoundStore(state => state.noSelected());

  if (noSelected) return null;

  return (
    <div className={styles.buttons}>
      <PlayButton />
      <UnselectButton />
    </div>
  );
}
