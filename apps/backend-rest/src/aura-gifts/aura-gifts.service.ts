import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuraGiftDto } from './dto/create-aura-gift.dto';
import { CreateCharacterAuraGiftDto } from './dto/create-character-aura-gift.dto';
import { UpdateAuraGiftDto } from './dto/update-aura-gift.dto';

@Injectable()
export class AuraGiftsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.auraGift.findMany({
      include: {
        _count: {
          select: { characters: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.auraGift.findUnique({
      where: { id },
      include: {
        characters: {
          include: {
            character: {
              select: {
                id: true,
                characterName: true,
              },
            },
          },
        },
        _count: {
          select: { characters: true },
        },
      },
    });
  }

  async findByName(name: string) {
    return this.prisma.auraGift.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: {
        characters: {
          include: {
            character: {
              select: {
                id: true,
                characterName: true,
              },
            },
          },
        },
      },
    });
  }

  async create(createAuraGiftDto: CreateAuraGiftDto) {
    return this.prisma.auraGift.create({
      data: createAuraGiftDto,
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });
  }

  async update(id: string, updateAuraGiftDto: UpdateAuraGiftDto) {
    return this.prisma.auraGift.update({
      where: { id },
      data: updateAuraGiftDto,
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.auraGift.delete({
      where: { id },
    });
  }

  // Character Aura Gift relations
  async findCharacterAuraGifts(characterId: string, includeAuraGift = false) {
    const includeOptions: any = {
      character: {
        select: {
          id: true,
          characterName: true,
        },
      },
    };

    if (includeAuraGift) {
      includeOptions.auraGift = true;
    }

    return this.prisma.characterAuraGift.findMany({
      where: { characterId },
      include: includeOptions,
      orderBy: { createdAt: 'desc' },
    });
  }

  async addAuraGiftToCharacter(
    createCharacterAuraGiftDto: CreateCharacterAuraGiftDto
  ) {
    const { characterId, auraGiftId, level } = createCharacterAuraGiftDto;
    return this.prisma.characterAuraGift.create({
      data: {
        character: { connect: { id: characterId } },
        auraGift: { connect: { id: auraGiftId } },
        level: level || 1,
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
        auraGift: true,
      },
    });
  }

  async removeAuraGiftFromCharacter(characterId: string, auraGiftId: string) {
    return this.prisma.characterAuraGift.delete({
      where: {
        characterId_auraGiftId: {
          characterId,
          auraGiftId,
        },
      },
    });
  }
}
