import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EffectsController } from './effects.controller';
import { EffectsService } from './effects.service';

@Module({
  imports: [PrismaModule],
  controllers: [EffectsController],
  providers: [EffectsService],
  exports: [EffectsService],
})
export class EffectsModule {}
