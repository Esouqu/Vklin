import type { IEffect } from "$lib/interfaces";

const EFFECTS: IEffect[] = [
  {
    id: 'knockout',
    name: 'Оглушение',
    description: 'Игрок пропускает бросок кубика',
    isNegative: true,
  },
  {
    id: 'luckyCharm',
    name: 'Амулет удачи',
    description: 'Удваивает количество получеаемых ключей',
    isNegative: false,
  },
  {
    id: 'armor',
    name: 'Броня',
    description: 'Защищает от кражи ключей и атак',
    isNegative: false,
  },
  {
    id: 'invulnerability',
    name: 'Полная защита',
    description: 'Полная защита от всех атак и негативных эффектов',
    isNegative: false,
  }
];

export default EFFECTS;
