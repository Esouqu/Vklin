import invulnerability from '$lib/assets/images/invulnerability.jpg';
import luckyCharm from '$lib/assets/images/luckyCharm.jpg';
import armor from '$lib/assets/images/armor.jpg';

export function getEffectIcon(effectId: string) {
  switch (effectId) {
    case 'invulnerability':
      return invulnerability;
    case 'luckyCharm':
      return luckyCharm;
    case 'armor':
      return armor;
    default:
      return '';
  }
}