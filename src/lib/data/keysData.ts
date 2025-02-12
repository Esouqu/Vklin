interface IKeyRange {
  min: number;
  max: number;
}

const KEYS: IKeyRange[] = [
  { min: 1, max: 5 },
  { min: 6, max: 10 },
  { min: 11, max: 15 },
  { min: 15, max: 25 }
]

export default KEYS;