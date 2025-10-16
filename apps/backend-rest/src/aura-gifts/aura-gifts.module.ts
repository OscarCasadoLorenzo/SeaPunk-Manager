import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuraGiftsController } from './aura-gifts.controller';
import { AuraGiftsService } from './aura-gifts.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuraGiftsController],
  providers: [AuraGiftsService],
  exports: [AuraGiftsService],
})
export class AuraGiftsModule {}
