// Clase principal que gestiona el sistema de combate
import { Character } from '../types';
import {
  ActionResult,
  CombatAction,
  CombatActionType,
  CombatCharacter,
  CombatConfig,
  CombatSide,
  CombatState,
  DJControls,
  DurationType,
  InitiativeEntry,
} from '../types/combat';
import {
  canCharacterAct,
  formatCombatEvent,
  generateTieBreaker,
  rollCombatDice,
  sortByInitiative,
} from './combatUtils';
import {
  applyEffect,
  decrementEffectDurations,
  decrementEffectDurationsForCharacter,
  modifyEffect,
  recalculateModifiers,
  removeEffect,
} from './effectsSystem';

export class CombatManager {
  private combatState: CombatState;
  private config: CombatConfig;
  private djControls: DJControls;

  constructor(config: CombatConfig = CombatManager.getDefaultConfig()) {
    this.config = config;
    this.combatState = this.createEmptyCombatState();
    this.djControls = this.createDJControls();
  }

  /**
   * Configuración por defecto del combate
   */
  static getDefaultConfig(): CombatConfig {
    return {
      useSameRollForInitiativeAndAttack: true,
      allowSimultaneousActions: true,
      autoDecayEffects: true,
      djModeEnabled: false,
    };
  }

  /**
   * Convierte un Character normal a CombatCharacter
   */
  private convertToCombatCharacter(
    character: Character,
    side: CombatSide
  ): CombatCharacter {
    return {
      ...character,
      side,
      currentPhysicalHealth: character.combatStats?.physicalHealth || 0,
      currentMentalHealth: character.combatStats?.mentalHealth || 0,
      combatEffects: [],
      currentModifiers: {},
      tiradaCombateActual: undefined,
    };
  }

  /**
   * Inicia un nuevo combate con la lista de personajes
   */
  initiateCombat(
    characters: Character[],
    characterSides: Record<string, CombatSide>
  ): CombatState {
    const combatCharacters = characters.map((char) =>
      this.convertToCombatCharacter(
        char,
        characterSides[char.id] || CombatSide.NEUTRO
      )
    );

    this.combatState = {
      id: `combat_${Date.now()}`,
      participants: combatCharacters.map((char) => recalculateModifiers(char)),
      turnContext: {
        roundId: 1,
        assaultNum: 1,
        initiativeOrder: [],
        currentActorIndex: 0,
        eventLog: [],
      },
      isActive: true,
      startedAt: new Date(),
    };

    // Calcular orden de iniciativa inicial
    this.calculateInitiative();

    this.logEvent('¡Combate iniciado!');
    return this.combatState;
  }

  /**
   * Calcula y establece el orden de iniciativa para el asalto actual
   */
  private calculateInitiative(): void {
    const initiativeEntries: InitiativeEntry[] = [];

    for (const character of this.combatState.participants) {
      if (!canCharacterAct(character)) {
        continue; // Personajes inconscientes no participan en iniciativa
      }

      const combatRoll = rollCombatDice();

      // Guardar la tirada para posible reutilización en ataques
      if (this.config.useSameRollForInitiativeAndAttack) {
        character.tiradaCombateActual = combatRoll.total;
      }

      const baseInitiative = character.combatStats?.initiative || 0;
      const initiativeModifier = character.currentModifiers.initiative || 0;
      const initiativeTotal =
        combatRoll.total + baseInitiative + initiativeModifier;

      initiativeEntries.push({
        characterId: character.id,
        character,
        initiativeTotal,
        tiradaBase: combatRoll.total,
        tieBreaker: generateTieBreaker(),
      });

      this.logEvent(
        `${character.characterName} tira iniciativa: ${combatRoll.rolls[0]}+${combatRoll.rolls[1]}=${combatRoll.total} + ${baseInitiative} + ${initiativeModifier} = ${initiativeTotal}`
      );
    }

    // Ordenar por iniciativa
    this.combatState.turnContext.initiativeOrder =
      sortByInitiative(initiativeEntries);
    this.combatState.turnContext.currentActorIndex = 0;

    this.logEvent('Orden de iniciativa establecido:');
    this.combatState.turnContext.initiativeOrder.forEach((entry, index) => {
      this.logEvent(
        `${index + 1}. ${entry.character.characterName} (${entry.initiativeTotal})`
      );
    });
  }

  /**
   * Procesa el turno del personaje actual
   */
  async processTurn(action: CombatAction): Promise<ActionResult> {
    const currentEntry = this.getCurrentActorEntry();
    if (!currentEntry) {
      throw new Error('No hay personaje activo para procesar turno');
    }

    const actor = currentEntry.character;

    this.logEvent(`${actor.characterName} comienza su turno`);

    // Decrementar efectos de tipo TURNO al inicio
    if (this.config.autoDecayEffects) {
      this.updateCharacter(actor.id, (char) =>
        decrementEffectDurationsForCharacter(char, DurationType.TURNO)
      );
    }

    // Procesar la acción
    let result: ActionResult;

    switch (action.type) {
      case CombatActionType.ATACAR:
        result = await this.resolveAttack(actor, action);
        break;
      default:
        result = await this.resolveNonAttackAction(actor, action);
        break;
    }

    // Avanzar al siguiente turno
    this.advanceToNextTurn();

    return result;
  }

  /**
   * Obtiene la entrada del actor actual
   */
  private getCurrentActorEntry(): InitiativeEntry | null {
    const { initiativeOrder, currentActorIndex } = this.combatState.turnContext;
    return initiativeOrder[currentActorIndex] || null;
  }

  /**
   * Avanza al siguiente turno en el orden de iniciativa
   */
  private advanceToNextTurn(): void {
    this.combatState.turnContext.currentActorIndex++;

    // Si llegamos al final de la ronda
    if (
      this.combatState.turnContext.currentActorIndex >=
      this.combatState.turnContext.initiativeOrder.length
    ) {
      this.endAssault();
    }
  }

  /**
   * Termina el asalto actual y prepara el siguiente
   */
  private endAssault(): void {
    this.logEvent('Fin del asalto');

    // Decrementar efectos de tipo ASALTO
    if (this.config.autoDecayEffects) {
      this.combatState.participants = decrementEffectDurations(
        this.combatState.participants,
        DurationType.ASALTO
      );
    }

    // Verificar condiciones de fin de combate
    if (this.checkCombatEnd()) {
      return;
    }

    // Preparar siguiente asalto
    this.combatState.turnContext.assaultNum++;
    this.combatState.turnContext.currentActorIndex = 0;

    // Recalcular iniciativa para el nuevo asalto
    this.calculateInitiative();

    this.logEvent(
      `Iniciando asalto ${this.combatState.turnContext.assaultNum}`
    );
  }

  /**
   * Verifica si el combate ha terminado
   */
  private checkCombatEnd(): boolean {
    const activeSides = new Set(
      this.combatState.participants
        .filter(canCharacterAct)
        .map((char) => char.side)
    );

    // Si solo queda un lado activo (o ninguno), el combate termina
    if (activeSides.size <= 1) {
      const winner =
        activeSides.size === 1 ? Array.from(activeSides)[0] : undefined;
      this.endCombat(winner);
      return true;
    }

    return false;
  }

  /**
   * Termina el combate
   */
  private endCombat(winner?: CombatSide): void {
    this.combatState.isActive = false;
    this.combatState.winner = winner;
    this.combatState.endedAt = new Date();

    const winnerText = winner ? `Ganador: ${winner}` : 'Empate';
    this.logEvent(`¡Combate terminado! ${winnerText}`);

    // Decrementar efectos de tipo COMBATE
    if (this.config.autoDecayEffects) {
      this.combatState.participants = decrementEffectDurations(
        this.combatState.participants,
        DurationType.COMBATE
      );
    }
  }

  /**
   * Actualiza un personaje en el estado del combate
   */
  private updateCharacter(
    characterId: string,
    updater: (char: CombatCharacter) => CombatCharacter
  ): void {
    this.combatState.participants = this.combatState.participants.map((char) =>
      char.id === characterId ? updater(char) : char
    );

    // También actualizar en el orden de iniciativa si existe
    this.combatState.turnContext.initiativeOrder =
      this.combatState.turnContext.initiativeOrder.map((entry) =>
        entry.characterId === characterId
          ? { ...entry, character: this.getCharacterById(characterId)! }
          : entry
      );
  }

  /**
   * Obtiene un personaje por ID
   */
  getCharacterById(characterId: string): CombatCharacter | null {
    return (
      this.combatState.participants.find((char) => char.id === characterId) ||
      null
    );
  }

  /**
   * Añade un evento al log
   */
  private logEvent(message: string): void {
    const { roundId, assaultNum } = this.combatState.turnContext;
    const formattedMessage = formatCombatEvent(roundId, assaultNum, message);
    this.combatState.turnContext.eventLog.push(formattedMessage);
  }

  /**
   * Crea un estado de combate vacío
   */
  private createEmptyCombatState(): CombatState {
    return {
      id: '',
      participants: [],
      turnContext: {
        roundId: 0,
        assaultNum: 0,
        initiativeOrder: [],
        currentActorIndex: 0,
        eventLog: [],
      },
      isActive: false,
      startedAt: new Date(),
    };
  }

  /**
   * Crea los controles del DJ
   */
  private createDJControls(): DJControls {
    return {
      modifyEffect: async (
        characterId: string,
        effectId: string,
        newValues
      ) => {
        this.updateCharacter(characterId, (char) =>
          modifyEffect(char, effectId, newValues)
        );
        this.logEvent(
          `DJ modificó efecto en ${this.getCharacterById(characterId)?.characterName}`
        );
      },

      addDirectEffect: async (characterId: string, effect) => {
        this.updateCharacter(characterId, (char) => applyEffect(char, effect));
        this.logEvent(
          `DJ aplicó efecto "${effect.name}" a ${this.getCharacterById(characterId)?.characterName}`
        );
      },

      removeEffect: async (characterId: string, effectId: string) => {
        this.updateCharacter(characterId, (char) =>
          removeEffect(char, effectId)
        );
        this.logEvent(
          `DJ removió efecto de ${this.getCharacterById(characterId)?.characterName}`
        );
      },

      forceInitiative: async (characterId: string, value: number) => {
        const entry = this.combatState.turnContext.initiativeOrder.find(
          (e) => e.characterId === characterId
        );
        if (entry) {
          entry.initiativeTotal = value;
          this.combatState.turnContext.initiativeOrder = sortByInitiative(
            this.combatState.turnContext.initiativeOrder
          );
          this.logEvent(
            `DJ forzó iniciativa de ${entry.character.characterName} a ${value}`
          );
        }
      },

      shareImage: async (url: string, label = 'Imagen compartida') => {
        this.logEvent(`DJ compartió: ${label} - ${url}`);
      },

      getCompleteCharacterState: async (characterId: string) => {
        const character = this.getCharacterById(characterId);
        if (!character) {
          throw new Error(`Personaje ${characterId} no encontrado`);
        }
        return character;
      },

      modifyHealth: async (
        characterId: string,
        physicalChange?: number,
        mentalChange?: number
      ) => {
        this.updateCharacter(characterId, (char) => {
          const updated = { ...char };
          if (physicalChange !== undefined) {
            updated.currentPhysicalHealth = Math.max(
              0,
              updated.currentPhysicalHealth + physicalChange
            );
          }
          if (mentalChange !== undefined) {
            updated.currentMentalHealth = Math.max(
              0,
              updated.currentMentalHealth + mentalChange
            );
          }
          return updated;
        });

        const changes = [];
        if (physicalChange)
          changes.push(
            `Vida Física: ${physicalChange > 0 ? '+' : ''}${physicalChange}`
          );
        if (mentalChange)
          changes.push(
            `Vida Mental: ${mentalChange > 0 ? '+' : ''}${mentalChange}`
          );

        this.logEvent(
          `DJ modificó salud de ${this.getCharacterById(characterId)?.characterName}: ${changes.join(', ')}`
        );
      },

      endCombat: async (winner?: CombatSide) => {
        this.endCombat(winner);
      },
    };
  }

  // Métodos públicos para acceso al estado

  /**
   * Obtiene el estado actual del combate
   */
  getCombatState(): CombatState {
    return { ...this.combatState };
  }

  /**
   * Obtiene los controles del DJ
   */
  getDJControls(): DJControls {
    return this.djControls;
  }

  /**
   * Verifica si el combate está activo
   */
  isActive(): boolean {
    return this.combatState.isActive;
  }

  /**
   * Obtiene el personaje que debe actuar actualmente
   */
  getCurrentActor(): CombatCharacter | null {
    const entry = this.getCurrentActorEntry();
    return entry?.character || null;
  }

  /**
   * Resuelve un ataque entre personajes
   */
  private async resolveAttack(
    actor: CombatCharacter,
    action: CombatAction
  ): Promise<ActionResult> {
    const targetId = action.options.targetId;
    if (!targetId) {
      return {
        success: false,
        description: 'No se especificó objetivo para el ataque',
        narrative: `${actor.characterName} ataca al aire`,
      };
    }

    const target = this.getCharacterById(targetId);
    if (!target) {
      return {
        success: false,
        description: 'Objetivo no encontrado',
        narrative: `${actor.characterName} no puede encontrar su objetivo`,
      };
    }

    // Importar dinámicamente para evitar dependencias circulares
    const { resolveAttack, applyDamage } = await import('./combatResolution');

    const attackResult = resolveAttack(
      actor,
      target,
      action,
      this.config.useSameRollForInitiativeAndAttack
    );

    this.logEvent(attackResult.narrative);

    // Aplicar daño si el ataque fue exitoso
    if (
      attackResult.success &&
      attackResult.finalDamage &&
      attackResult.finalDamage > 0
    ) {
      this.updateCharacter(targetId, (char) =>
        applyDamage(char, attackResult.finalDamage!)
      );

      this.logEvent(
        `${target.characterName} recibe ${attackResult.finalDamage} puntos de daño`
      );
    }

    return {
      success: attackResult.success,
      description: `Ataque ${attackResult.success ? 'exitoso' : 'fallido'}`,
      healthChanged:
        attackResult.success && attackResult.finalDamage
          ? {
              characterId: targetId,
              physicalChange: -attackResult.finalDamage,
            }
          : undefined,
      narrative: attackResult.narrative,
    };
  }

  /**
   * Resuelve acciones especiales que no son ataques
   */
  private async resolveNonAttackAction(
    actor: CombatCharacter,
    action: CombatAction
  ): Promise<ActionResult> {
    // Importar dinámicamente para evitar dependencias circulares
    const { resolveNonAttackAction } = await import('./combatResolution');

    const resolution = resolveNonAttackAction(actor, action);

    // Actualizar el personaje con los efectos aplicados
    this.updateCharacter(actor.id, () => resolution.updatedActor);

    this.logEvent(resolution.result.narrative);

    // Aplicar cambios de salud si los hay
    if (resolution.result.healthChanged) {
      const { characterId, physicalChange, mentalChange } =
        resolution.result.healthChanged;
      this.updateCharacter(characterId, (char) => {
        const updated = { ...char };
        if (physicalChange !== undefined) {
          updated.currentPhysicalHealth = Math.max(
            0,
            updated.currentPhysicalHealth + physicalChange
          );
        }
        if (mentalChange !== undefined) {
          updated.currentMentalHealth = Math.max(
            0,
            updated.currentMentalHealth + mentalChange
          );
        }
        return updated;
      });
    }

    return resolution.result;
  }
}
