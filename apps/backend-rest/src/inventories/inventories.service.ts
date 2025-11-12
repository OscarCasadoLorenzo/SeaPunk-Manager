import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoriesService {
  constructor(private prisma: PrismaService) {}

  async findByCharacterId(characterId: string) {
    return this.prisma.inventory.findMany({
      where: { characterId },
      include: {
        character: true,
      },
    });
  }

  async findByCharacterIdAndType(characterId: string, type: string) {
    return this.prisma.inventory.findMany({
      where: {
        characterId,
        type,
      },
      include: {
        character: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.inventory.findUnique({
      where: { id },
      include: {
        character: true,
      },
    });
  }

  async create(createInventoryDto: CreateInventoryDto) {
    const { characterId, ...rest } = createInventoryDto;
    return this.prisma.inventory.create({
      data: {
        character: {
          connect: { id: characterId },
        },
        ...rest,
      },
      include: {
        character: true,
      },
    });
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    const { characterId, ...rest } = updateInventoryDto;
    const updates: any = {
      ...rest,
    };

    if (characterId) {
      updates.character = {
        connect: { id: characterId },
      };
    }

    return this.prisma.inventory.update({
      where: { id },
      data: updates,
      include: {
        character: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.inventory.delete({
      where: { id },
    });
  }
}
