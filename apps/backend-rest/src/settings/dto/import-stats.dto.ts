import { ApiProperty } from "@nestjs/swagger";

export class ImportStatsDto {
  @ApiProperty({ description: "Number of users imported", example: 5 })
  users: number;

  @ApiProperty({ description: "Number of characters imported", example: 15 })
  characters: number;

  @ApiProperty({ description: "Number of attributes imported", example: 15 })
  attributes: number;

  @ApiProperty({ description: "Number of domains imported", example: 15 })
  domains: number;

  @ApiProperty({ description: "Number of combat stats imported", example: 15 })
  combatStats: number;

  @ApiProperty({ description: "Number of narratives imported", example: 15 })
  narratives: number;

  @ApiProperty({ description: "Number of inventories imported", example: 20 })
  inventories: number;

  @ApiProperty({ description: "Number of effects imported", example: 30 })
  effects: number;

  @ApiProperty({ description: "Number of essences imported", example: 50 })
  essences: number;

  @ApiProperty({ description: "Number of aura gifts imported", example: 40 })
  auraGifts: number;

  @ApiProperty({
    description: "Number of character essences imported",
    example: 25,
  })
  characterEssences: number;

  @ApiProperty({
    description: "Number of character aura gifts imported",
    example: 20,
  })
  characterAuraGifts: number;
}
