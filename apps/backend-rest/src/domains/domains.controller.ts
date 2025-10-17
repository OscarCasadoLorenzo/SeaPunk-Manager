import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DomainsService } from './domains.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@ApiTags('domains')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Get('character/:characterId')
  @ApiOperation({ summary: 'Get domains by character ID' })
  @ApiResponse({ status: 200, description: 'Returns the domains.' })
  findByCharacterId(@Param('characterId') characterId: string) {
    return this.domainsService.findByCharacterId(characterId);
  }

  @Post()
  @ApiOperation({ summary: 'Create new domains' })
  @ApiResponse({ status: 201, description: 'The domains have been created.' })
  create(@Body() createDomainDto: CreateDomainDto) {
    return this.domainsService.create(createDomainDto);
  }

  @Post('upsert/:characterId')
  @ApiOperation({ summary: 'Create or update domains for a character' })
  @ApiResponse({ status: 200, description: 'The domains have been upserted.' })
  upsert(
    @Param('characterId') characterId: string,
    @Body() createDomainDto: CreateDomainDto
  ) {
    return this.domainsService.upsert(characterId, createDomainDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update domains' })
  @ApiResponse({ status: 200, description: 'The domains have been updated.' })
  update(@Param('id') id: string, @Body() updateDomainDto: UpdateDomainDto) {
    return this.domainsService.update(id, updateDomainDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete domains' })
  @ApiResponse({ status: 200, description: 'The domains have been deleted.' })
  remove(@Param('id') id: string) {
    return this.domainsService.remove(id);
  }
}
