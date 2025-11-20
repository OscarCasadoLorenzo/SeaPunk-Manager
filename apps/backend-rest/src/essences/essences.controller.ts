import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateEssenceDto } from "./dto/create-essence.dto";
import { UpdateEssenceDto } from "./dto/update-essence.dto";
import { EssencesService } from "./essences.service";

@Controller("essences")
@UseGuards(JwtAuthGuard)
export class EssencesController {
  constructor(private readonly essencesService: EssencesService) {}

  @Post()
  create(@Body() createEssenceDto: CreateEssenceDto) {
    return this.essencesService.create(createEssenceDto);
  }

  @Get("character/:characterId")
  findByCharacter(@Param("characterId") characterId: string) {
    return this.essencesService.findByCharacter(characterId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.essencesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEssenceDto: UpdateEssenceDto) {
    return this.essencesService.update(id, updateEssenceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.essencesService.remove(id);
  }

  @Post("character/:characterId/bulk")
  createMany(
    @Param("characterId") characterId: string,
    @Body("texts") texts: string[],
  ) {
    return this.essencesService.createMany(characterId, texts);
  }

  @Post("character/:characterId/replace")
  replaceAll(
    @Param("characterId") characterId: string,
    @Body("texts") texts: string[],
  ) {
    return this.essencesService.replaceAll(characterId, texts);
  }
}
