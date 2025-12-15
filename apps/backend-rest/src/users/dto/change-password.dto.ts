import { IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "../validators/strong-password.validator";

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  newPassword: string;
}
