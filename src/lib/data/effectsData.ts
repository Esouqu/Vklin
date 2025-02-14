import type { IEffect } from "$lib/interfaces";

const EFFECTS: IEffect[] = [
  {
    id: 'knockout',
    name: 'Оглушение',
    description: 'Игрок пропускает бросок кубика и не может использовать предмет',
    isNegative: true,
  },
  {
    id: 'armor',
    name: 'Броня',
    description: 'Защищает от одной кражи ключей или атаки',
    isNegative: false,
  },
  {
    id: 'invulnerability',
    name: 'Полная защита',
    description: 'Защищает от кражи ключей или атак',
    isNegative: false,
  }
];

export default EFFECTS;
