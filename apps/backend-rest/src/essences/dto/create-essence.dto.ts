import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateEssenceDto {
  @IsNotEmpty({ message: "Character ID is required" })
  @IsString()
  characterId: string;

  @IsNotEmpty({ message: "Essence text is required" })
  @IsString()
  @MaxLength(200, {
    message: "Essence text cannot exceed 200 characters",
  })
  text: string;
}
