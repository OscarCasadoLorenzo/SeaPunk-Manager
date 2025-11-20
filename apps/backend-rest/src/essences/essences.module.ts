import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { EssencesController } from "./essences.controller";
import { EssencesService } from "./essences.service";

@Module({
  imports: [PrismaModule],
  controllers: [EssencesController],
  providers: [EssencesService],
  exports: [EssencesService],
})
export class EssencesModule {}
