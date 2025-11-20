import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateDomainDto {
  @ApiProperty({ description: "Character ID" })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: "Physical domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  physicalValue: number;

  @ApiProperty({ description: "Physical domain essence" })
  @IsString()
  physicalEssence: string;

  @ApiProperty({ description: "Combat domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  combatValue: number;

  @ApiProperty({ description: "Combat domain essence" })
  @IsString()
  combatEssence: string;

  @ApiProperty({ description: "Social domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  socialValue: number;

  @ApiProperty({ description: "Social domain essence" })
  @IsString()
  socialEssence: string;

  @ApiProperty({ description: "Environmental domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  environmentalValue: number;

  @ApiProperty({ description: "Environmental domain essence" })
  @IsString()
  environmentalEssence: string;

  @ApiProperty({ description: "Stealth domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  stealthValue: number;

  @ApiProperty({ description: "Stealth domain essence" })
  @IsString()
  stealthEssence: string;

  @ApiProperty({ description: "Knowledge domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  knowledgeValue: number;

  @ApiProperty({ description: "Knowledge domain essence" })
  @IsString()
  knowledgeEssence: string;

  @ApiProperty({ description: "Technical domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  technicalValue: number;

  @ApiProperty({ description: "Technical domain essence" })
  @IsString()
  technicalEssence: string;

  @ApiProperty({ description: "Resources domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  resourcesValue: number;

  @ApiProperty({ description: "Resources domain essence" })
  @IsString()
  resourcesEssence: string;

  @ApiProperty({ description: "Demonic domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  demonicValue: number;

  @ApiProperty({ description: "Demonic domain essence" })
  @IsString()
  demonicEssence: string;

  @ApiProperty({ description: "Aura domain value", minimum: 0 })
  @IsInt()
  @Min(0)
  auraValue: number;

  @ApiProperty({ description: "Aura domain essence" })
  @IsString()
  auraEssence: string;
}
