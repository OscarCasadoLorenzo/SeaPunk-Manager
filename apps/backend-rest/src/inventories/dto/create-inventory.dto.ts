import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({ description: 'Character ID' })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Name of the item' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the item', required: false })
  @IsOptional()
  @IsString()
  description?: string;

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
