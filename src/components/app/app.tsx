import { useMemo, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { BiSolidHeart } from 'react-icons/bi/index';
import { Howler } from 'howler';

import { useSoundStore } from '@/stores/sound';

import { StoreConsumer } from '@/components/store-consumer';
import { Sounds } from '@/components/sounds';
import { MeditationPlayer } from '@/components/meditation-player';
import { SharedModal } from '@/components/modals/shared';
import { Toolbar } from '@/components/toolbar';
import { SnackbarProvider } from '@/contexts/snackbar';
import { MediaControls } from '@/components/media-controls';

import styles from './app.module.css';

import { sounds } from '@/data/sounds';
import { FADE_OUT } from '@/constants/events';

import type { Sound } from '@/data/types';
import { subscribe } from '@/lib/event';

export function App() {
  const categories = useMemo(() => sounds.categories, []);

  const favorites = useSoundStore(useShallow(state => state.getFavorites()));
  const pause = useSoundStore(state => state.pause);
  const lock = useSoundStore(state => state.lock);
  const unlock = useSoundStore(state => state.unlock);

  const favoriteSounds = useMemo(() => {
    const favoriteSounds = categories
      .map(category => category.sounds)
      .flat()
      .filter(sound => favorites.includes(sound.id));

    /**
     * Reorder based on the order of favorites
     */
    return favorites.map(favorite =>
      favoriteSounds.find(sound => sound.id === favorite),
    );
  }, [favorites, categories]);

  useEffect(() => {
    const onChange = () => {
      const { ctx } = Howler;

      if (ctx && !document.hidden) {
        setTimeout(() => {
          ctx.resume();
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', onChange, false);

    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(FADE_OUT, (e: { duration: number }) => {
      lock();

      setTimeout(() => {
        pause();
        unlock();
      }, e.duration);
    });

    return unsubscribe;
  }, [pause, lock, unlock]);

  const allSounds = useMemo(() => {
    const baseSounds = categories.flatMap(category => category.sounds);

    if (!favoriteSounds.length) return baseSounds;

    const uniqueFavorites = favoriteSounds.filter(
      (sound): sound is Sound =>
        !!sound && !baseSounds.find(base => base.id === sound.id),
    );

    return [...uniqueFavorites, ...baseSounds];
  }, [favoriteSounds, categories]);

  return (
    <SnackbarProvider>
      <StoreConsumer>
        <MediaControls />
        <div id="app" className={styles.appRoot}>
          <div className={styles.mainLayout}>
            <div className={styles.leftPane}>
              <Sounds functional id="all" sounds={allSounds} />
            </div>
            <div className={styles.centerPane}>
              <MeditationPlayer />
            </div>
            <div className={styles.rightSpacer} aria-hidden="true" />
          </div>
        </div>

        <Toolbar />
        <SharedModal />
      </StoreConsumer>
    </SnackbarProvider>
  );
}
