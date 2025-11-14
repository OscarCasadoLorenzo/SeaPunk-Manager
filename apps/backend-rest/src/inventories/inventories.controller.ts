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
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoriesService } from './inventories.service';

@ApiTags('inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({
    status: 201,
    description: 'The inventory item has been successfully created.',
  })
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoriesService.create(createInventoryDto);
  }

  @Get('character/:characterId')
  @ApiOperation({ summary: 'Get all inventory items for a character' })
  @ApiResponse({
    status: 200,
    description: 'Returns all inventory items for the specified character.',
  })
  findByCharacterId(@Param('characterId') characterId: string) {
    return this.inventoriesService.findByCharacterId(characterId);
  }

  @Get('character/:characterId/type/:type')
  @ApiOperation({ summary: 'Get character inventory items by type' })
  @ApiResponse({
    status: 200,
    description:
      'Returns all inventory items of a specific type for the character.',
  })
  findByCharacterIdAndType(
    @Param('characterId') characterId: string,
    @Param('type') type: string
  ) {
    return this.inventoriesService.findByCharacterIdAndType(characterId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific inventory item' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified inventory item.',
  })
  findOne(@Param('id') id: string) {
    return this.inventoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an inventory item' })
  @ApiResponse({
    status: 200,
    description: 'The inventory item has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto
  ) {
    return this.inventoriesService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inventory item' })
  @ApiResponse({
    status: 200,
    description: 'The inventory item has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.inventoriesService.remove(id);
  }
}
