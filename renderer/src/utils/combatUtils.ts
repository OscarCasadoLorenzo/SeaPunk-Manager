// Utilidades básicas para el sistema de combate

/**
 * Tira dados según la notación estándar (ej: "2D6", "3D10")
 */
export function rollDice(diceNotation: string): {
  total: number;
  rolls: number[];
} {
  const match = diceNotation.match(/^(\d+)D(\d+)$/i);
  if (!match) {
    throw new Error(`Notación de dados inválida: ${diceNotation}`);
  }

  const numDice = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const rolls: number[] = [];
  let total = 0;

  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  return { total, rolls };
}

/**
 * Obtiene la cantidad de dados de daño según el valor de impacto total
 * Basado en la tabla de daño especificada
 */
export function getDamageDiceByImpact(impactTotal: number): string {
  if (impactTotal < 10) return '1D6';
  if (impactTotal >= 11 && impactTotal <= 16) return '2D6';
  if (impactTotal >= 17 && impactTotal <= 22) return '3D6';
  if (impactTotal >= 23 && impactTotal <= 26) return '4D6';
  if (impactTotal >= 27 && impactTotal <= 30) return '5D6';
  if (impactTotal >= 31 && impactTotal <= 34) return '6D6';
  if (impactTotal >= 35 && impactTotal <= 37) return '7D6';
  if (impactTotal >= 38 && impactTotal <= 40) return '8D6';
  if (impactTotal > 40) return '9D6';

  return '1D6'; // Fallback
}

/**
 * Tira 2D6 para la tirada base de combate
 */
export function rollCombatDice(): { total: number; rolls: [number, number] } {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  return {
    total: dice1 + dice2,
    rolls: [dice1, dice2],
  };
}

/**
 * Genera un número pequeño aleatorio para desempates
 */
export function generateTieBreaker(): number {
  return Math.random();
}

/**
 * Determina si una tirada es crítica (doble 6) o pifia (doble 1)
 */
export function checkCriticalOrFumble(rolls: [number, number]): {
  isCritical: boolean;
  isFumble: boolean;
} {
  const [dice1, dice2] = rolls;
  return {
    isCritical: dice1 === 6 && dice2 === 6,
    isFumble: dice1 === 1 && dice2 === 1,
  };
}

/**
 * Calcula bonificación por Ataque Total o Defensa Total
 * Bono = ½ RHar de DOM (dominio combate)
 */
export function calculateCombatDomainBonus(combatDomain: number): number {
  return Math.floor(combatDomain / 2);
}

/**
 * Formatea un mensaje de evento para el log de combate
 */
export function formatCombatEvent(
  roundId: number,
  assaultNum: number,
  message: string
): string {
  return `[R${roundId} A${assaultNum}] ${message}`;
}

/**
 * Clamp function para limitar valores entre min y max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Genera un ID único para efectos temporales
 */
export function generateEffectId(): string {
  return `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convierte milisegundos a formato legible
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Ordena el array de iniciativa por total descendente, usando tieBreaker para desempatar
 */
export function sortByInitiative<
  T extends { initiativeTotal: number; tieBreaker: number },
>(entries: T[]): T[] {
  return entries.sort((a, b) => {
    if (a.initiativeTotal !== b.initiativeTotal) {
      return b.initiativeTotal - a.initiativeTotal; // Descendente
    }
    return a.tieBreaker - b.tieBreaker; // Ascendente para desempate
  });
}

/**
 * Valida si un personaje está consciente y puede actuar
 */
export function canCharacterAct(character: {
  currentPhysicalHealth: number;
  currentMentalHealth: number;
}): boolean {
  return (
    character.currentPhysicalHealth > 0 && character.currentMentalHealth > 0
  );
}

/**
 * Calcula el total de un atributo incluyendo modificadores temporales
 */
export function calculateTotalAttribute(
  baseValue: number,
  modifiers: Record<string, number> = {},
  attributeName: string
): number {
  const modifier = modifiers[attributeName] || 0;
  return Math.max(0, baseValue + modifier); // No puede ser negativo
}

/**
 * Genera descripción narrativa de una tirada
 */
export function describeRoll(total: number, threshold?: number): string {
  if (!threshold) {
    if (total >= 12) return 'Excelente';
    if (total >= 10) return 'Buena';
    if (total >= 8) return 'Regular';
    if (total >= 6) return 'Mediocre';
    return 'Pobre';
  }

  const margin = total - threshold;
  if (margin >= 6) return `Éxito excepcional (+${margin})`;
  if (margin >= 3) return `Éxito considerable (+${margin})`;
  if (margin >= 0) return `Éxito (+${margin})`;
  if (margin >= -3) return `Fallo ajustado (${margin})`;
  return `Fallo rotundo (${margin})`;
}
