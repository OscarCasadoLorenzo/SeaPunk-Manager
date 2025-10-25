import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async create(createPlayerDto: CreatePlayerDto) {
    return this.prisma.player.create({
      data: createPlayerDto,
      include: {
        characters: true,
      },
    });
  }

  async findAll() {
    return this.prisma.player.findMany({
      include: {
        characters: true,
      },
      orderBy: {
        playerName: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.player.findUnique({
      where: { id },
      include: {
        characters: true,
      },
    });
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    return this.prisma.player.update({
      where: { id },
      data: updatePlayerDto,
      include: {
        characters: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.player.delete({
      where: { id },
    });
  }
}
