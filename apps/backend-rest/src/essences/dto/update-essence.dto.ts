import { PartialType } from '@nestjs/swagger';
import { CreateEssenceDto } from './create-essence.dto';

export class UpdateEssenceDto extends PartialType(CreateEssenceDto) {}
