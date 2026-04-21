/**
 * Le 12 card soundscape (categorie in `src/data/sounds.ts`: natura, pioggia, animali)
 * usano gli SVG `*-lineart.svg` in /public come sfondo card.
 *
 * Natura:     river → river | waves → calmsea | campfire → fire | waterfall | droplets → drop
 * Pioggia:    light-rain → softrain | heavy-rain → heavyrain | thunder
 * Animali:    birds | crickets → cricket | owl | cat-purring → cat
 */
export const SOUND_LINE_ART: Partial<Record<string, string>> = {
  birds: '/birds-lineart.svg',
  campfire: '/fire-lineart.svg',
  'cat-purring': '/cat-lineart.svg',
  crickets: '/cricket-lineart.svg',
  droplets: '/drop-lineart.svg',
  'heavy-rain': '/heavyrain-lineart.svg',
  'light-rain': '/softrain-lineart.svg',
  owl: '/owl-lineart.svg',
  river: '/river-lineart.svg',
  thunder: '/thunder-lineart.svg',
  waterfall: '/waterfall-lineart.svg',
  waves: '/calmsea-lineart.svg',
} as const;

export function getSoundLineArtUrl(id: string): string | undefined {
  return SOUND_LINE_ART[id as keyof typeof SOUND_LINE_ART];
}
