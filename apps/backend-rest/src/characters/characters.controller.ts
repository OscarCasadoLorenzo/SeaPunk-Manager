import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Character } from '@prisma/client';
import { CharactersService } from './characters.service';

@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all characters' })
  @ApiResponse({ status: 200, description: 'Return all characters.' })
  findAll(): Promise<Character[]> {
    return this.charactersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a character by id' })
  @ApiResponse({ status: 200, description: 'Return the character.' })
  findOne(@Param('id') id: string): Promise<Character> {
    return this.charactersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @ApiResponse({ status: 201, description: 'The character has been created.' })
  create(
    @Body() createCharacterDto: Omit<Character, 'id'>
  ): Promise<Character> {
    return this.charactersService.create(createCharacterDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a character' })
  @ApiResponse({ status: 200, description: 'The character has been updated.' })
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: any // Allow flexible nested updates
  ): Promise<Character> {
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a character' })
  @ApiResponse({ status: 200, description: 'The character has been deleted.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.charactersService.remove(id);
  }
}
