import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateCharacterDto {
  @ApiProperty({ description: "The name of the character" })
  @IsString()
  name: string;

  @ApiProperty({ description: "The user ID who owns the character" })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: "The character level", default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  level?: number;

  @ApiProperty({ description: "The character experience points", default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  experience?: number;
}

export class UpdateCharacterDto {
  @ApiProperty({ description: "The name of the character" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: "The character level" })
  @IsInt()
  @Min(1)
  @IsOptional()
  level?: number;

  @ApiProperty({ description: "The character experience points" })
  @IsInt()
  @Min(0)
  @IsOptional()
  experience?: number;
}

export class CharacterResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  experience: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
