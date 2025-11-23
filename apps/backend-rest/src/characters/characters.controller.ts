import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Character, UserRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PaginatedResponseDto, PaginationQueryDto } from "../common";
import { CharactersService } from "./characters.service";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@ApiTags("characters")
@Controller("characters")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOperation({
    summary: "Get characters with optional pagination",
    description:
      "Returns all characters for ADMIN users, only own characters for PLAYER/MASTER users",
  })
  @ApiResponse({
    status: 200,
    description:
      "Return characters based on user role (all for ADMIN, own for others).",
  })
  @ApiQuery({ type: PaginationQueryDto, required: false })
  findAll(
    @Request() req: any,
    @Query() paginationQuery?: PaginationQueryDto,
  ): Promise<Character[] | PaginatedResponseDto<Character>> {
    const user = req.user;

    // If user is ADMIN, return all characters
    if (user.role === UserRole.ADMIN) {
      return this.charactersService.findAll(paginationQuery);
    }

    // Otherwise, return only user's own characters
    return this.charactersService.findByUserId(user.id, paginationQuery);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a character by id" })
  @ApiResponse({ status: 200, description: "Return the character." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - User does not own this character.",
  })
  findOne(@Param("id") id: string, @Request() req: any): Promise<Character> {
    return this.charactersService.findOne(id, req.user);
  }

  @Post()
  @ApiOperation({ summary: "Create a new character" })
  @ApiResponse({ status: 201, description: "The character has been created." })
  create(
    @Body() createCharacterDto: Omit<Character, "id">,
  ): Promise<Character> {
    return this.charactersService.create(createCharacterDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a character" })
  @ApiResponse({ status: 200, description: "The character has been updated." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - User does not own this character.",
  })
  @Put(":id")
  @ApiOperation({ summary: "Update a character" })
  @ApiResponse({ status: 200, description: "The character has been updated." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - User does not own this character.",
  })
  update(
    @Param("id") id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @Request() req: any,
  ): Promise<Character> {
    return this.charactersService.update(id, updateCharacterDto, req.user);
  }

  @Put(":id/inventory")
  @ApiOperation({ summary: "Bulk update character inventory" })
  @ApiResponse({
    status: 200,
    description: "The character inventory has been updated.",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - User does not own this character.",
  })
  updateInventory(
    @Param("id") id: string,
    @Body() inventories: any[],
    @Request() req: any,
  ): Promise<Character> {
    return this.charactersService.updateInventory(id, inventories, req.user);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a character" })
  @ApiResponse({ status: 200, description: "The character has been deleted." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - User does not own this character.",
  })
  remove(@Param("id") id: string, @Request() req: any): Promise<void> {
    return this.charactersService.remove(id, req.user);
  }
}
