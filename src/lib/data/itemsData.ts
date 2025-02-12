import megaphoneImage from '$lib/assets/svgs/megaphone.svg';
import awpImage from '$lib/assets/svgs/lee-enfield.svg';
import taserImage from '$lib/assets/svgs/lightning-arc.svg';
import goodBombImage from '$lib/assets/svgs/holy-hand-grenade.svg';
import handgunImage from '$lib/assets/svgs/pistol-gun.svg';
import grenadeImage from '$lib/assets/svgs/grenade.svg';
import magnetImage from '$lib/assets/svgs/magnet.svg';
import armorImage from '$lib/assets/svgs/abdominal-armor.svg';
import luckyCharmImage from '$lib/assets/svgs/pendant-key.svg';
import potionImage from '$lib/assets/svgs/health-potion.svg';
import magicScrollImage from '$lib/assets/svgs/scroll-unfurled.svg';
import blackholeImage from '$lib/assets/svgs/black-hole-bolas.svg';
import shotgunImage from '$lib/assets/svgs/sawed-off-shotgun.svg';
import portalImage from '$lib/assets/svgs/magic-portal.svg';
import nuclearBombImage from '$lib/assets/svgs/nuclear-bomb.svg';
import iceStormImage from '$lib/assets/svgs/snowflake-2.svg';
import trapImage from '$lib/assets/svgs/wolf-trap.svg';

export type ItemTargetType = 'player' | 'location';
export type ItemBehaviorType = 'self' | 'others' | 'all' | 'single' | 'multiple';

export interface IItem {
  id: string;
  effectId?: string;
  name: string;
  image: string;
  effect: string;
  rarity: number;
  behavior: ItemBehaviorType;
  targetType: ItemTargetType;
  canTargetSelf?: boolean;
  range: number;
  targets?: number;
}

const ITEMS: IItem[] = [
  {
    id: 'armor',
    name: 'Броня',
    image: armorImage,
    effect: 'Защищает от кражи ключей и атак на 1 ход',
    behavior: 'self',
    targetType: 'player',
    rarity: 0,
    range: -1,
    effectId: 'armor',
  },
  {
    id: 'luckyCharm',
    name: 'Амулет Удачи',
    image: luckyCharmImage,
    effect: 'Удваивает количество полученных ключей за следующий ход',
    behavior: 'self',
    targetType: 'player',
    rarity: 3,
    range: -1,
    effectId: 'luckyCharm',
  },
  {
    id: 'invulnerability',
    name: 'Неуязвимость',
    image: potionImage,
    effect: 'Полная защита от всех атак и негативных эффектов на 2 хода',
    behavior: 'self',
    targetType: 'player',
    rarity: 3,
    range: -1,
    effectId: 'invulnerability',
  },
  {
    id: 'magicScroll',
    name: 'Откат',
    image: magicScrollImage,
    effect: 'Возвращает количество ключей, которое у игрока было на предыдущем ходу, но не возвращает ключи потраченные на открытие сундука',
    rarity: 2,
    behavior: 'self',
    targetType: 'player',
    range: -1,
  },
  {
    id: 'megaphone',
    name: 'Мегафон',
    image: megaphoneImage,
    effect: 'Заставляет всех игроков отдать по 2 ключа владельцу',
    rarity: 2,
    range: -1,
    behavior: 'others',
    targetType: 'player',
  },
  {
    id: 'awp',
    name: 'АВП',
    image: awpImage,
    effect: 'Крадет 5 ключей на любом расстоянии',
    rarity: 3,
    behavior: 'single',
    targets: 1,
    targetType: 'player',
    range: -1,
  },
  {
    id: 'shotgun',
    name: 'Дробовик',
    image: shotgunImage,
    effect: 'Крадет 7 ключей на расстоянии до 3 клеток',
    rarity: 0,
    behavior: 'single',
    targetType: 'player',
    targets: 1,
    range: 10,
  },
  {
    id: 'handgun',
    name: 'Пистолет',
    image: handgunImage,
    effect: 'Крадет 5 ключей на расстоянии до 5 клеток',
    rarity: 0,
    behavior: 'single',
    targetType: 'player',
    targets: 1,
    range: 15,
  },
  {
    id: 'taser',
    name: 'Шокер',
    image: taserImage,
    effect: 'Отнимает 3 ключа и парализует игрока на один ход',
    rarity: 0,
    behavior: 'single',
    targets: 1,
    targetType: 'player',
    range: 5,
  },
  {
    id: 'grenade',
    name: 'Граната',
    image: grenadeImage,
    effect: 'Отнимает 5 ключей у ближайшего игрока на расстоянии до 10 клеток',
    rarity: 1,
    behavior: 'single',
    targetType: 'player',
    targets: 1,
    range: 30,
  },
  {
    id: 'magnet',
    name: 'Магнит',
    image: magnetImage,
    effect: 'Крадет 5 ключей у выбранного игрока',
    rarity: 1,
    behavior: 'single',
    targets: 1,
    targetType: 'player',
    range: -1,
  },
  {
    id: 'sticky',
    name: 'Растяжка',
    image: trapImage,
    effect: 'Отнимает 5 ключей у следующего игрока, наступившего на клетку',
    rarity: 1,
    behavior: 'single',
    targets: 1,
    range: -1,
    targetType: 'location',
  },
  {
    id: 'blackhole',
    name: 'Черная Дыра',
    image: blackholeImage,
    effect: 'Перемещает игрока на стартовую клетку и отнимает 10 ключей',
    rarity: 2,
    behavior: 'single',
    targets: 1,
    range: -1,
    targetType: 'location',
  },
  {
    id: 'portal',
    name: 'Портал Обмена',
    image: portalImage,
    effect: 'Меняет местами двух игроков на карте',
    rarity: 3,
    behavior: 'single',
    targetType: 'player',
    targets: 1,
    range: -1,
  },
  {
    id: 'nuclear_bomb',
    name: 'Ядерка',
    image: nuclearBombImage,
    effect: 'Отнимает 20 ключей у всех игроков',
    rarity: 3,
    range: -1,
    behavior: 'others',
    targetType: 'player',
  },
  {
    id: 'ice_storm',
    name: 'Ледяная Буря',
    image: iceStormImage,
    effect: 'Замораживает всех игроков на один ход и отнимает по 5 ключей',
    rarity: 3,
    range: -1,
    behavior: 'others',
    targetType: 'player',
  },
  {
    id: 'good_bomb',
    name: 'ДоброБомба',
    image: goodBombImage,
    effect: 'Дает всем игрокам по 10 ключей',
    rarity: 3,
    range: -1,
    behavior: 'all',
    targetType: 'player',
  },
]

export default ITEMS;