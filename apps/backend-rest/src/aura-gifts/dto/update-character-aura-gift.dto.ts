import { PartialType } from '@nestjs/swagger';
import { CreateCharacterAuraGiftDto } from './create-character-aura-gift.dto';

export class UpdateCharacterAuraGiftDto extends PartialType(
  CreateCharacterAuraGiftDto
) {}
