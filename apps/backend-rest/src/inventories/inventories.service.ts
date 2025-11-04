import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoriesService {
  constructor(private prisma: PrismaService) {}

  async findByCharacterId(characterId: string) {
    const items = await this.prisma.inventory.findMany({
      where: { characterId },
      include: {
        character: true,
      },
    });
    return items.map((item) => ({
      ...item,
      itemName: item.name,
    }));
  }

  async findByCharacterIdAndType(characterId: string, type: string) {
    const items = await this.prisma.inventory.findMany({
      where: {
        characterId,
        type,
      },
      include: {
        character: true,
      },
    });
    return items.map((item) => ({
      ...item,
      itemName: item.name,
    }));
  }

  async findOne(id: string) {
    const item = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        character: true,
      },
    });
    if (!item) {
      return null;
    }
    return {
      ...item,
      itemName: item.name,
    };
  }

  async create(createInventoryDto: CreateInventoryDto) {
    const { characterId, itemName, ...rest } = createInventoryDto;
    const item = await this.prisma.inventory.create({
      data: {
        character: {
          connect: { id: characterId },
        },
        name: itemName,
        ...rest,
      },
      include: {
        character: true,
      },
    });
    return {
      ...item,
      itemName: item.name,
    };
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    const { characterId, itemName, ...rest } = updateInventoryDto;
    const updates: any = {
      ...rest,
    };

    if (itemName) {
      updates.name = itemName;
    }

    if (characterId) {
      updates.character = {
        connect: { id: characterId },
      };
    }

    const item = await this.prisma.inventory.update({
      where: { id },
      data: updates,
      include: {
        character: true,
      },
    });

    return {
      ...item,
      itemName: item.name,
    };
  }

  async remove(id: string) {
    return this.prisma.inventory.delete({
      where: { id },
    });
  }
}
