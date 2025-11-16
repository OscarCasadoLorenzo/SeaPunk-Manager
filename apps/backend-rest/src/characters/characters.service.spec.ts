import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { CharactersService } from "./characters.service";
import { CreateCharacterDto } from "./dto/create-character.dto";

describe("CharactersService", () => {
  let service: CharactersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    character: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCharacter = {
    id: "test-id-123",
    characterName: "Test Character",
    archetype: "Warrior",
    faction: "Alliance",
    race: "Human",
    level: 5,
    category: "Hero",
    epicPoints: 100,
    type: "Player",
    isNPC: false,
    isVisible: true,
    userId: "user-id-123",
    bcat: 0,
    powerLevel: 0,
    physicalResistanceDomain: null,
    mentalResistanceDomain: null,
    defenseDomain: null,
    attackDomain: null,
    impactDomain: null,
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
      physical: 5,
      mental: 4,
      social: 3,
      survival: 2,
      knowledge: 6,
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
      maxDamage: 20,
    },
    user: {
      id: "user-id-123",
      username: "testuser",
      email: "test@example.com",
    },
    auraGifts: [],
    essences: [],
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
        include: {
          attributes: true,
          domains: true,
          combatStats: true,
          user: true,
          auraGifts: true,
          essences: true,
          effects: true,
          inventories: true,
          narrative: true,
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
          user: true,
          auraGifts: true,
          essences: true,
          effects: true,
          inventories: true,
          narrative: true,
        },
      });
    });

    it("should return null when character does not exist", async () => {
      mockPrismaService.character.findUnique.mockResolvedValue(null);

      const result = await service.findOne("non-existent-id");

      expect(result).toBeNull();
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
      category: "NPC",
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
        physical: 2,
        combat: 5,
        social: 4,
        environmental: 1,
        stealth: 3,
        knowledge: 7,
        technical: 2,
        resources: 1,
        demonic: 0,
        aura: 2,
      },
      combatStats: {
        physicalHealth: 50,
        maxPhysicalHealth: 50,
        physicalResistance: 25,
        maxPhysicalResistance: 25,
        mentalHealth: 70,
        maxMentalHealth: 70,
        mentalResistance: 35,
        maxMentalResistance: 35,
        auraHealth: 40,
        maxAuraHealth: 40,
        auraResistance: 20,
        maxAuraResistance: 20,
        initiative: 3,
        armorClass: 12,
        conditions: [],
        defense: 8,
        attack: 10,
        impact: 6,
        maxDamage: 15,
      },
    };

    it("should create a character with all nested relations", async () => {
      const expectedCreatedCharacter = {
        id: "new-id-123",
        ...mockCharacter,
        characterName: createDto.characterName,
        archetype: createDto.archetype,
        attributes: createDto.attributes,
        domains: createDto.domains,
        combatStats: createDto.combatStats,
      };

      mockPrismaService.character.create.mockResolvedValue(
        expectedCreatedCharacter,
      );

      const result = await service.create(createDto);

      expect(result).toEqual(expectedCreatedCharacter);
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
              physicalHealth: createDto.combatStats.physicalHealth,
              maxPhysicalHealth: createDto.combatStats.maxPhysicalHealth,
            }),
          },
        }),
        include: expect.any(Object),
      });
    });

    it("should create a character without optional relations", async () => {
      const minimalDto: CreateCharacterDto = {
        characterName: "Minimal Character",
        archetype: "Rogue",
        faction: "Neutral",
        race: "Dwarf",
        level: 1,
        category: "NPC",
        epicPoints: 0,
        type: "Merchant",
        userId: "user-id-789",
      };

      const expectedCharacter = {
        id: "minimal-id-123",
        ...mockCharacter,
        ...minimalDto,
      };

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

      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData);

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
          update: {
            strength: 15,
            intelligence: 12,
          },
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

      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData);

      expect(result).toEqual(updatedCharacter);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({
          attributes: { update: updateData.attributes.update },
        }),
        include: expect.any(Object),
      });
    });

    it("should update nested domains relation without explicit update key", async () => {
      const updateData = {
        domains: {
          physical: 10,
          mental: 8,
        },
      };

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        domains: {
          ...mockCharacterWithRelations.domains,
          physical: 10,
          mental: 8,
        },
      };

      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData);

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
          update: {
            backstory: "A new backstory",
            personality: "Brave and loyal",
          },
        },
      };

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        narrative: {
          id: "narrative-id-123",
          characterId: "test-id-123",
          ...updateData.narrative.update,
        },
      };

      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData);

      expect(result).toEqual(updatedCharacter);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({
          narrative: {
            upsert: {
              create: updateData.narrative.update,
              update: updateData.narrative.update,
            },
          },
        }),
        include: expect.any(Object),
      });
    });

    it("should handle inventories field gracefully (not updated)", async () => {
      const updateData = {
        characterName: "Updated Name",
        inventories: [{ id: "inv-1", name: "Sword" }],
      };

      const updatedCharacter = {
        ...mockCharacterWithRelations,
        characterName: updateData.characterName,
      };

      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData);

      expect(result).toEqual(updatedCharacter);
      // Inventories should be excluded from the update data
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.not.objectContaining({
          inventories: expect.anything(),
        }),
        include: expect.any(Object),
      });
    });

    it("should return null when updating non-existent character", async () => {
      mockPrismaService.character.update.mockRejectedValue(
        new Error("Record to update not found"),
      );

      await expect(
        service.update("non-existent-id", { level: 5 }),
      ).rejects.toThrow("Record to update not found");
    });

    it("should handle concurrent update conflicts", async () => {
      const dbError = new Error(
        "Record has been modified by another transaction",
      );
      mockPrismaService.character.update.mockRejectedValue(dbError);

      await expect(service.update("test-id-123", { level: 5 })).rejects.toThrow(
        "Record has been modified by another transaction",
      );
    });

    it("should handle validation errors for invalid data types", async () => {
      const invalidUpdateData = {
        level: "not-a-number" as unknown as number, // Invalid type
      };

      const dbError = new Error("Invalid input type");
      mockPrismaService.character.update.mockRejectedValue(dbError);

      await expect(
        service.update("test-id-123", invalidUpdateData),
      ).rejects.toThrow("Invalid input type");
    });
  });

  describe("remove", () => {
    it("should successfully delete a character", async () => {
      mockPrismaService.character.delete.mockResolvedValue(mockCharacter);

      await service.remove("test-id-123");

      expect(prisma.character.delete).toHaveBeenCalledTimes(1);
      expect(prisma.character.delete).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
      });
    });

    it("should handle deletion of non-existent character", async () => {
      const dbError = new Error("Record to delete not found");
      mockPrismaService.character.delete.mockRejectedValue(dbError);

      await expect(service.remove("non-existent-id")).rejects.toThrow(
        "Record to delete not found",
      );
      expect(prisma.character.delete).toHaveBeenCalledTimes(1);
    });

    it("should handle cascade deletion of related records", async () => {
      // Prisma handles cascade automatically based on schema
      mockPrismaService.character.delete.mockResolvedValue(
        mockCharacterWithRelations,
      );

      await service.remove("test-id-123");

      expect(prisma.character.delete).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
      });
    });

    it("should handle database connection errors during deletion", async () => {
      const dbError = new Error("Connection lost during delete operation");
      mockPrismaService.character.delete.mockRejectedValue(dbError);

      await expect(service.remove("test-id-123")).rejects.toThrow(
        "Connection lost during delete operation",
      );
    });

    it("should handle invalid character ID format", async () => {
      const invalidId = "";
      const dbError = new Error("Invalid ID format");
      mockPrismaService.character.delete.mockRejectedValue(dbError);

      await expect(service.remove(invalidId)).rejects.toThrow(
        "Invalid ID format",
      );
    });
  });

  describe("Edge Cases - Complex Scenarios", () => {
    it("should handle character with all optional fields set to null", async () => {
      const characterWithNulls = {
        ...mockCharacter,
        physicalResistanceDomain: null,
        mentalResistanceDomain: null,
        defenseDomain: null,
        attackDomain: null,
        impactDomain: null,
      };

      mockPrismaService.character.findUnique.mockResolvedValue(
        characterWithNulls,
      );

      const result = await service.findOne("test-id-123");

      expect(result).toEqual(characterWithNulls);
      expect(result.physicalResistanceDomain).toBeNull();
    });

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

      mockPrismaService.character.update.mockResolvedValue(updatedCharacter);

      const result = await service.update("test-id-123", updateData);

      expect(result.isVisible).toBe(false);
      expect(prisma.character.update).toHaveBeenCalledWith({
        where: { id: "test-id-123" },
        data: expect.objectContaining({ isVisible: false }),
        include: expect.any(Object),
      });
    });
  });
});
