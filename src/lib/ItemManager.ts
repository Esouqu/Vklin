import type { IItem } from "./data/itemsData";
import ITEMS from "./data/itemsData";

class ItemManager {
  private items: Map<string, IItem> = new Map();

  public addItems(items: IItem[]): void {
    for (const item of items) {
      this.items.set(item.id, item);
    }
  }

  public getItem(itemId: string): IItem | undefined {
    return this.items.get(itemId);
  }
}

const itemManager = new ItemManager();

itemManager.addItems(ITEMS);

export default itemManager;
