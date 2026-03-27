import {
  GiCricket,
  GiSeagull,
  GiWolfHead,
  GiOwl,
  GiWhaleTail,
  GiTreeBeehive,
  GiEgyptianBird,
  GiChicken,
  GiCow,
  GiSheep,
} from 'react-icons/gi/index';
import {
  FaDog,
  FaFrog,
  FaHorseHead,
  FaCat,
  FaCrow,
} from 'react-icons/fa/index';
import { PiBirdFill, PiDogBold } from 'react-icons/pi/index';

import type { Category } from '../types';

import { getAssetPath } from '@/helpers/path';

export const animals: Category = {
  icon: <FaDog />,
  id: 'animals',
  sounds: [
    {
      icon: <PiBirdFill />,
      id: 'birds',
      label: 'Uccelli diurni',
      src: getAssetPath('/sounds/animals/birds.mp3'),
    },
    {
      icon: <GiCricket />,
      id: 'crickets',
      label: 'Grilli',
      src: getAssetPath('/sounds/animals/crickets.mp3'),
    },
    {
      icon: <GiOwl />,
      id: 'owl',
      label: 'Uccelli notturni',
      src: getAssetPath('/sounds/animals/owl.mp3'),
    },
    {
      icon: <FaCat />,
      id: 'cat-purring',
      label: 'Gatto che fa le fusa',
      src: getAssetPath('/sounds/animals/cat-purring.mp3'),
    },
  ],
  title: 'Animali',
};
