import { Test, TestingModule } from "@nestjs/testing";
import { Character } from "@prisma/client";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";

describe("CharactersController", () => {
  let controller: CharactersController;
  let service: CharactersService;

  const mockCharacter: Character = {
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

  const mockCharactersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: mockCharactersService,
        },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of characters", async () => {
      const mockCharacters = [mockCharacter];
      mockCharactersService.findAll.mockResolvedValue(mockCharacters);

      const result = await controller.findAll();

      expect(result).toEqual(mockCharacters);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it("should return an empty array when no characters exist", async () => {
      mockCharactersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return multiple characters", async () => {
      const mockCharacters = [
        mockCharacter,
        {
          ...mockCharacter,
          id: "test-id-456",
          characterName: "Second Character",
        },
        {
          ...mockCharacter,
          id: "test-id-789",
          characterName: "Third Character",
        },
      ];
      mockCharactersService.findAll.mockResolvedValue(mockCharacters);

      const result = await controller.findAll();

      expect(result).toHaveLength(3);
      expect(result).toEqual(mockCharacters);
    });

    it("should propagate service errors", async () => {
      const error = new Error("Database connection failed");
      mockCharactersService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(
        "Database connection failed",
      );
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("findOne", () => {
    it("should return a single character by id", async () => {
      mockCharactersService.findOne.mockResolvedValue(mockCharacter);

      const result = await controller.findOne("test-id-123");

      expect(result).toEqual(mockCharacter);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith("test-id-123");
    });

    it("should return null when character does not exist", async () => {
      mockCharactersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne("non-existent-id");

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith("non-existent-id");
    });

    it("should handle different valid UUID formats", async () => {
      const validUUIDs = [
        "cld1234567890abcdefghijk",
        "abc-def-ghi",
        "test-uuid-format",
      ];

      for (const uuid of validUUIDs) {
        mockCharactersService.findOne.mockResolvedValue({
          ...mockCharacter,
          id: uuid,
        });

        const result = await controller.findOne(uuid);

        expect(service.findOne).toHaveBeenCalledWith(uuid);
        expect(result.id).toBe(uuid);
      }
    });

    it("should propagate service errors for invalid ids", async () => {
      const error = new Error("Invalid UUID format");
      mockCharactersService.findOne.mockRejectedValue(error);

      await expect(controller.findOne("invalid-uuid")).rejects.toThrow(
        "Invalid UUID format",
      );
      expect(service.findOne).toHaveBeenCalledWith("invalid-uuid");
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database timeout");
      mockCharactersService.findOne.mockRejectedValue(dbError);

      await expect(controller.findOne("test-id-123")).rejects.toThrow(
        "Database timeout",
      );
    });
  });

  describe("create", () => {
    it("should create a new character with all required fields", async () => {
      const createDto: Omit<Character, "id"> = {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdCharacter: Character = {
        id: "new-id-123",
        ...createDto,
      };

      mockCharactersService.create.mockResolvedValue(createdCharacter);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdCharacter);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it("should create a character with optional fields set", async () => {
      const createDto: any = {
        characterName: "Character with Domains",
        archetype: "Ranger",
        faction: "Neutral",
        race: "Orc",
        level: 3,
        epicPoints: 50,
        type: "Companion",
        userId: "user-id-789",
      };

      const createdCharacter: Character = {
        id: "new-id-456",
        ...createDto,
        isNPC: false,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCharactersService.create.mockResolvedValue(createdCharacter);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdCharacter);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it("should handle creation with nested relations", async () => {
      const createDtoWithRelations: any = {
        characterName: "Complex Character",
        archetype: "Paladin",
        faction: "Order",
        race: "Human",
        level: 10,
        epicPoints: 1000,
        type: "Boss",
        userId: "user-id-999",
        attributes: {
          strength: 15,
          agility: 10,
          willpower: 12,
          luck: 5,
          intelligence: 8,
        },
        domains: {
          physical: 5,
          mental: 4,
        },
        combatStats: {
          physicalHealth: 200,
          maxPhysicalHealth: 200,
        },
      };

      const createdCharacter: any = {
        id: "complex-id-123",
        ...createDtoWithRelations,
        isNPC: false,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCharactersService.create.mockResolvedValue(createdCharacter);

      const result = await controller.create(createDtoWithRelations);

      expect(result).toEqual(createdCharacter);
      expect(service.create).toHaveBeenCalledWith(createDtoWithRelations);
    });

    it("should propagate validation errors", async () => {
      const invalidDto: any = {
        characterName: "", // Invalid empty name
      };

      const validationError = new Error("Validation failed");
      mockCharactersService.create.mockRejectedValue(validationError);

      await expect(controller.create(invalidDto)).rejects.toThrow(
        "Validation failed",
      );
      expect(service.create).toHaveBeenCalledWith(invalidDto);
    });

    it("should handle foreign key constraint errors", async () => {
      const dtoWithInvalidUser: any = {
        characterName: "Orphan Character",
        userId: "non-existent-user-id",
      };

      const fkError = new Error("Foreign key constraint failed");
      mockCharactersService.create.mockRejectedValue(fkError);

      await expect(controller.create(dtoWithInvalidUser)).rejects.toThrow(
        "Foreign key constraint failed",
      );
    });

    it("should handle database connection errors during creation", async () => {
      const createDto: any = { characterName: "Test" };
      const dbError = new Error("Connection pool exhausted");
      mockCharactersService.create.mockRejectedValue(dbError);

      await expect(controller.create(createDto)).rejects.toThrow(
        "Connection pool exhausted",
      );
    });
  });

  describe("update", () => {
    it("should update a character with partial data", async () => {
      const updateDto = {
        characterName: "Updated Name",
        level: 10,
      };

      const updatedCharacter: Character = {
        ...mockCharacter,
        ...updateDto,
        updatedAt: new Date("2025-01-02"),
      };

      mockCharactersService.update.mockResolvedValue(updatedCharacter);

      const result = await controller.update("test-id-123", updateDto);

      expect(result).toEqual(updatedCharacter);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith("test-id-123", updateDto);
    });

    it("should update only one field", async () => {
      const updateDto = { isVisible: false };
      const updatedCharacter: Character = {
        ...mockCharacter,
        isVisible: false,
      };

      mockCharactersService.update.mockResolvedValue(updatedCharacter);

      const result = await controller.update("test-id-123", updateDto);

      expect(result.isVisible).toBe(false);
      expect(service.update).toHaveBeenCalledWith("test-id-123", updateDto);
    });

    it("should update nested relations", async () => {
      const updateDto = {
        attributes: {
          update: {
            strength: 20,
            intelligence: 15,
          },
        },
        combatStats: {
          update: {
            physicalHealth: 150,
            maxPhysicalHealth: 200,
          },
        },
      };

      const updatedCharacter: any = {
        ...mockCharacter,
        attributes: updateDto.attributes.update,
        combatStats: updateDto.combatStats.update,
      };

      mockCharactersService.update.mockResolvedValue(updatedCharacter);

      const result = await controller.update("test-id-123", updateDto);

      expect(result).toEqual(updatedCharacter);
      expect(service.update).toHaveBeenCalledWith("test-id-123", updateDto);
    });

    it("should handle updating non-existent character", async () => {
      const updateDto = { level: 5 };
      const error = new Error("Record to update not found");
      mockCharactersService.update.mockRejectedValue(error);

      await expect(
        controller.update("non-existent-id", updateDto),
      ).rejects.toThrow("Record to update not found");
      expect(service.update).toHaveBeenCalledWith("non-existent-id", updateDto);
    });

    it("should handle empty update object", async () => {
      const emptyUpdate = {};
      mockCharactersService.update.mockResolvedValue(mockCharacter);

      const result = await controller.update("test-id-123", emptyUpdate);

      expect(result).toEqual(mockCharacter);
      expect(service.update).toHaveBeenCalledWith("test-id-123", emptyUpdate);
    });

    it("should update with complex nested data", async () => {
      const complexUpdate = {
        characterName: "New Name",
        level: 15,
        epicPoints: 2000,
        attributes: {
          update: { strength: 25 },
        },
        domains: {
          physical: 10,
          mental: 8,
        },
        narrative: {
          update: {
            backstory: "A hero reborn",
          },
        },
      };

      const updatedCharacter: any = {
        ...mockCharacter,
        ...complexUpdate,
      };

      mockCharactersService.update.mockResolvedValue(updatedCharacter);

      const result = await controller.update("test-id-123", complexUpdate);

      expect(result).toEqual(updatedCharacter);
      expect(service.update).toHaveBeenCalledWith("test-id-123", complexUpdate);
    });

    it("should handle concurrent update conflicts", async () => {
      const updateDto = { level: 5 };
      const concurrencyError = new Error(
        "Record has been modified by another transaction",
      );
      mockCharactersService.update.mockRejectedValue(concurrencyError);

      await expect(controller.update("test-id-123", updateDto)).rejects.toThrow(
        "Record has been modified by another transaction",
      );
    });

    it("should handle validation errors for invalid data types", async () => {
      const invalidUpdate = {
        level: "not-a-number" as any,
      };

      const validationError = new Error("Invalid input type");
      mockCharactersService.update.mockRejectedValue(validationError);

      await expect(
        controller.update("test-id-123", invalidUpdate),
      ).rejects.toThrow("Invalid input type");
    });
  });

  describe("remove", () => {
    it("should successfully delete a character", async () => {
      mockCharactersService.remove.mockResolvedValue(undefined);

      await controller.remove("test-id-123");

      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith("test-id-123");
    });

    it("should handle deletion of non-existent character", async () => {
      const error = new Error("Record to delete not found");
      mockCharactersService.remove.mockRejectedValue(error);

      await expect(controller.remove("non-existent-id")).rejects.toThrow(
        "Record to delete not found",
      );
      expect(service.remove).toHaveBeenCalledWith("non-existent-id");
    });

    it("should handle multiple deletions sequentially", async () => {
      const idsToDelete = ["id-1", "id-2", "id-3"];
      mockCharactersService.remove.mockResolvedValue(undefined);

      for (const id of idsToDelete) {
        await controller.remove(id);
      }

      expect(service.remove).toHaveBeenCalledTimes(3);
      expect(service.remove).toHaveBeenCalledWith("id-1");
      expect(service.remove).toHaveBeenCalledWith("id-2");
      expect(service.remove).toHaveBeenCalledWith("id-3");
    });

    it("should propagate database errors during deletion", async () => {
      const dbError = new Error("Connection lost during delete operation");
      mockCharactersService.remove.mockRejectedValue(dbError);

      await expect(controller.remove("test-id-123")).rejects.toThrow(
        "Connection lost during delete operation",
      );
    });

    it("should handle invalid character ID format", async () => {
      const invalidId = "";
      const error = new Error("Invalid ID format");
      mockCharactersService.remove.mockRejectedValue(error);

      await expect(controller.remove(invalidId)).rejects.toThrow(
        "Invalid ID format",
      );
      expect(service.remove).toHaveBeenCalledWith(invalidId);
    });

    it("should handle foreign key constraint errors on deletion", async () => {
      const fkError = new Error(
        "Cannot delete character with existing references",
      );
      mockCharactersService.remove.mockRejectedValue(fkError);

      await expect(controller.remove("test-id-123")).rejects.toThrow(
        "Cannot delete character with existing references",
      );
    });
  });

  describe("Edge Cases - Controller Integration", () => {
    it("should handle service returning undefined", async () => {
      mockCharactersService.findOne.mockResolvedValue(undefined);

      const result = await controller.findOne("test-id-123");

      expect(result).toBeUndefined();
    });

    it("should handle service timeout errors", async () => {
      const timeoutError = new Error("Operation timed out");
      mockCharactersService.findAll.mockRejectedValue(timeoutError);

      await expect(controller.findAll()).rejects.toThrow("Operation timed out");
    });

    it("should maintain proper separation of concerns", async () => {
      // Controller should delegate all business logic to service
      mockCharactersService.findAll.mockResolvedValue([mockCharacter]);

      await controller.findAll();

      // Verify controller only calls service, doesn't do any data manipulation
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
