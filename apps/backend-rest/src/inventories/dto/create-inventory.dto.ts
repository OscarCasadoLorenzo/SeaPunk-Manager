import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

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
    description:
      'Type of the item (e.g., "Weapon", "Armor", "Consumable", etc.)',
    example: 'Consumible',
  })
  @IsString()
  type: string;
}
