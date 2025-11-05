import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEffectDto } from './dto/create-effect.dto';
import { UpdateEffectDto } from './dto/update-effect.dto';
import { EffectsService } from './effects.service';

@ApiTags('effects')
@Controller('effects')
export class EffectsController {
  constructor(private readonly effectsService: EffectsService) {}

  @Get('character/:characterId')
  @ApiOperation({ summary: 'Get effects by character ID' })
  @ApiResponse({ status: 200, description: 'Returns the effects.' })
  findByCharacterId(@Param('characterId') characterId: string) {
    return this.effectsService.findByCharacterId(characterId);
  }

  @Get('character/:characterId/type/:type')
  @ApiOperation({ summary: 'Get effects by character ID and type' })
  @ApiResponse({ status: 200, description: 'Returns the effects.' })
  findByCharacterIdAndType(
    @Param('characterId') characterId: string,
    @Param('type') type: string
  ) {
    return this.effectsService.findByCharacterIdAndType(characterId, type);
  }

  @Get('character/:characterId/active')
  @ApiOperation({ summary: 'Get active effects for character' })
  @ApiResponse({ status: 200, description: 'Returns the active effects.' })
  findActiveEffects(@Param('characterId') characterId: string) {
    return this.effectsService.findActiveEffects(characterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific effect' })
  @ApiResponse({ status: 200, description: 'Returns the effect.' })
  findOne(@Param('id') id: string) {
    return this.effectsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new effect' })
  @ApiResponse({ status: 201, description: 'The effect has been created.' })
  create(@Body() createEffectDto: CreateEffectDto) {
    return this.effectsService.create(createEffectDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update effect' })
  @ApiResponse({ status: 200, description: 'The effect has been updated.' })
  update(@Param('id') id: string, @Body() updateEffectDto: UpdateEffectDto) {
    return this.effectsService.update(id, updateEffectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete effect' })
  @ApiResponse({ status: 200, description: 'The effect has been deleted.' })
  remove(@Param('id') id: string) {
    return this.effectsService.remove(id);
  }
}
