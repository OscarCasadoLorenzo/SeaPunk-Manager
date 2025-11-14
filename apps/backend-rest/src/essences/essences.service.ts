import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCharacterEssenceDto } from './dto/create-character-essence.dto';
import { CreateEssenceDto } from './dto/create-essence.dto';
import { UpdateEssenceDto } from './dto/update-essence.dto';

@Injectable()
export class EssencesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.essence.findMany({
      include: {
        _count: {
          select: { characters: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.essence.findUnique({
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
    return this.prisma.essence.findFirst({
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

  async create(createEssenceDto: CreateEssenceDto) {
    return this.prisma.essence.create({
      data: createEssenceDto,
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });
  }

  async update(id: string, updateEssenceDto: UpdateEssenceDto) {
    return this.prisma.essence.update({
      where: { id },
      data: updateEssenceDto,
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.essence.delete({
      where: { id },
    });
  }

  // Character Essence relations
  async findCharacterEssences(characterId: string, includeEssence = false) {
    const includeOptions: any = {
      character: {
        select: {
          id: true,
          characterName: true,
        },
      },
    };

    if (includeEssence) {
      includeOptions.essence = true;
    }

    return this.prisma.characterEssence.findMany({
      where: { characterId },
      include: includeOptions,
      orderBy: { createdAt: 'desc' },
    });
  }

  async addEssenceToCharacter(
    createCharacterEssenceDto: CreateCharacterEssenceDto
  ) {
    const { characterId, essenceId, level } = createCharacterEssenceDto;
    return this.prisma.characterEssence.create({
      data: {
        characterId,
        essenceId,
        level,
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
        essence: true,
      },
    });
  }

  async removeEssenceFromCharacter(characterId: string, essenceId: string) {
    return this.prisma.characterEssence.delete({
      where: {
        characterId_essenceId: {
          characterId,
          essenceId,
        },
      },
    });
  }
}
