import { useMemo, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Howler } from 'howler';

import { useSoundStore } from '@/stores/sound';

import { useMediaQuery } from '@/hooks/use-media-query';
import { StoreConsumer } from '@/components/store-consumer';
import { SoundscapeDrawer } from '@/components/soundscape-drawer';
import { Sounds } from '@/components/sounds';
import { MeditationPlayer } from '@/components/meditation-player';
import { SharedModal } from '@/components/modals/shared';
import { Toolbar } from '@/components/toolbar';
import { SnackbarProvider } from '@/contexts/snackbar';
import { MediaControls } from '@/components/media-controls';

import styles from './app.module.css';

import { cn } from '@/helpers/styles';
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

  const isMdDown = useMediaQuery('(max-width: 768px)');
  const [soundDrawerOpen, setSoundDrawerOpen] = useState(false);

  return (
    <SnackbarProvider>
      <StoreConsumer>
        <MediaControls />
        <div id="app" className={styles.appRoot}>
          <div className={styles.mainLayout}>
            <div
              className={cn(
                styles.centerPane,
                isMdDown &&
                  soundDrawerOpen &&
                  styles.centerPaneMeditationDimmed,
              )}
            >
              <div className={styles.meditationHeader}>
                <img
                  alt="Feel Better Lab"
                  className={styles.meditationLogo}
                  src="/feel_better_lab_logo.svg"
                  width="282"
                  height="56"
                />
              </div>
              <MeditationPlayer />
            </div>
            {!isMdDown ? (
              <div className={styles.soundscapeColumnSpacer}>
                <div className={styles.leftPane}>
                  <Sounds functional id="all" sounds={allSounds} />
                </div>
              </div>
            ) : null}
          </div>
          {isMdDown ? (
            <SoundscapeDrawer
              onClose={() => setSoundDrawerOpen(false)}
              onOpen={() => setSoundDrawerOpen(true)}
              open={soundDrawerOpen}
            >
              <Sounds functional id="all" layout="drawer" sounds={allSounds} />
            </SoundscapeDrawer>
          ) : null}
        </div>

        <Toolbar />
        <SharedModal />
      </StoreConsumer>
    </SnackbarProvider>
  );
}
