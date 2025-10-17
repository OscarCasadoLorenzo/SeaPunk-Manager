import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';

@Module({
  imports: [PrismaModule],
  controllers: [InventoriesController],
  providers: [InventoriesService],
  exports: [InventoriesService],
})
export class InventoriesModule {}
