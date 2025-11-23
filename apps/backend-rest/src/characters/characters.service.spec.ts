import { Test, TestingModule } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { PaginationService } from "../common/services/pagination.service";
import { PrismaService } from "../prisma/prisma.service";
import { CharactersService } from "./characters.service";
import { CreateCharacterDto } from "./dto/create-character.dto";

describe("CharactersService", () => {
  let service: CharactersService;
  let prisma: PrismaService;

  const mockUser = {
    id: "user-id-123",
    role: UserRole.ADMIN,
    email: "admin@test.com",
    username: "admin",
  };

  const mockPrismaService = {
    character: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPaginationService = {
    parsePaginationQuery: jest.fn(),
  };

  const mockCharacter = {
    id: "test-id-123",
    characterName: "Test Character",
    archetype: "Warrior",
    faction: "Alliance",
    race: "Human",
    level: 5,
    epicPoints: 100,
    type: "Player",
    isNPC: false,
    isVisible: true,
    userId: "user-id-123",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  };

  const mockCharacterWithRelations = {
    ...mockCharacter,
    attributes: {
      id: "attr-id-123",
      characterId: "test-id-123",
      strength: 10,
      agility: 8,
      willpower: 7,
      luck: 5,
      intelligence: 9,
    },
    domains: {
      id: "domain-id-123",
      characterId: "test-id-123",
      physicalValue: 5,
      physicalEssence: "Test physical essence",
      combatValue: 4,
      combatEssence: "Test combat essence",
      socialValue: 3,
      socialEssence: "Test social essence",
      environmentalValue: 2,
      environmentalEssence: "Test environmental essence",
      stealthValue: 6,
      stealthEssence: "Test stealth essence",
      knowledgeValue: 6,
      knowledgeEssence: "Test knowledge essence",
      technicalValue: 2,
      technicalEssence: "Test technical essence",
      resourcesValue: 1,
      resourcesEssence: "Test resources essence",
      demonicValue: 0,
      demonicEssence: "Test demonic essence",
      auraValue: 2,
      auraEssence: "Test aura essence",
    },
    combatStats: {
      id: "combat-id-123",
      characterId: "test-id-123",
      physicalHealth: 100,
      maxPhysicalHealth: 100,
      physicalResistance: 50,
      maxPhysicalResistance: 50,
      mentalHealth: 80,
      maxMentalHealth: 80,
      mentalResistance: 40,
      maxMentalResistance: 40,
      auraHealth: 60,
      maxAuraHealth: 60,
      auraResistance: 30,
      maxAuraResistance: 30,
      initiative: 5,
      armorClass: 15,
      conditions: [],
      defense: 10,
      attack: 12,
      impact: 8,
      maxImpact: 20,
      maxDamage: 20,
    },
    user: {
      id: "user-id-123",
      username: "testuser",
      email: "test@example.com",
    },
    auraGifts: [],
    effects: [],
    inventories: [],
    narrative: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of characters with all relations", async () => {
      const mockCharacters = [mockCharacterWithRelations];
      mockPrismaService.character.findMany.mockResolvedValue(mockCharacters);

      const result = await service.findAll();

      expect(result).toEqual(mockCharacters);
      expect(prisma.character.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.character.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          attributes: true,
          domains: true,
          combatStats: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          auraGifts: true,
          effects: true,
          inventories: true,
          narrative: true,
          essences: true,
        },
      });
    });

    it("should return an empty array when no characters exist", async () => {
      mockPrismaService.character.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.character.findMany).toHaveBeenCalledTimes(1);
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockPrismaService.character.findMany.mockRejectedValue(dbError);

      await expect(service.findAll()).rejects.toThrow(
        "Database connection failed",
      );
      expect(prisma.character.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a single character with all relations", async () => {
      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );

      const result = await service.findOne("test-id-123");

      expect(result).toEqual(mockCharacterWithRelations);
      expect(prisma.character.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.character.findUnique).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        include: {
          attributes: true,
          domains: true,
          combatStats: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          auraGifts: true,
          effects: true,
          inventories: true,
          narrative: true,
          essences: true,
        },
      });
    });

    it("should throw NotFoundException when character does not exist", async () => {
      mockPrismaService.character.findUnique.mockResolvedValue(null);

      await expect(service.findOne("non-existent-id")).rejects.toThrow(
        'Character with ID "non-existent-id" not found',
      );
      expect(prisma.character.findUnique).toHaveBeenCalledTimes(1);
    });

    it("should handle invalid UUID format", async () => {
      const invalidId = "invalid-uuid";
      const dbError = new Error("Invalid UUID format");
      mockPrismaService.character.findUnique.mockRejectedValue(dbError);

      await expect(service.findOne(invalidId)).rejects.toThrow(
        "Invalid UUID format",
      );
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database timeout");
      mockPrismaService.character.findUnique.mockRejectedValue(dbError);

      await expect(service.findOne("test-id-123")).rejects.toThrow(
        "Database timeout",
      );
    });
  });

  describe("create", () => {
    const createDto: CreateCharacterDto = {
      characterName: "New Character",
      archetype: "Mage",
      faction: "Horde",
      race: "Elf",
      level: 1,
      epicPoints: 0,
      type: "Enemy",
      isNPC: true,
      isVisible: false,
      userId: "user-id-456",
      attributes: {
        characterId: "new-id-123",
        strength: 5,
        agility: 10,
        willpower: 8,
        luck: 3,
        intelligence: 12,
      },
      domains: {
        characterId: "new-id-123",
        physicalValue: 2,
        physicalEssence: "Physical essence",
        combatValue: 5,
        combatEssence: "Combat essence",
        socialValue: 4,
        socialEssence: "Social essence",
        environmentalValue: 1,
        environmentalEssence: "Environmental essence",
        stealthValue: 3,
        stealthEssence: "Stealth essence",
        knowledgeValue: 7,
        knowledgeEssence: "Knowledge essence",
        technicalValue: 2,
        technicalEssence: "Technical essence",
        resourcesValue: 1,
        resourcesEssence: "Resources essence",
        demonicValue: 0,
        demonicEssence: "Demonic essence",
        auraValue: 2,
        auraEssence: "Aura essence",
      },
      combatStats: {
        maxPhysicalHealth: 50,
        maxPhysicalResistance: 25,
        maxMentalHealth: 70,
        maxMentalResistance: 35,
        maxInitiative: 3,
        maxDefense: 8,
        maxAttack: 10,
        maxImpact: 15,
        maxDamage: 15,
      },
    };

    it("should create a character with all nested relations", async () => {
      const expectedCreatedCharacter = {
        ...mockCharacter,
        id: "new-id-123",
        characterName: createDto.characterName,
        archetype: createDto.archetype,
        attributes: createDto.attributes,
        domains: createDto.domains,
        combatStats: createDto.combatStats,
      };

      mockPrismaService.character.findUnique.mockResolvedValue(null);
      mockPrismaService.character.create.mockResolvedValue(
        expectedCreatedCharacter,
      );

      const result = await service.create(createDto);

      expect(result).toEqual(expectedCreatedCharacter);
      expect(prisma.character.findUnique).toHaveBeenCalledWith({
        where: { characterName: createDto.characterName },
      });
      expect(prisma.character.create).toHaveBeenCalledTimes(1);
      expect(prisma.character.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          characterName: createDto.characterName,
          archetype: createDto.archetype,
          faction: createDto.faction,
          attributes: { create: createDto.attributes },
          domains: { create: createDto.domains },
          combatStats: {
            create: expect.objectContaining({
              // Current values should be initialized to max values
              physicalHealth: createDto.combatStats?.maxPhysicalHealth,
              maxPhysicalHealth: createDto.combatStats?.maxPhysicalHealth,
              physicalResistance: createDto.combatStats?.maxPhysicalResistance,
              maxPhysicalResistance:
                createDto.combatStats?.maxPhysicalResistance,
              mentalHealth: createDto.combatStats?.maxMentalHealth,
              maxMentalHealth: createDto.combatStats?.maxMentalHealth,
              mentalResistance: createDto.combatStats?.maxMentalResistance,
              maxMentalResistance: createDto.combatStats?.maxMentalResistance,
            }),
          },
        }),
        include: expect.any(Object),
      });
    });

    it("should throw ConflictException when character name already exists", async () => {
      const existingCharacter = { ...mockCharacter };
      mockPrismaService.character.findUnique.mockResolvedValue(
        existingCharacter,
      );

      await expect(service.create(createDto)).rejects.toThrow(
        `Character with name "${createDto.characterName}" already exists`,
      );
      expect(prisma.character.findUnique).toHaveBeenCalledWith({
        where: { characterName: createDto.characterName },
      });
      expect(prisma.character.create).not.toHaveBeenCalled();
    });

    it("should create a character without optional relations", async () => {
      const minimalDto: CreateCharacterDto = {
        characterName: "Minimal Character",
        archetype: "Rogue",
        faction: "Neutral",
        race: "Dwarf",
        level: 1,
        epicPoints: 0,
        type: "Merchant",
        userId: "user-id-789",
      };

      const expectedCharacter = {
        ...mockCharacter,
        id: "minimal-id-123",
        ...minimalDto,
      };

      mockPrismaService.character.findUnique.mockResolvedValue(null);
      mockPrismaService.character.create.mockResolvedValue(expectedCharacter);

      const result = await service.create(minimalDto);

      expect(result).toEqual(expectedCharacter);
      expect(prisma.character.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          characterName: minimalDto.characterName,
          attributes: undefined,
          domains: undefined,
          combatStats: undefined,
        }),
        include: expect.any(Object),
      });
    });

    it("should handle missing required fields", async () => {
      const invalidDto = {
        characterName: "Invalid",
        // Missing required fields
      } as CreateCharacterDto;

      const dbError = new Error("Missing required fields");
      mockPrismaService.character.create.mockRejectedValue(dbError);

      await expect(service.create(invalidDto)).rejects.toThrow(
        "Missing required fields",
      );
    });

    it("should handle invalid userId (foreign key constraint)", async () => {
      const dtoWithInvalidUser = {
        ...createDto,
        userId: "non-existent-user",
      };

      const dbError = new Error("Foreign key constraint failed");
      mockPrismaService.character.create.mockRejectedValue(dbError);

      await expect(service.create(dtoWithInvalidUser)).rejects.toThrow(
        "Foreign key constraint failed",
      );
    });

    it("should handle database connection errors during creation", async () => {
      const dbError = new Error("Connection pool exhausted");
      mockPrismaService.character.create.mockRejectedValue(dbError);

      await expect(service.create(createDto)).rejects.toThrow(
        "Connection pool exhausted",
      );
    });
  });

  describe("update", () => {
    it("should update character basic fields", async () => {
      const updateData = {
        characterName: "Updated Name",
        level: 10,
        epicPoints: 500,
      };

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        ...updateData,
      };

      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData, mockUser);

      expect(result).toEqual(updatedCharacter);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({
          characterName: updateData.characterName,
          level: updateData.level,
          epicPoints: updateData.epicPoints,
        }),
        include: expect.any(Object),
      });
    });

    it("should update nested attributes relation", async () => {
      const updateData = {
        attributes: {
          strength: 15,
          intelligence: 12,
        },
      };

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        attributes: {
          ...mockCharacterWithRelations.attributes,
          strength: 15,
          intelligence: 12,
        },
      };

      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData, mockUser);

      expect(result).toEqual(updatedCharacter);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({
          attributes: { update: updateData.attributes },
        }),
        include: expect.any(Object),
      });
    });

    it("should update nested domains relation without explicit update key", async () => {
      const updateData = {
        domains: {
          physicalValue: 10,
          physicalEssence: "Updated physical essence",
          combatValue: 8,
          combatEssence: "Updated combat essence",
        },
      };

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        domains: {
          ...mockCharacterWithRelations.domains,
          physicalValue: 10,
          physicalEssence: "Updated physical essence",
          combatValue: 8,
          combatEssence: "Updated combat essence",
        },
      };

      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData, mockUser);

      expect(result).toEqual(updatedCharacter);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({
          domains: { update: updateData.domains },
        }),
        include: expect.any(Object),
      });
    });

    it("should upsert narrative relation", async () => {
      const updateData = {
        narrative: {
          background: "A new backstory",
          physicalDescription: "Brave and loyal",
        },
      };

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        narrative: {
          id: "narrative-id-123",
          characterId: "test-id-123",
          ...updateData.narrative,
        },
      };

      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData, mockUser);

      expect(result).toEqual(updatedCharacter);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({
          narrative: {
            upsert: {
              create: updateData.narrative,
              update: updateData.narrative,
            },
          },
        }),
        include: expect.any(Object),
      });
    });

    it("should handle inventories field gracefully (not updated)", async () => {
      const updateData = {
        characterName: "Updated Name",
      } as any;

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        characterName: updateData.characterName,
      };

      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData, mockUser);

      expect(result).toEqual(updatedCharacter);
      // Verify the update was called with just character name
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({
          characterName: "Updated Name",
        }),
        include: expect.any(Object),
      });
    });

    it("should throw NotFoundException when updating non-existent character", async () => {
      mockPrismaService.character.findUnique.mockResolvedValue(null);

      await expect(
        service.update("non-existent-id", { level: 5 }, mockUser),
      ).rejects.toThrow('Character with ID "non-existent-id" not found');
    });

    it("should handle concurrent update conflicts", async () => {
      const dbError = new Error(
        "Record has been modified by another transaction",
      );
      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockRejectedValue(dbError);

      await expect(
        service.update("test-id-123", { level: 5 }, mockUser),
      ).rejects.toThrow("Record has been modified by another transaction");
    });

    it("should handle validation errors for invalid data types", async () => {
      const invalidUpdateData = {
        level: "not-a-number" as unknown as number, // Invalid type
      };

      const dbError = new Error("Invalid input type");
      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockRejectedValue(dbError);

      await expect(
        service.update("test-id-123", invalidUpdateData, mockUser),
      ).rejects.toThrow("Invalid input type");
    });
  });

  describe("remove", () => {
    it("should successfully delete a character", async () => {
      mockPrismaService.character.findUnique.mockResolvedValue(mockCharacter);
      mockPrismaService.character.delete.mockResolvedValue(mockCharacter);

      await service.remove("test-id-123", mockUser);

      expect(prisma.character.delete).toHaveBeenCalledTimes(1);
      expect(prisma.character.delete).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
      });
    });

    it("should throw NotFoundException when deleting non-existent character", async () => {
      mockPrismaService.character.findUnique.mockResolvedValue(null);

      await expect(service.remove("non-existent-id", mockUser)).rejects.toThrow(
        'Character with ID "non-existent-id" not found',
      );
      expect(prisma.character.delete).not.toHaveBeenCalled();
    });

    it("should handle cascade deletion of related records", async () => {
      // Prisma handles cascade automatically based on schema
      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.delete.mockResolvedValue(
        mockCharacterWithRelations,
      );

      await service.remove("test-id-123", mockUser);

      expect(prisma.character.delete).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
      });
    });

    it("should handle database connection errors during deletion", async () => {
      const dbError = new Error("Connection lost during delete operation");
      mockPrismaService.character.findUnique.mockResolvedValue(mockCharacter);
      mockPrismaService.character.delete.mockRejectedValue(dbError);

      await expect(service.remove("test-id-123", mockUser)).rejects.toThrow(
        "Connection lost during delete operation",
      );
    });

    it("should throw NotFoundException for invalid character ID format", async () => {
      const invalidId = "";
      mockPrismaService.character.findUnique.mockResolvedValue(null);

      await expect(service.remove(invalidId, mockUser)).rejects.toThrow(
        'Character with ID "" not found',
      );
    });
  });

  describe("Edge Cases - Complex Scenarios", () => {
    it("should handle character with maximum level and epic points", async () => {
      const maxCharacter = {
        ...mockCharacter,
        level: 999999,
        epicPoints: Number.MAX_SAFE_INTEGER,
      };

      mockPrismaService.character.findUnique.mockResolvedValue(maxCharacter);

      const result = await service.findOne("test-id-123");

      expect(result.level).toBe(999999);
      expect(result.epicPoints).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("should handle partial update with only one field changed", async () => {
      const updateData = { isVisible: false };
      const updatedCharacter = {
        ...mockCharacterWithRelations,
        isVisible: false,
      };

      mockPrismaService.character.findUnique.mockResolvedValue(
        mockCharacterWithRelations,
      );
      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData, mockUser);

      expect(result.isVisible).toBe(false);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({ isVisible: false }),
        include: expect.any(Object),
      });
    });
  });
});
