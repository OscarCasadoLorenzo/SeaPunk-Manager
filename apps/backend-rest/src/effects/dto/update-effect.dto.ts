import { PartialType } from '@nestjs/swagger';
import { CreateEffectDto } from './create-effect.dto';

export class UpdateEffectDto extends PartialType(CreateEffectDto) {}
