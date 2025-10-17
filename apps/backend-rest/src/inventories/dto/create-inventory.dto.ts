import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { InventoryType } from '../enums/inventory-type.enum';

export class CreateInventoryDto {
  @ApiProperty({ description: 'Character ID' })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Name of the item' })
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @ApiProperty({ description: 'Description of the item' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quantity of the item', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Type of the item',
    enum: InventoryType,
    enumName: 'InventoryType',
  })
  @IsEnum(InventoryType)
  type: InventoryType;
}
