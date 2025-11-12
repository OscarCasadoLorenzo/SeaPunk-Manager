import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService, PrismaService],
  exports: [CharactersService],
})
export class CharactersModule {}
