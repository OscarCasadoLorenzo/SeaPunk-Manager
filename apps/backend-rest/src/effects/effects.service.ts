import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEffectDto } from './dto/create-effect.dto';
import { UpdateEffectDto } from './dto/update-effect.dto';

@Injectable()
export class EffectsService {
  constructor(private prisma: PrismaService) {}

  async findByCharacterId(characterId: string) {
    return this.prisma.effect.findMany({
      where: { characterId },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCharacterIdAndType(characterId: string, type: string) {
    return this.prisma.effect.findMany({
      where: {
        characterId,
        type,
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActiveEffects(characterId: string) {
    return this.prisma.effect.findMany({
      where: {
        characterId,
        duration: {
          gt: 0,
        },
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.effect.findUnique({
      where: { id },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
    });
  }

  async create(createEffectDto: CreateEffectDto) {
    const { characterId, ...data } = createEffectDto;
    return this.prisma.effect.create({
      data: {
        character: { connect: { id: characterId } },
        name: data.name,
        description: data.description,
        duration: data.duration,
        type: data.type || 'BUFF',
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
    });
  }

  async update(id: string, updateEffectDto: UpdateEffectDto) {
    return this.prisma.effect.update({
      where: { id },
      data: updateEffectDto,
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.effect.delete({
      where: { id },
    });
  }
}
