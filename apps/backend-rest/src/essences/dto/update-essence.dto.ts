import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateEssenceDto {
  @IsOptional()
  @IsString()
  @MaxLength(200, {
    message: "Essence text cannot exceed 200 characters",
  })
  text?: string;
}
