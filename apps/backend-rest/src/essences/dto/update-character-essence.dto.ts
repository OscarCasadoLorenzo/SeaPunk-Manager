import { PartialType } from '@nestjs/swagger';
import { CreateCharacterEssenceDto } from './create-character-essence.dto';

export class UpdateCharacterEssenceDto extends PartialType(
  CreateCharacterEssenceDto
) {}
