import { GiWaterfall, GiStonePile } from 'react-icons/gi/index';
import { BsFire, BsFillDropletFill } from 'react-icons/bs/index';
import { BiSolidTree, BiWater } from 'react-icons/bi/index';
import {
  FaWater,
  FaWind,
  FaLeaf,
  FaRegSnowflake,
  FaTree,
} from 'react-icons/fa/index';

import type { Category } from '../types';

import { getAssetPath } from '@/helpers/path';

export const nature: Category = {
  icon: <BiSolidTree />,
  id: 'nature',
  sounds: [
    {
      icon: <BiWater />,
      id: 'river',
      label: 'Fiume',
      src: getAssetPath('/sounds/nature/river.mp3'),
    },
    {
      icon: <FaWater />,
      id: 'waves',
      label: 'Onde',
      src: getAssetPath('/sounds/nature/waves.mp3'),
    },
    {
      icon: <BsFire />,
      id: 'campfire',
      label: 'Crepitio del fuoco',
      src: getAssetPath('/sounds/nature/campfire.mp3'),
    },
    {
      icon: <GiWaterfall />,
      id: 'waterfall',
      label: 'Cascata',
      src: getAssetPath('/sounds/nature/waterfall.mp3'),
    },
    {
      icon: <BsFillDropletFill />,
      id: 'droplets',
      label: 'Gocce',
      src: getAssetPath('/sounds/nature/droplets.mp3'),
    },
  ],
  title: 'Natura',
};
