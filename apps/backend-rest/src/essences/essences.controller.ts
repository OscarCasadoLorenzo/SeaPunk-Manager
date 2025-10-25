import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCharacterEssenceDto } from './dto/create-character-essence.dto';
import { CreateEssenceDto } from './dto/create-essence.dto';
import { UpdateEssenceDto } from './dto/update-essence.dto';
import { EssencesService } from './essences.service';

@ApiTags('essences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('essences')
export class EssencesController {
  constructor(private readonly essencesService: EssencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all essences' })
  @ApiResponse({ status: 200, description: 'Returns all essences.' })
  findAll() {
    return this.essencesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific essence' })
  @ApiResponse({ status: 200, description: 'Returns the essence.' })
  findOne(@Param('id') id: string) {
    return this.essencesService.findOne(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get essence by name' })
  @ApiResponse({ status: 200, description: 'Returns the essence.' })
  findByName(@Param('name') name: string) {
    return this.essencesService.findByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create new essence' })
  @ApiResponse({ status: 201, description: 'The essence has been created.' })
  create(@Body() createEssenceDto: CreateEssenceDto) {
    return this.essencesService.create(createEssenceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update essence' })
  @ApiResponse({ status: 200, description: 'The essence has been updated.' })
  update(@Param('id') id: string, @Body() updateEssenceDto: UpdateEssenceDto) {
    return this.essencesService.update(id, updateEssenceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete essence' })
  @ApiResponse({ status: 200, description: 'The essence has been deleted.' })
  remove(@Param('id') id: string) {
    return this.essencesService.remove(id);
  }

  // Character Essence endpoints
  @Get('character/:characterId')
  @ApiOperation({ summary: 'Get character essences' })
  @ApiResponse({ status: 200, description: 'Returns the character essences.' })
  findCharacterEssences(
    @Param('characterId') characterId: string,
    @Query('include') include?: string
  ) {
    return this.essencesService.findCharacterEssences(
      characterId,
      include === 'essence'
    );
  }

  @Post('character')
  @ApiOperation({ summary: 'Add essence to character' })
  @ApiResponse({
    status: 201,
    description: 'The essence has been added to the character.',
  })
  addEssenceToCharacter(
    @Body() createCharacterEssenceDto: CreateCharacterEssenceDto
  ) {
    return this.essencesService.addEssenceToCharacter(
      createCharacterEssenceDto
    );
  }

  @Delete('character/:characterId/essence/:essenceId')
  @ApiOperation({ summary: 'Remove essence from character' })
  @ApiResponse({
    status: 200,
    description: 'The essence has been removed from the character.',
  })
  removeEssenceFromCharacter(
    @Param('characterId') characterId: string,
    @Param('essenceId') essenceId: string
  ) {
    return this.essencesService.removeEssenceFromCharacter(
      characterId,
      essenceId
    );
  }
}
