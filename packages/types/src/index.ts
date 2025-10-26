// Character types
export interface Character {
  id: string;
  name: string;
  playerName: string;
  level: number;
  experience: number;
  health: {
    current: number;
    max: number;
  };
  attributes: {
    [key: string]: number;
  };
  skills: {
    [key: string]: number;
  };
}

// Combat types
export interface CombatStats {
  id: string;
  characterId: string;
  initiative: number;
  armorClass: number;
  conditions: string[];
}

// Game types
export interface Player {
  id: string;
  name: string;
  characters: Character[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Shared UI types
export interface Theme {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

export type AlertType = 'info' | 'success' | 'warning' | 'error';
