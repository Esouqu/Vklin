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
    description: 'Защищает от одной потери ключей (кроме потери ключей за дроп)',
    isNegative: false,
  },
  {
    id: 'invulnerability',
    name: 'Неуязвимость',
    description: 'Защищает от потери ключей (кроме потери ключей за дроп) и оглушения на 1 ход',
    isNegative: false,
  }
];

export default EFFECTS;
