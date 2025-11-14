import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
  constructor(private prisma: PrismaService) {}

  async findByCharacterId(characterId: string) {
    return this.prisma.attribute.findUnique({
      where: { characterId },
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

  async create(createAttributeDto: CreateAttributeDto) {
    const { characterId, ...data } = createAttributeDto;
    return this.prisma.attribute.create({
      data: {
        characterId,
        ...data,
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

  async update(id: string, updateAttributeDto: UpdateAttributeDto) {
    return this.prisma.attribute.update({
      where: { id },
      data: updateAttributeDto,
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
    return this.prisma.attribute.delete({
      where: { id },
    });
  }

  async upsert(characterId: string, data: CreateAttributeDto) {
    const existingAttribute = await this.prisma.attribute.findUnique({
      where: { characterId },
    });

    if (existingAttribute) {
      return this.prisma.attribute.update({
        where: { characterId },
        data,
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

    return this.create(data);
  }
}
