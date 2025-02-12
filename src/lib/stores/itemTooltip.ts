import type { IItem } from "$lib/data/itemsData";
import { writable } from "svelte/store";

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface Props {
  item: IItem | null;
  placement?: TooltipPlacement;
  ref?: HTMLElement;
}

const itemTooltip = writable<Props>({ item: null, placement: 'right' });

export default itemTooltip;
