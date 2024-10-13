export interface IRarity {
  name: string;
  color: string;
  value: number;
}

const RARITIES: IRarity[] = [
  { name: 'Зеленая', color: '#45CB85', value: 0 },
  { name: 'Синяя', color: '#35A7FF', value: 1 },
  { name: 'Фиолетовая', color: '#CA3CFF', value: 2 }, // alt. color #FF0F80
  { name: 'Золотая', color: '#F6AE2D', value: 3 }
]

export default RARITIES;