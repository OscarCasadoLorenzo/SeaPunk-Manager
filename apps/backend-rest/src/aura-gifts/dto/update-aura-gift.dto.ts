import { PartialType } from '@nestjs/swagger';
import { CreateAuraGiftDto } from './create-aura-gift.dto';

export class UpdateAuraGiftDto extends PartialType(CreateAuraGiftDto) {}
