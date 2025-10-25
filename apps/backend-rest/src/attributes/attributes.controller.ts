import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@ApiTags('attributes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new attributes' })
  @ApiResponse({
    status: 201,
    description: 'The attributes have been created.',
  })
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto);
  }

  @Get('character/:characterId')
  @ApiOperation({ summary: 'Get attributes by character ID' })
  @ApiResponse({ status: 200, description: 'Returns the attributes.' })
  findByCharacterId(@Param('characterId') characterId: string) {
    return this.attributesService.findByCharacterId(characterId);
  }

  @Post('upsert/:characterId')
  @ApiOperation({ summary: 'Create or update attributes for a character' })
  @ApiResponse({
    status: 200,
    description: 'The attributes have been upserted.',
  })
  upsert(
    @Param('characterId') characterId: string,
    @Body() createAttributeDto: CreateAttributeDto
  ) {
    return this.attributesService.upsert(characterId, createAttributeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attributes' })
  @ApiResponse({
    status: 200,
    description: 'The attributes have been updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto
  ) {
    return this.attributesService.update(id, updateAttributeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attributes' })
  @ApiResponse({
    status: 200,
    description: 'The attributes have been deleted.',
  })
  remove(@Param('id') id: string) {
    return this.attributesService.remove(id);
  }
}
