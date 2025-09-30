export interface Character {
  id: string;
  // Información básica
  playerName: string;
  characterName: string;
  archetype: string;
  faction: string;
  race: string;
  level: number;
  category:
    | 'Común'
    | 'Protagonista I'
    | 'Protagonista II'
    | 'Protagonista III'
    | 'Campeón I'
    | 'Campeón II'
    | 'Campeón III'
    | 'Titán I'
    | 'Titán II'
    | 'Titán III'
    | 'Cataclismo';

  // Atributos
  attributes: {
    fuerza: number;
    dinamismo: number;
    voluntad: number;
    suerte: number;
    inteligencia: number;
  };

  // Dominios + esencias
  domains: {
    fisico: number;
    batalla: number;
    social: number;
    ambiental: number;
    ocultacion: number;
    conocimiento: number;
    tecnico: number;
    recursos: number;
    demoniaco: number;
    aura: number;
  };

  // Parámetros de combate
  combat: {
    saludFisica: number;
    maxSaludFisica: number;
    resistenciaFisica: number;
    maxResistenciaFisica: number;
    saludMental: number;
    maxSaludMental: number;
    resistenciaMental: number;
    maxResistenciaMental: number;
    iniciativa: number;
    defensa: number;
    ataque: number;
    impacto: number;
    danoMaximo: number;
  };

  // Información narrativa
  narrative: {
    descripcionFisica: string;
    perfilExterno: string;
    perfilInterno: string;
    trasfondo: string;
    especialidades: string;
  };

  // Puntos de Épica
  puntosEpica: number;
  esencias: string[];

  // Inventario
  inventory: InventoryItem[];

  // Efectos y dones
  effects: Effect[];
  donesAura: string[];

  // Para compatibilidad con el código existente
  type: 'PC' | 'NPC' | 'Enemy';
  health: number;
  maxHealth: number;
  resistance: number;
  maxResistance: number;
  initiative: number;
  attack: number;
  defense: number;
  visible: boolean;
  isNPC: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'item' | 'consumable';
}

export interface Effect {
  id: string;
  name: string;
  duration: number;
  type: 'buff' | 'debuff' | 'neutral';
  description: string;
}

export interface DiceResult {
  total: number;
  rolls: number[];
  grouped: { [key: number]: number };
  sides: number;
  count: number;
  isCritical: boolean;
  isFumble: boolean;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
  visible: boolean;
}

export interface CombatParticipant {
  character: Character;
  initiative: number;
  initiativeRoll: number;
  isActive: boolean;
  hasActed: boolean;
}

export interface CombatAction {
  type: 'attack' | 'defend' | 'other';
  attacker?: string;
  target?: string;
  attackRoll?: number;
  defenseValue?: number;
  impactRoll?: number;
  damageRoll?: number[];
  finalDamage?: number;
  description: string;
}

export interface CombatState {
  participants: CombatParticipant[];
  currentTurnIndex: number;
  round: number;
  phase: 'setup' | 'initiative' | 'combat' | 'ended';
  actions: CombatAction[];
}
