import { ConflictException, Injectable } from "@nestjs/common";
import { Character } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCharacterDto } from "./dto/create-character.dto";

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Character[]> {
    return this.prisma.character.findMany({
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        user: true,
        auraGifts: true,
        effects: true,
        inventories: true,
        narrative: true,
      },
    });
  }

  async findOne(id: string): Promise<Character> {
    return this.prisma.character.findUnique({
      where: { id },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        user: true,
        auraGifts: true,
        effects: true,
        inventories: true,
        narrative: true,
      },
    });
  }

  async create(data: CreateCharacterDto): Promise<Character> {
    const { attributes, domains, combatStats, narrative, ...characterData } =
      data;

    // Check if character name already exists
    const existingCharacter = await this.prisma.character.findUnique({
      where: { characterName: characterData.characterName },
    });

    if (existingCharacter) {
      throw new ConflictException(
        `Character with name "${characterData.characterName}" already exists`,
      );
    }

    return this.prisma.character.create({
      data: {
        ...characterData,
        attributes: attributes ? { create: attributes } : undefined,
        domains: domains ? { create: domains } : undefined,
        narrative: narrative ? { create: narrative } : undefined,
        combatStats: combatStats
          ? {
              create: {
                // Initialize current values to match max values for new characters
                physicalHealth: combatStats.maxPhysicalHealth,
                maxPhysicalHealth: combatStats.maxPhysicalHealth,
                physicalResistance: combatStats.maxPhysicalResistance,
                maxPhysicalResistance: combatStats.maxPhysicalResistance,
                mentalHealth: combatStats.maxMentalHealth,
                maxMentalHealth: combatStats.maxMentalHealth,
                mentalResistance: combatStats.maxMentalResistance,
                maxMentalResistance: combatStats.maxMentalResistance,
                initiative: combatStats.maxInitiative ?? 0,
                maxInitiative: combatStats.maxInitiative ?? 0,
                defense: combatStats.maxDefense ?? 0,
                maxDefense: combatStats.maxDefense ?? 0,
                attack: combatStats.maxAttack ?? 0,
                maxAttack: combatStats.maxAttack ?? 0,
                impact: combatStats.maxImpact ?? 0,
                maxImpact: combatStats.maxImpact ?? 0,
                maxDamage: combatStats.maxDamage ?? 0,
              },
            }
          : undefined,
      },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        user: true,
        auraGifts: true,
        effects: true,
        inventories: true,
        narrative: true,
      },
    });
  }

  async update(
    id: string,
    data: any, // Using any to allow flexible nested updates
  ): Promise<Character> {
    const {
      attributes,
      domains,
      combatStats,
      narrative,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      inventories: _,
      ...characterData
    } = data;

    return this.prisma.character.update({
      where: { id },
      data: {
        ...characterData,
        attributes: attributes?.update
          ? { update: attributes.update }
          : attributes
            ? { update: attributes }
            : undefined,
        domains: domains?.update
          ? { update: domains.update }
          : domains
            ? { update: domains }
            : undefined,
        combatStats: combatStats?.update
          ? { update: combatStats.update }
          : combatStats
            ? { update: combatStats }
            : undefined,
        narrative: narrative
          ? {
              upsert: {
                create: narrative.update || narrative,
                update: narrative.update || narrative,
              },
            }
          : undefined,
        // Note: Inventories are handled separately as they're a one-to-many relationship
      },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        user: true,
        auraGifts: true,
        effects: true,
        inventories: true,
        narrative: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.character.delete({
      where: { id },
    });
  }
}
