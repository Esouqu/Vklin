import armorImage from '$lib/assets/svgs/abdominal-armor.svg';
import luckyCharmImage from '$lib/assets/svgs/pendant-key.svg';
import potionImage from '$lib/assets/svgs/health-potion.svg';
import knockout from '$lib/assets/images/knockout.png';

export function getEffectIcon(effectId: string) {
  switch (effectId) {
    case 'knockout':
      return knockout;
    case 'invulnerability':
      return potionImage;
    case 'luckyCharm':
      return luckyCharmImage;
    case 'armor':
      return armorImage;
    default:
      return '';
  }
}