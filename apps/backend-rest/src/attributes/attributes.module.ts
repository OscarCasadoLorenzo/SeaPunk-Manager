import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';

@Module({
  imports: [PrismaModule],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService],
})
export class AttributesModule {}
