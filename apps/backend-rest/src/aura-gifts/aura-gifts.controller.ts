import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuraGiftsService } from './aura-gifts.service';
import { CreateAuraGiftDto } from './dto/create-aura-gift.dto';
import { CreateCharacterAuraGiftDto } from './dto/create-character-aura-gift.dto';
import { UpdateAuraGiftDto } from './dto/update-aura-gift.dto';

@ApiTags('aura-gifts')
@Controller('aura-gifts')
export class AuraGiftsController {
  constructor(private readonly auraGiftsService: AuraGiftsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all aura gifts' })
  @ApiResponse({ status: 200, description: 'Returns all aura gifts.' })
  findAll() {
    return this.auraGiftsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific aura gift' })
  @ApiResponse({ status: 200, description: 'Returns the aura gift.' })
  findOne(@Param('id') id: string) {
    return this.auraGiftsService.findOne(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get aura gift by name' })
  @ApiResponse({ status: 200, description: 'Returns the aura gift.' })
  findByName(@Param('name') name: string) {
    return this.auraGiftsService.findByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create new aura gift' })
  @ApiResponse({ status: 201, description: 'The aura gift has been created.' })
  create(@Body() createAuraGiftDto: CreateAuraGiftDto) {
    return this.auraGiftsService.create(createAuraGiftDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update aura gift' })
  @ApiResponse({ status: 200, description: 'The aura gift has been updated.' })
  update(
    @Param('id') id: string,
    @Body() updateAuraGiftDto: UpdateAuraGiftDto
  ) {
    return this.auraGiftsService.update(id, updateAuraGiftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete aura gift' })
  @ApiResponse({ status: 200, description: 'The aura gift has been deleted.' })
  remove(@Param('id') id: string) {
    return this.auraGiftsService.remove(id);
  }

  // Character Aura Gift endpoints
  @Get('character/:characterId')
  @ApiOperation({ summary: 'Get character aura gifts' })
  @ApiResponse({
    status: 200,
    description: 'Returns the character aura gifts.',
  })
  findCharacterAuraGifts(
    @Param('characterId') characterId: string,
    @Query('include') include?: string
  ) {
    return this.auraGiftsService.findCharacterAuraGifts(
      characterId,
      include === 'auraGift'
    );
  }

  @Post('character')
  @ApiOperation({ summary: 'Add aura gift to character' })
  @ApiResponse({
    status: 201,
    description: 'The aura gift has been added to the character.',
  })
  addAuraGiftToCharacter(
    @Body() createCharacterAuraGiftDto: CreateCharacterAuraGiftDto
  ) {
    return this.auraGiftsService.addAuraGiftToCharacter(
      createCharacterAuraGiftDto
    );
  }

  @Delete('character/:characterId/aura-gift/:auraGiftId')
  @ApiOperation({ summary: 'Remove aura gift from character' })
  @ApiResponse({
    status: 200,
    description: 'The aura gift has been removed from the character.',
  })
  removeAuraGiftFromCharacter(
    @Param('characterId') characterId: string,
    @Param('auraGiftId') auraGiftId: string
  ) {
    return this.auraGiftsService.removeAuraGiftFromCharacter(
      characterId,
      auraGiftId
    );
  }
}
