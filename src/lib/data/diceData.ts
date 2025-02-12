import { TetrahedronGeometry, BoxGeometry, OctahedronGeometry, DodecahedronGeometry, IcosahedronGeometry, BufferGeometry } from "three";

export interface IDice {
  name: string;
  value: number;
  geometry: BufferGeometry;
}

const DICES = [
  {
    name: 'd4',
    value: 4,
    geometry: new TetrahedronGeometry(),
  },
  {
    name: 'd6',
    value: 6,
    geometry: new BoxGeometry(),
  },
  {
    name: 'd8',
    value: 8,
    geometry: new OctahedronGeometry(),
  },
  {
    name: 'd12',
    value: 12,
    geometry: new DodecahedronGeometry(),
  },
  {
    name: 'd20',
    value: 20,
    geometry: new IcosahedronGeometry(),
  },
];

export default DICES;