// Tipos específicos para el sistema de combate
import { Character } from './index';

// Tipos de duración de efectos
export enum DurationType {
  TURNO = 'TURNO', // Solo el turno actual del personaje
  ASALTO = 'ASALTO', // Hasta el final de la ronda completa
  ESCENA = 'ESCENA', // Hasta el final de la escena
  COMBATE = 'COMBATE', // Hasta el final del combate
  DIAS = 'DIAS', // Efectos de varios días
  AVENTURA = 'AVENTURA', // Toda la aventura
  ARCO = 'ARCO', // Todo el arco narrativo
}

// Tipos de acciones de combate
export enum CombatActionType {
  ATACAR = 'ATACAR',
  ACCION_NORMAL = 'ACCION_NORMAL',
  ACCION_PREPARADA = 'ACCION_PREPARADA',
  ATAQUE_NO_LETAL = 'ATAQUE_NO_LETAL',
  ATAQUE_APUNTADO = 'ATAQUE_APUNTADO',
  ATAQUE_COMBINADO = 'ATAQUE_COMBINADO',
  ATAQUE_SIMULTANEO = 'ATAQUE_SIMULTANEO',
  ATAQUE_TOTAL = 'ATAQUE_TOTAL',
  DEFENSA_TOTAL = 'DEFENSA_TOTAL',
  PROTEGER_ALIADO = 'PROTEGER_ALIADO',
  NO_ACTUAR = 'NO_ACTUAR',
  GUARDAR_ACCION = 'GUARDAR_ACCION',
  MEDICO_COMBATE = 'MEDICO_COMBATE',
  EFECTO_EPICO = 'EFECTO_EPICO',
  APREHENDER = 'APREHENDER',
}

// Modificadores que puede aplicar un efecto
export interface EffectModifiers {
  attack?: number; // Modificador al ataque (CombatStats.attack)
  defense?: number; // Modificador a la defensa (CombatStats.defense)
  impact?: number; // Modificador al impacto (CombatStats.impact)
  maxDamage?: number; // Modificador al daño máximo (CombatStats.maxDamage)
  physicalResistance?: number; // Modificador a resistencia física
  mentalResistance?: number; // Modificador a resistencia mental
  initiative?: number; // Modificador a la iniciativa (CombatStats.initiative)
  // Modificadores de atributos
  strength?: number; // Modificador a fuerza
  agility?: number; // Modificador agilidad
  willpower?: number; // Modificador voluntad
  luck?: number; // Modificador suerte
  intelligence?: number; // Modificador inteligencia
  // Modificadores de dominios
  physical?: number; // Modificador dominio físico
  combat?: number; // Modificador dominio combate
  social?: number; // Modificador dominio social
  environmental?: number; // Modificador dominio ambiental
  stealth?: number; // Modificador sigilo
  knowledge?: number; // Modificador conocimiento
  technical?: number; // Modificador técnico
  resources?: number; // Modificador recursos
  demonic?: number; // Modificador demoníaco
  aura?: number; // Modificador aura
}

// Efecto de combate extendido
export interface CombatEffect {
  id: string;
  name: string;
  description?: string;
  modifiers: EffectModifiers;
  durationType: DurationType;
  durationValue: number; // Cuántas unidades del tipo quedan
  origin: string; // "hechizo", "habilidad", "objeto", "DJ", etc.
  persistent: boolean; // Si no decrece automáticamente
  characterId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Lado en el combate
export enum CombatSide {
  ALIADO = 'ALIADO',
  ENEMIGO = 'ENEMIGO',
  NEUTRO = 'NEUTRO',
}

// Personaje de combate con información extendida
export interface CombatCharacter extends Character {
  side: CombatSide;
  currentPhysicalHealth: number;
  currentMentalHealth: number;
  combatEffects: CombatEffect[];
  currentModifiers: EffectModifiers;
  tiradaCombateActual?: number; // Tirada 2D6 del asalto actual
}

// Entrada en el orden de iniciativa
export interface InitiativeEntry {
  characterId: string;
  character: CombatCharacter;
  initiativeTotal: number;
  tiradaBase: number; // La tirada 2D6 original
  tieBreaker: number; // Para desempates
}

// Contexto del turno actual
export interface TurnContext {
  roundId: number;
  assaultNum: number;
  initiativeOrder: InitiativeEntry[];
  currentActorIndex: number;
  eventLog: string[];
}

// Opciones para acciones de combate
export interface CombatActionOptions {
  targetId?: string; // ID del objetivo (si aplica)
  bonusAttack?: number; // Modificador temporal al ataque
  bonusDefense?: number; // Modificador temporal a la defensa
  bonusImpact?: number; // Modificador temporal al impacto
  bonusMaxDamage?: number; // Modificador temporal al daño máximo
  difficulty?: number; // Dificultad para acciones normales
  description?: string; // Descripción narrativa de la acción
}

// Acción de combate
export interface CombatAction {
  type: CombatActionType;
  actorId: string;
  options: CombatActionOptions;
  narrative?: string; // Descripción narrativa
}

// Resultado de una tirada de ataque
export interface AttackResult {
  success: boolean;
  attackTotal: number;
  defenseTotal: number;
  impactTotal?: number;
  damageRoll?: number;
  finalDamage?: number;
  resistanceApplied?: number;
  criticalHit?: boolean;
  fumble?: boolean;
  narrative: string;
}

// Resultado de una acción de combate
export interface ActionResult {
  success: boolean;
  description: string;
  effectsApplied?: CombatEffect[];
  healthChanged?: {
    characterId: string;
    physicalChange?: number;
    mentalChange?: number;
  };
  narrative: string;
}

// Estado del combate
export interface CombatState {
  id: string;
  participants: CombatCharacter[];
  turnContext: TurnContext;
  isActive: boolean;
  winner?: CombatSide;
  startedAt: Date;
  endedAt?: Date;
}

// Interfaz para control del DJ
export interface DJControls {
  modifyEffect(
    characterId: string,
    effectId: string,
    newValues: Partial<CombatEffect>
  ): Promise<void>;
  addDirectEffect(
    characterId: string,
    effect: Omit<CombatEffect, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>
  ): Promise<void>;
  removeEffect(characterId: string, effectId: string): Promise<void>;
  forceInitiative(characterId: string, value: number): Promise<void>;
  shareImage(url: string, label?: string): Promise<void>;
  getCompleteCharacterState(characterId: string): Promise<CombatCharacter>;
  modifyHealth(
    characterId: string,
    physicalChange?: number,
    mentalChange?: number
  ): Promise<void>;
  endCombat(winner?: CombatSide): Promise<void>;
}

// Configuración de combate
export interface CombatConfig {
  useSameRollForInitiativeAndAttack: boolean; // Si usar la misma tirada 2D6 para iniciativa y ataque
  allowSimultaneousActions: boolean; // Si permitir acciones simultáneas en empates
  autoDecayEffects: boolean; // Si decrementar efectos automáticamente
  djModeEnabled: boolean; // Si está activo el modo DJ
}
