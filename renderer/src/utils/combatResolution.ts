// Sistema de resolución de ataques y acciones especiales de combate
import {
  ActionResult,
  AttackResult,
  CombatAction,
  CombatActionType,
  CombatCharacter,
} from '../types/combat';
import {
  calculateCombatDomainBonus,
  checkCriticalOrFumble,
  describeRoll,
  getDamageDiceByImpact,
  rollCombatDice,
  rollDice,
} from './combatUtils';
import { applyEffect, createCommonEffects } from './effectsSystem';

/**
 * Resuelve un ataque entre dos personajes
 */
export function resolveAttack(
  attacker: CombatCharacter,
  defender: CombatCharacter,
  action: CombatAction,
  useStoredRoll: boolean = true
): AttackResult {
  // Obtener o hacer tirada de combate
  let combatRoll: { total: number; rolls: [number, number] };

  if (useStoredRoll && attacker.tiradaCombateActual) {
    combatRoll = {
      total: attacker.tiradaCombateActual,
      rolls: [
        Math.floor(attacker.tiradaCombateActual / 2),
        Math.ceil(attacker.tiradaCombateActual / 2),
      ], // Aproximación
    };
  } else {
    combatRoll = rollCombatDice();
  }

  // Calcular ataque total
  const baseAttack = attacker.combatStats?.attack || 0;
  const attackModifier = attacker.currentModifiers.attack || 0;
  const bonusAttack = action.options.bonusAttack || 0;
  const attackTotal =
    combatRoll.total + baseAttack + attackModifier + bonusAttack;

  // Calcular defensa del objetivo
  const baseDefense = defender.combatStats?.defense || 0;
  const defenseModifier = defender.currentModifiers.defense || 0;
  const bonusDefense = action.options.bonusDefense || 0;
  const defenseTotal = baseDefense + defenseModifier + bonusDefense;

  // Verificar si el ataque tiene éxito
  const attackSuccess = attackTotal > defenseTotal;

  let result: AttackResult = {
    success: attackSuccess,
    attackTotal,
    defenseTotal,
    narrative: '',
  };

  if (attackSuccess) {
    // El ataque entra - calcular daño
    const baseImpact = attacker.combatStats?.impact || 0;
    const impactModifier = attacker.currentModifiers.impact || 0;
    const bonusImpact = action.options.bonusImpact || 0;
    const impactTotal =
      combatRoll.total + baseImpact + impactModifier + bonusImpact;

    // Obtener dados de daño según tabla
    const damageDice = getDamageDiceByImpact(impactTotal);
    const damageRoll = rollDice(damageDice);

    // Calcular resistencia del defensor
    const baseResistance = defender.combatStats?.physicalResistance || 0;
    const resistanceModifier =
      defender.currentModifiers.physicalResistance || 0;
    const resistanceTotal = baseResistance + resistanceModifier;

    // Daño después de resistencia
    let finalDamage = Math.max(0, damageRoll.total - resistanceTotal);

    // Limitar por daño máximo del atacante
    const baseMaxDamage = attacker.combatStats?.maxDamage || 10;
    const maxDamageModifier = attacker.currentModifiers.maxDamage || 0;
    const bonusMaxDamage = action.options.bonusMaxDamage || 0;
    const maxDamageTotal = baseMaxDamage + maxDamageModifier + bonusMaxDamage;

    finalDamage = Math.min(finalDamage, maxDamageTotal);

    // Verificar crítico o pifia
    const criticalCheck = checkCriticalOrFumble(combatRoll.rolls);

    result = {
      ...result,
      impactTotal,
      damageRoll: damageRoll.total,
      finalDamage,
      resistanceApplied: resistanceTotal,
      criticalHit: criticalCheck.isCritical,
      fumble: criticalCheck.isFumble,
      narrative: generateAttackNarrative(
        attacker,
        defender,
        attackTotal,
        defenseTotal,
        impactTotal,
        damageDice,
        damageRoll.total,
        resistanceTotal,
        finalDamage,
        criticalCheck
      ),
    };
  } else {
    result.narrative = `${attacker.characterName} ataca a ${defender.characterName}: ATQ ${attackTotal} vs DEF ${defenseTotal} - ¡FALLO!`;
  }

  return result;
}

/**
 * Genera narrativa descriptiva para un ataque
 */
function generateAttackNarrative(
  attacker: CombatCharacter,
  defender: CombatCharacter,
  attackTotal: number,
  defenseTotal: number,
  impactTotal: number,
  damageDice: string,
  damageRoll: number,
  resistance: number,
  finalDamage: number,
  criticalCheck: { isCritical: boolean; isFumble: boolean }
): string {
  let narrative = `${attacker.characterName} ataca a ${defender.characterName}: `;
  narrative += `ATQ ${attackTotal} vs DEF ${defenseTotal} - ¡ACIERTO! `;
  narrative += `Impacto ${impactTotal} → ${damageDice} = ${damageRoll}`;

  if (resistance > 0) {
    narrative += ` - Resistencia ${resistance}`;
  }

  narrative += ` → Daño final: ${finalDamage}`;

  if (criticalCheck.isCritical) {
    narrative += ' ¡CRÍTICO!';
  } else if (criticalCheck.isFumble) {
    narrative += ' ¡PIFIA!';
  }

  return narrative;
}

/**
 * Resuelve acciones especiales que no son ataques
 */
export function resolveNonAttackAction(
  actor: CombatCharacter,
  action: CombatAction
): { updatedActor: CombatCharacter; result: ActionResult } {
  let updatedActor = { ...actor };
  let result: ActionResult;

  switch (action.type) {
    case CombatActionType.ATAQUE_TOTAL:
      result = resolveAttackTotal(updatedActor);
      updatedActor = applyEffect(
        updatedActor,
        createCommonEffects.attackTotal(updatedActor.domains?.combat || 0)
      );
      break;

    case CombatActionType.DEFENSA_TOTAL:
      result = resolveDefenseTotal(updatedActor);
      updatedActor = applyEffect(
        updatedActor,
        createCommonEffects.totalDefense(updatedActor.domains?.combat || 0)
      );
      break;

    case CombatActionType.ATAQUE_NO_LETAL:
      result = resolveNonLethalAttack(updatedActor);
      updatedActor = applyEffect(
        updatedActor,
        createCommonEffects.nonLethalAttack()
      );
      break;

    case CombatActionType.ATAQUE_APUNTADO:
      result = resolveAimedAttack(updatedActor, action);
      // El efecto se aplica según la opción elegida
      const aimType = action.options.description?.includes('impacto')
        ? 'impact'
        : 'maxDamage';
      updatedActor = applyEffect(
        updatedActor,
        createCommonEffects.aimedAttack(aimType)
      );
      break;

    case CombatActionType.NO_ACTUAR:
      result = resolveNoAction(updatedActor);
      updatedActor = applyEffect(updatedActor, createCommonEffects.noAction());
      break;

    case CombatActionType.PROTEGER_ALIADO:
      result = resolveProtectAlly(updatedActor, action);
      updatedActor = applyEffect(
        updatedActor,
        createCommonEffects.protectAlly()
      );
      break;

    case CombatActionType.ACCION_NORMAL:
      result = resolveNormalAction(updatedActor, action);
      break;

    case CombatActionType.MEDICO_COMBATE:
      result = resolveCombatMedic(updatedActor, action);
      break;

    case CombatActionType.APREHENDER:
      result = resolveGrapple(updatedActor, action);
      break;

    case CombatActionType.ACCION_PREPARADA:
      result = resolvePreparedAction(updatedActor);
      break;

    case CombatActionType.GUARDAR_ACCION:
      result = resolveHoldAction(updatedActor);
      break;

    case CombatActionType.EFECTO_EPICO:
      result = resolveEpicEffect(updatedActor, action);
      break;

    default:
      result = {
        success: false,
        description: `Acción ${action.type} no implementada`,
        narrative: `${actor.characterName} intenta realizar una acción no implementada`,
      };
      break;
  }

  return { updatedActor, result };
}

/**
 * Resuelve Ataque Total
 */
function resolveAttackTotal(actor: CombatCharacter): ActionResult {
  const bonus = calculateCombatDomainBonus(actor.domains?.combat || 0);
  return {
    success: true,
    description: `Ataque Total: +${bonus} al ataque e iniciativa hasta el próximo asalto`,
    narrative: `${actor.characterName} adopta una postura completamente ofensiva, ganando +${bonus} al ataque e iniciativa`,
  };
}

/**
 * Resuelve Defensa Total
 */
function resolveDefenseTotal(actor: CombatCharacter): ActionResult {
  const bonus = calculateCombatDomainBonus(actor.domains?.combat || 0);
  return {
    success: true,
    description: `Defensa Total: +${bonus} a la defensa hasta el próximo asalto`,
    narrative: `${actor.characterName} se concentra únicamente en defenderse, ganando +${bonus} a la defensa`,
  };
}

/**
 * Resuelve Ataque No Letal
 */
function resolveNonLethalAttack(actor: CombatCharacter): ActionResult {
  return {
    success: true,
    description:
      'Ataque No Letal: -2 al ataque, impacto y daño máximo en el próximo ataque',
    narrative: `${actor.characterName} se prepara para atacar de forma no letal, controlando su fuerza`,
  };
}

/**
 * Resuelve Ataque Apuntado
 */
function resolveAimedAttack(
  actor: CombatCharacter,
  action: CombatAction
): ActionResult {
  const aimType = action.options.description?.includes('impacto')
    ? 'impacto'
    : 'daño máximo';
  return {
    success: true,
    description: `Ataque Apuntado: -1 ataque por +1 ${aimType}`,
    narrative: `${actor.characterName} toma tiempo para apuntar cuidadosamente, sacrificando velocidad por precisión`,
  };
}

/**
 * Resuelve No Actuar
 */
function resolveNoAction(actor: CombatCharacter): ActionResult {
  return {
    success: true,
    description: 'No Actuar: +1 a la defensa hasta el próximo asalto',
    narrative: `${actor.characterName} permanece alerta sin actuar, mejorando su capacidad defensiva`,
  };
}

/**
 * Resuelve Proteger Aliado
 */
function resolveProtectAlly(
  actor: CombatCharacter,
  action: CombatAction
): ActionResult {
  const targetId = action.options.targetId;
  // Aquí se implementaría la lógica para identificar al aliado protegido

  return {
    success: true,
    description:
      'Proteger Aliado: -3 a la defensa, se convierte en blanco de ataques al aliado',
    narrative: `${actor.characterName} se posiciona para proteger a un aliado, exponiéndose más al peligro`,
  };
}

/**
 * Resuelve Acción Normal (tirada contra dificultad)
 */
function resolveNormalAction(
  actor: CombatCharacter,
  action: CombatAction
): ActionResult {
  const combatRoll = rollCombatDice();
  const difficulty = action.options.difficulty || 10;
  const relevantAttribute = 0; // Aquí se determinaría qué atributo/dominio usar
  const total = combatRoll.total + relevantAttribute;

  const success = total >= difficulty;
  const description = describeRoll(total, difficulty);

  return {
    success,
    description: `Acción Normal: ${description} (${total} vs ${difficulty})`,
    narrative: `${actor.characterName} ${action.options.description || 'realiza una acción'}: ${description}`,
  };
}

/**
 * Resuelve Médico de Combate
 */
function resolveCombatMedic(
  actor: CombatCharacter,
  action: CombatAction
): ActionResult {
  const combatRoll = rollCombatDice();
  const medicalSkill = 0; // Aquí se usaría el dominio técnico o conocimiento
  const difficulty = 12; // Dificultad base para medicina de combate
  const total = combatRoll.total + medicalSkill;

  const success = total >= difficulty;
  const healingAmount = success
    ? Math.max(1, Math.floor((total - difficulty) / 2))
    : 0;

  return {
    success,
    description: `Medicina de Combate: ${success ? `Cura ${healingAmount} puntos` : 'Falló'}`,
    healthChanged:
      success && action.options.targetId
        ? {
            characterId: action.options.targetId,
            physicalChange: healingAmount,
          }
        : undefined,
    narrative: `${actor.characterName} ${success ? 'estabiliza las heridas' : 'no logra ayudar efectivamente'}`,
  };
}

/**
 * Resuelve Aprehender
 */
function resolveGrapple(
  actor: CombatCharacter,
  action: CombatAction
): ActionResult {
  // Esto requeriría una tirada de ataque especial vs la defensa del oponente
  return {
    success: false, // Placeholder
    description:
      'Aprehender: Requiere tirada de ataque vs defensa del oponente',
    narrative: `${actor.characterName} intenta aprehender al enemigo`,
  };
}

/**
 * Resuelve Acción Preparada
 */
function resolvePreparedAction(actor: CombatCharacter): ActionResult {
  return {
    success: true,
    description: 'Acción Preparada: Guardando turno para efecto épico',
    narrative: `${actor.characterName} se concentra, preparándose para una acción especial`,
  };
}

/**
 * Resuelve Guardar Acción
 */
function resolveHoldAction(actor: CombatCharacter): ActionResult {
  return {
    success: true,
    description: 'Guardar Acción: Cambia posición en el orden de iniciativa',
    narrative: `${actor.characterName} espera el momento adecuado para actuar`,
  };
}

/**
 * Resuelve Efecto Épico
 */
function resolveEpicEffect(
  actor: CombatCharacter,
  action: CombatAction
): ActionResult {
  const epicPointsCost = 1; // Costo base en PEP
  const currentEP = actor.epicPoints || 0;

  if (currentEP < epicPointsCost) {
    return {
      success: false,
      description: 'Efecto Épico: No tienes suficientes Puntos Épicos',
      narrative: `${actor.characterName} no puede activar un efecto épico`,
    };
  }

  return {
    success: true,
    description: `Efecto Épico: Gasta ${epicPointsCost} PEP para ${action.options.description || 'efecto especial'}`,
    narrative: `${actor.characterName} canaliza su poder épico para realizar una hazaña extraordinaria`,
  };
}

/**
 * Aplica daño a un personaje
 */
export function applyDamage(
  character: CombatCharacter,
  damage: number,
  damageType: 'physical' | 'mental' = 'physical'
): CombatCharacter {
  const updatedCharacter = { ...character };

  if (damageType === 'physical') {
    updatedCharacter.currentPhysicalHealth = Math.max(
      0,
      character.currentPhysicalHealth - damage
    );
  } else {
    updatedCharacter.currentMentalHealth = Math.max(
      0,
      character.currentMentalHealth - damage
    );
  }

  return updatedCharacter;
}

/**
 * Aplica curación a un personaje
 */
export function applyHealing(
  character: CombatCharacter,
  healing: number,
  healingType: 'physical' | 'mental' = 'physical'
): CombatCharacter {
  const updatedCharacter = { ...character };

  if (healingType === 'physical') {
    const maxHealth = character.combatStats?.maxPhysicalHealth || 0;
    updatedCharacter.currentPhysicalHealth = Math.min(
      maxHealth,
      character.currentPhysicalHealth + healing
    );
  } else {
    const maxHealth = character.combatStats?.maxMentalHealth || 0;
    updatedCharacter.currentMentalHealth = Math.min(
      maxHealth,
      character.currentMentalHealth + healing
    );
  }

  return updatedCharacter;
}
