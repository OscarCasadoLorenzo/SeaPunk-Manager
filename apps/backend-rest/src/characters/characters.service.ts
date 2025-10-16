import { Injectable } from '@nestjs/common';
import { Character } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Character[]> {
    return this.prisma.character.findMany({
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        player: true,
        auraGifts: true,
        essences: true,
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
        player: true,
        auraGifts: true,
        essences: true,
        effects: true,
        inventories: true,
        narrative: true,
      },
    });
  }

  async create(data: CreateCharacterDto): Promise<Character> {
    const { attributes, domains, combatStats, ...characterData } = data;
    return this.prisma.character.create({
      data: {
        ...characterData,
        attributes: attributes ? { create: attributes } : undefined,
        domains: domains ? { create: domains } : undefined,
        combatStats: combatStats
          ? {
              create: {
                physicalHealth: combatStats.physicalHealth,
                maxPhysicalHealth: combatStats.maxPhysicalHealth,
                physicalResistance: combatStats.physicalResistance,
                maxPhysicalResistance: combatStats.maxPhysicalResistance,
                mentalHealth: combatStats.mentalHealth,
                maxMentalHealth: combatStats.maxMentalHealth,
                mentalResistance: combatStats.mentalResistance,
                maxMentalResistance: combatStats.maxMentalResistance,
                auraHealth: combatStats.auraHealth,
                maxAuraHealth: combatStats.maxAuraHealth,
                auraResistance: combatStats.auraResistance,
                maxAuraResistance: combatStats.maxAuraResistance,
                initiative: combatStats.initiative,
                armorClass: combatStats.armorClass,
                conditions: combatStats.conditions,
                defense: combatStats.defense,
                attack: combatStats.attack,
                impact: combatStats.impact,
                maxDamage: combatStats.maxDamage,
              },
            }
          : undefined,
      },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        player: true,
        auraGifts: true,
        essences: true,
        effects: true,
        inventories: true,
        narrative: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<CreateCharacterDto>
  ): Promise<Character> {
    const { attributes, domains, combatStats, ...characterData } = data;
    return this.prisma.character.update({
      where: { id },
      data: {
        ...characterData,
        attributes: attributes ? { update: attributes } : undefined,
        domains: domains ? { update: domains } : undefined,
        combatStats: combatStats ? { update: combatStats } : undefined,
      },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        player: true,
        auraGifts: true,
        essences: true,
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
