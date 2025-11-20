import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { EssencesService } from "./essences.service";

describe("EssencesService", () => {
  let service: EssencesService;
  let prismaService: PrismaService;

  const mockCharacter = {
    id: "test-character-id",
    characterName: "Test Character",
  };

  const mockEssence = {
    id: "test-essence-id",
    characterId: "test-character-id",
    text: "A brave warrior",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EssencesService,
        {
          provide: PrismaService,
          useValue: {
            essence: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              createMany: jest.fn(),
              deleteMany: jest.fn(),
            },
            character: {
              findUnique: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EssencesService>(EssencesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create an essence", async () => {
      jest
        .spyOn(prismaService.character, "findUnique")
        .mockResolvedValue(mockCharacter as any);
      jest
        .spyOn(prismaService.essence, "create")
        .mockResolvedValue(mockEssence as any);

      const result = await service.create({
        characterId: "test-character-id",
        text: "A brave warrior",
      });

      expect(result).toEqual(mockEssence);
      expect(prismaService.character.findUnique).toHaveBeenCalledWith({
        where: { id: "test-character-id" },
      });
    });

    it("should throw NotFoundException if character does not exist", async () => {
      jest.spyOn(prismaService.character, "findUnique").mockResolvedValue(null);

      await expect(
        service.create({
          characterId: "non-existent-id",
          text: "A brave warrior",
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByCharacter", () => {
    it("should return all essences for a character", async () => {
      const mockEssences = [mockEssence];
      jest
        .spyOn(prismaService.essence, "findMany")
        .mockResolvedValue(mockEssences as any);

      const result = await service.findByCharacter("test-character-id");

      expect(result).toEqual(mockEssences);
      expect(prismaService.essence.findMany).toHaveBeenCalledWith({
        where: { characterId: "test-character-id" },
        orderBy: { createdAt: "asc" },
      });
    });
  });

  describe("findOne", () => {
    it("should return a single essence", async () => {
      jest
        .spyOn(prismaService.essence, "findUnique")
        .mockResolvedValue({ ...mockEssence, character: mockCharacter } as any);

      const result = await service.findOne("test-essence-id");

      expect(result).toEqual({ ...mockEssence, character: mockCharacter });
    });

    it("should throw NotFoundException if essence does not exist", async () => {
      jest.spyOn(prismaService.essence, "findUnique").mockResolvedValue(null);

      await expect(service.findOne("non-existent-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("update", () => {
    it("should update an essence", async () => {
      const updatedEssence = { ...mockEssence, text: "Updated text" };
      jest
        .spyOn(prismaService.essence, "findUnique")
        .mockResolvedValue({ ...mockEssence, character: mockCharacter } as any);
      jest
        .spyOn(prismaService.essence, "update")
        .mockResolvedValue(updatedEssence as any);

      const result = await service.update("test-essence-id", {
        text: "Updated text",
      });

      expect(result).toEqual(updatedEssence);
    });
  });

  describe("remove", () => {
    it("should delete an essence", async () => {
      jest
        .spyOn(prismaService.essence, "findUnique")
        .mockResolvedValue({ ...mockEssence, character: mockCharacter } as any);
      jest
        .spyOn(prismaService.essence, "delete")
        .mockResolvedValue(mockEssence as any);

      const result = await service.remove("test-essence-id");

      expect(result).toEqual(mockEssence);
    });
  });

  describe("replaceAll", () => {
    it("should replace all essences for a character", async () => {
      const newTexts = ["Essence 1", "Essence 2"];
      jest
        .spyOn(prismaService.character, "findUnique")
        .mockResolvedValue(mockCharacter as any);
      jest
        .spyOn(prismaService, "$transaction")
        .mockImplementation(async (callback) => {
          return callback({
            essence: {
              deleteMany: jest.fn(),
              createMany: jest.fn(),
              findMany: jest.fn().mockResolvedValue([
                { ...mockEssence, text: "Essence 1" },
                { ...mockEssence, text: "Essence 2", id: "test-essence-id-2" },
              ]),
            },
          });
        });

      const result = await service.replaceAll("test-character-id", newTexts);

      expect(result).toHaveLength(2);
    });
  });
});
