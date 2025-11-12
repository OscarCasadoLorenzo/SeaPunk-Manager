export interface DiceResult {
  rolls: number[];
  total: number;
  sides: number;
  count: number;
  modifier: number;
  isCritical: boolean;
  isFumble: boolean;
  grouped: Record<string, number>;
}
