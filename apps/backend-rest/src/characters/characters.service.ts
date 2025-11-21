import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Character, UserRole } from "@prisma/client";
import {
  PaginatedResponseDto,
  PaginationQueryDto,
  PaginationService,
  createPaginatedResponse,
} from "../common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCharacterDto } from "./dto/create-character.dto";
import { UpdateCharacterDto } from "./dto/update-character.dto";

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(
    paginationQuery?: PaginationQueryDto,
  ): Promise<Character[] | PaginatedResponseDto<Character>> {
    return this.findCharacters(paginationQuery);
  }

  async findByUserId(
    userId: string,
    paginationQuery?: PaginationQueryDto,
  ): Promise<Character[] | PaginatedResponseDto<Character>> {
    return this.findCharacters(paginationQuery, userId);
  }

  private async findCharacters(
    paginationQuery?: PaginationQueryDto,
    userId?: string,
  ): Promise<Character[] | PaginatedResponseDto<Character>> {
    // If no pagination params, return all characters (backward compatibility)
    if (!paginationQuery) {
      const whereCondition = userId ? { userId } : {};
      return this.prisma.character.findMany({
        where: whereCondition,
        include: {
          attributes: true,
          domains: true,
          combatStats: true,
          user: true,
          auraGifts: true,
          effects: true,
          inventories: true,
          narrative: true,
          essences: true,
        },
      });
    }

    // Parse pagination options
    const options =
      this.paginationService.parsePaginationQuery(paginationQuery);

    // Define allowed fields for this entity
    const allowedFields = [
      "id",
      "characterName",
      "level",
      "experience",
      "userId",
      "createdAt",
      "updatedAt",
    ];

    const allowedSortFields = [
      "characterName",
      "level",
      "experience",
      "createdAt",
      "updatedAt",
    ];

    const searchableFields = ["characterName"];

    // Build Prisma options
    const prismaOptions = this.paginationService.buildPrismaOptions(options, {
      allowedFields,
      allowedSortFields,
      defaultSort: [{ field: "createdAt", order: "desc" }],
    });

    // Build search filter
    const searchFilter = this.paginationService.buildSearchFilter(
      options.search,
      searchableFields,
    );

    // Add user filter if userId is provided
    const userFilter = userId ? { userId } : undefined;

    // Merge where conditions
    const where = this.paginationService.mergeWhereConditions(
      searchFilter,
      userFilter,
    );

    // Execute queries
    const [data, total] = await Promise.all([
      this.prisma.character.findMany({
        ...prismaOptions,
        where,
        include: prismaOptions.select
          ? undefined
          : {
              attributes: true,
              domains: true,
              combatStats: true,
              user: true,
              auraGifts: true,
              effects: true,
              inventories: true,
              narrative: true,
              essences: true,
            },
      }),
      this.prisma.character.count({ where }),
    ]);

    // Return paginated response
    return createPaginatedResponse(data, total, options.limit, options.offset);
  }

  async findOne(
    id: string,
    user?: { id: string; role: UserRole },
  ): Promise<Character> {
    const character = await this.prisma.character.findUnique({
      where: { id },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        user: true,
        auraGifts: true,
        effects: true,
        inventories: true,
        narrative: true,
        essences: true,
      },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID "${id}" not found`);
    }

    // Authorization check: only allow access to own characters unless user is ADMIN
    if (user && user.role !== UserRole.ADMIN && character.userId !== user.id) {
      throw new ForbiddenException(
        "You do not have permission to access this character",
      );
    }

    return character;
  }

  async create(data: CreateCharacterDto): Promise<Character> {
    const {
      attributes,
      domains,
      combatStats,
      narrative,
      essences,
      ...characterData
    } = data;

    // Check if character name already exists
    const existingCharacter = await this.prisma.character.findUnique({
      where: { characterName: characterData.characterName },
    });

    if (existingCharacter) {
      throw new ConflictException(
        `Character with name "${characterData.characterName}" already exists`,
      );
    }

    return this.prisma.character.create({
      data: {
        ...characterData,
        attributes: attributes ? { create: attributes } : undefined,
        domains: domains ? { create: domains } : undefined,
        narrative: narrative ? { create: narrative } : undefined,
        essences:
          essences && essences.length > 0
            ? {
                create: essences.map((text) => ({ text })),
              }
            : undefined,
        combatStats: combatStats
          ? {
              create: {
                // Initialize current values to match max values for new characters
                physicalHealth: combatStats.maxPhysicalHealth,
                maxPhysicalHealth: combatStats.maxPhysicalHealth,
                physicalResistance: combatStats.maxPhysicalResistance,
                maxPhysicalResistance: combatStats.maxPhysicalResistance,
                mentalHealth: combatStats.maxMentalHealth,
                maxMentalHealth: combatStats.maxMentalHealth,
                mentalResistance: combatStats.maxMentalResistance,
                maxMentalResistance: combatStats.maxMentalResistance,
                initiative: combatStats.maxInitiative ?? 0,
                maxInitiative: combatStats.maxInitiative ?? 0,
                defense: combatStats.maxDefense ?? 0,
                maxDefense: combatStats.maxDefense ?? 0,
                attack: combatStats.maxAttack ?? 0,
                maxAttack: combatStats.maxAttack ?? 0,
                impact: combatStats.maxImpact ?? 0,
                maxImpact: combatStats.maxImpact ?? 0,
                maxDamage: combatStats.maxDamage ?? 0,
              },
            }
          : undefined,
      },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        user: true,
        auraGifts: true,
        effects: true,
        inventories: true,
        narrative: true,
        essences: true,
      },
    });
  }

  async update(
    id: string,
    data: UpdateCharacterDto,
    user?: { id: string; role: UserRole },
  ): Promise<Character> {
    // Verify ownership before updating
    const existingCharacter = await this.prisma.character.findUnique({
      where: { id },
      select: { userId: true, narrative: true },
    });

    if (!existingCharacter) {
      throw new NotFoundException(`Character with ID "${id}" not found`);
    }

    // Authorization check: only allow updates to own characters unless user is ADMIN
    if (
      user &&
      user.role !== UserRole.ADMIN &&
      existingCharacter.userId !== user.id
    ) {
      throw new ForbiddenException(
        "You do not have permission to update this character",
      );
    }

    const {
      attributes,
      domains,
      combatStats,
      narrative,
      essences,
      ...characterData
    } = data;

    return this.prisma.character.update({
      where: { id },
      data: {
        ...characterData,
        attributes: attributes ? { update: attributes } : undefined,
        domains: domains ? { update: domains } : undefined,
        combatStats: combatStats ? { update: combatStats } : undefined,
        narrative: narrative
          ? {
              upsert: {
                create: narrative,
                update: narrative,
              },
            }
          : undefined,
        // Handle essences: delete all existing and create new ones
        essences:
          essences !== undefined
            ? {
                deleteMany: {},
                create: essences.map((text: string) => ({ text })),
              }
            : undefined,
        // Note: Inventories are handled separately as they're a one-to-many relationship
      },
      include: {
        attributes: true,
        domains: true,
        combatStats: true,
        user: true,
        auraGifts: true,
        effects: true,
        inventories: true,
        narrative: true,
        essences: true,
      },
    });
  }

  async remove(
    id: string,
    user?: { id: string; role: UserRole },
  ): Promise<void> {
    // Verify ownership before deleting
    const existingCharacter = await this.prisma.character.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingCharacter) {
      throw new NotFoundException(`Character with ID "${id}" not found`);
    }

    // Authorization check: only allow deletion of own characters unless user is ADMIN
    if (
      user &&
      user.role !== UserRole.ADMIN &&
      existingCharacter.userId !== user.id
    ) {
      throw new ForbiddenException(
        "You do not have permission to delete this character",
      );
    }

    await this.prisma.character.delete({
      where: { id },
    });
  }
}
