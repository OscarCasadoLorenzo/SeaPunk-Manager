// Inventory type for inventory table (uses id as PK)
export interface Inventory {
  id: number;
  characterId: number;
  name?: string;
  description?: string;
  quantity?: number;
  type?: string;
}
