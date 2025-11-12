import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}

  async findByCharacterId(characterId: string) {
    return this.prisma.domain.findUnique({
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

  async create(createDomainDto: CreateDomainDto) {
    const { characterId, ...data } = createDomainDto;
    return this.prisma.domain.create({
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

  async update(id: string, updateDomainDto: UpdateDomainDto) {
    return this.prisma.domain.update({
      where: { id },
      data: updateDomainDto,
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
    return this.prisma.domain.delete({
      where: { id },
    });
  }

  async upsert(characterId: string, data: CreateDomainDto) {
    const existingDomain = await this.prisma.domain.findUnique({
      where: { characterId },
    });

    if (existingDomain) {
      return this.prisma.domain.update({
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
