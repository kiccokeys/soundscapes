import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './meditation-player.module.css';

type MeditationTrack = {
  id: string;
  title: string;
  file: string;
  durationLabel?: string;
};

const MEDITATIONS: MeditationTrack[] = [
  {
    id: 'meditazione',
    title: 'Meditazione guidata 1',
    file: '/sounds/meditazione.mp3',
    durationLabel: '15 min',
  },
  {
    id: 'meditazione2',
    title: 'Meditazione guidata 2',
    file: '/sounds/meditazione2.mp3',
    durationLabel: '20 min',
  },
];

export function MeditationPlayer() {
  const [currentId, setCurrentId] = useState<string>(MEDITATIONS[0]?.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = useMemo(
    () => MEDITATIONS.find(m => m.id === currentId) ?? MEDITATIONS[0],
    [currentId],
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.load();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack?.file]);

  const ensureAudio = () => {
    if (!audioRef.current) return null;
    return audioRef.current;
  };

  const handlePlayPause = () => {
    const audio = ensureAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleRestart = () => {
    const audio = ensureAudio();
    if (!audio) return;

    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const handleSelectTrack = (id: string) => {
    if (id === currentId) return;
    setCurrentId(id);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const v = Math.min(1, Math.max(0, value));
    setVolume(v);
  };

  const progress =
    duration && Number.isFinite(duration) && duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0;

  return (
    <section className={styles.meditationPlayer} aria-label="Meditazioni guidate">
      <audio
        key={currentTrack?.id}
        ref={audioRef}
        preload="metadata"
        src={currentTrack?.file}
        onLoadedMetadata={event => {
          const d = event.currentTarget.duration;
          if (Number.isFinite(d)) setDuration(d);
        }}
        onTimeUpdate={event => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      <div className={styles.header}>
        <div>
          <div className={styles.title}>Meditazioni guidate</div>
          <div className={styles.subtitle}>
            Scegli una meditazione da ascoltare con il tuo soundscape.
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {MEDITATIONS.map(meditation => {
          const active = meditation.id === currentId;

          return (
            <button
              key={meditation.id}
              type="button"
              className={`${styles.trackCard} ${
                active ? styles.trackCardActive : ''
              }`}
              onClick={() => handleSelectTrack(meditation.id)}
            >
              <div className={styles.trackMain}>
                <div>
                  <div className={styles.trackTitle}>{meditation.title}</div>
                  {meditation.durationLabel && (
                    <div className={styles.trackMeta}>
                      {meditation.durationLabel}
                    </div>
                  )}
                </div>

                {!active && (
                  <div className={styles.trackHint}>Clicca per riprodurre</div>
                )}
              </div>

              {active && (
                <>
                  <div className={styles.controlsRow}>
                    <div className={styles.buttons}>
                      <button
                        type="button"
                        className={styles.controlButton}
                        onClick={handlePlayPause}
                        disabled={!currentTrack}
                      >
                        {isPlaying ? 'Pausa' : 'Riproduci'}
                      </button>
                      <button
                        type="button"
                        className={styles.controlButton}
                        onClick={handleRestart}
                        disabled={!currentTrack}
                      >
                        Riavvia
                      </button>
                    </div>

                    <div className={styles.volumeGroup}>
                      <span className={styles.volumeLabel}>Volume</span>
                      <input
                        className={styles.volumeSlider}
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        onClick={event => event.stopPropagation()}
                      />
                    </div>
                  </div>

                  <div className={styles.progressRow}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className={styles.progressTime}>
                      {Math.floor(currentTime / 60)
                        .toString()
                        .padStart(2, '0')}
                      :
                      {Math.floor(currentTime % 60)
                        .toString()
                        .padStart(2, '0')}
                      {' / '}
                      {duration
                        ? `${Math.floor(duration / 60)
                            .toString()
                            .padStart(2, '0')}:${Math.floor(duration % 60)
                            .toString()
                            .padStart(2, '0')}`
                        : '--:--'}
                    </div>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
