import { BsFillCloudRainFill, BsFillCloudRainHeavyFill } from 'react-icons/bs/index';
import { MdOutlineThunderstorm } from 'react-icons/md/index';

import type { Category } from '../types';

import { getAssetPath } from '@/helpers/path';

export const rain: Category = {
  icon: <BsFillCloudRainFill />,
  id: 'rain',
  sounds: [
    {
      icon: <BsFillCloudRainFill />,
      id: 'light-rain',
      label: 'Pioggia leggera',
      src: getAssetPath('/sounds/rain/light-rain.mp3'),
    },
    {
      icon: <BsFillCloudRainHeavyFill />,
      id: 'heavy-rain',
      label: 'Pioggia intensa',
      src: getAssetPath('/sounds/rain/heavy-rain.mp3'),
    },
    {
      icon: <MdOutlineThunderstorm />,
      id: 'thunder',
      label: 'Tuoni',
      src: getAssetPath('/sounds/rain/thunder.mp3'),
    },
  ],
  title: 'Pioggia',
};
