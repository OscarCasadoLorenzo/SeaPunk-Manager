import { IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "../validators/strong-password.validator";

export class AdminChangePasswordDto {
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
