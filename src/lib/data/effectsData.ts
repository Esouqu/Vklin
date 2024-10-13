import type { IEffect } from "../interfaces";

const EFFECTS: IEffect[] = [
  {
    id: 'luckyCharm',
    name: 'Амулет удачи',
    description: 'Удваивает количество получеаемых ключей',
  },
  {
    id: 'armor',
    name: 'Броня',
    description: 'Защищает от кражи ключей и атак',
  },
  {
    id: 'invulnerability',
    name: 'Полная защита',
    description: 'Полная защита от всех атак и негативных эффектов',
  }
];

export default EFFECTS;
