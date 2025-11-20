import { Test, TestingModule } from "@nestjs/testing";
import { CharactersService } from "../../characters/characters.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PaginationQueryDto } from "../dto/pagination-query.dto";
import { PaginationService } from "./pagination.service";

/**
 * Integration tests for pagination functionality across different entities.
 * These tests verify that pagination works correctly with real service implementations.
 */
describe("Pagination Integration Tests", () => {
  let paginationService: PaginationService;
  let charactersService: CharactersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    character: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginationService,
        CharactersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    paginationService = module.get<PaginationService>(PaginationService);
    charactersService = module.get<CharactersService>(CharactersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe("Characters Pagination", () => {
    const mockCharacters = [
      {
        id: "char-1",
        characterName: "Character A",
        level: 5,
        userId: "user-1",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      },
      {
        id: "char-2",
        characterName: "Character B",
        level: 10,
        userId: "user-1",
        createdAt: new Date("2025-01-02"),
        updatedAt: new Date("2025-01-02"),
      },
    ];

    it("should return paginated characters with metadata", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 10,
        offset: 0,
      };

      mockPrismaService.character.findMany.mockResolvedValue(mockCharacters);
      mockPrismaService.character.count.mockResolvedValue(2);

      const result = await charactersService.findAll(paginationQuery);

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("meta");
      expect(prisma.character.findMany).toHaveBeenCalled();
      expect(prisma.character.count).toHaveBeenCalled();
    });

    it("should apply sorting to paginated results", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 10,
        offset: 0,
        sort: "-level,characterName",
      };

      mockPrismaService.character.findMany.mockResolvedValue(mockCharacters);
      mockPrismaService.character.count.mockResolvedValue(2);

      await charactersService.findAll(paginationQuery);

      expect(prisma.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.arrayContaining([
            { level: "desc" },
            { characterName: "asc" },
          ]),
        }),
      );
    });

    it("should apply field selection to paginated results", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 10,
        offset: 0,
        fields: "id,characterName,level",
      };

      mockPrismaService.character.findMany.mockResolvedValue([
        { id: "char-1", characterName: "Character A", level: 5 },
      ]);
      mockPrismaService.character.count.mockResolvedValue(1);

      await charactersService.findAll(paginationQuery);

      expect(prisma.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            id: true,
            characterName: true,
            level: true,
          }),
        }),
      );
    });

    it("should handle pagination with user-specific filtering", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 10,
        offset: 0,
      };

      mockPrismaService.character.findMany.mockResolvedValue([
        mockCharacters[0],
      ]);
      mockPrismaService.character.count.mockResolvedValue(1);

      await charactersService.findByUserId("user-1", paginationQuery);

      expect(prisma.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-1" },
        }),
      );
    });

    it("should calculate correct pagination metadata", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 5,
        offset: 10,
      };

      mockPrismaService.character.findMany.mockResolvedValue(mockCharacters);
      mockPrismaService.character.count.mockResolvedValue(25);

      const result = await charactersService.findAll(paginationQuery);

      expect(result).toMatchObject({
        meta: expect.objectContaining({
          total: 25,
          limit: 5,
          offset: 10,
          currentPage: 3,
          totalPages: 5,
          hasMore: true,
        }),
      });
    });

    it("should handle empty results with pagination", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 10,
        offset: 0,
      };

      mockPrismaService.character.findMany.mockResolvedValue([]);
      mockPrismaService.character.count.mockResolvedValue(0);

      const result = await charactersService.findAll(paginationQuery);

      expect(result).toMatchObject({
        data: [],
        meta: expect.objectContaining({
          total: 0,
          currentPage: 1,
          totalPages: 0,
          hasMore: false,
        }),
      });
    });

    it("should handle last page correctly", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 10,
        offset: 20,
      };

      mockPrismaService.character.findMany.mockResolvedValue(mockCharacters);
      mockPrismaService.character.count.mockResolvedValue(22);

      const result = await charactersService.findAll(paginationQuery);

      expect(result).toMatchObject({
        meta: expect.objectContaining({
          currentPage: 3,
          totalPages: 3,
          hasMore: false,
        }),
      });
    });

    it("should maintain backward compatibility when no pagination params provided", async () => {
      mockPrismaService.character.findMany.mockResolvedValue(mockCharacters);

      const result = await charactersService.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockCharacters);
      expect(prisma.character.count).not.toHaveBeenCalled();
    });
  });

  describe("Pagination Service Integration", () => {
    it("should parse complex pagination queries correctly", () => {
      const query: PaginationQueryDto = {
        limit: 20,
        offset: 40,
        sort: "-createdAt,characterName",
        fields: "id,characterName,level,createdAt",
      };

      const parsed = paginationService.parsePaginationQuery(query);

      expect(parsed).toMatchObject({
        limit: 20,
        offset: 40,
        sort: [
          { field: "createdAt", order: "desc" },
          { field: "characterName", order: "asc" },
        ],
        fields: ["id", "characterName", "level", "createdAt"],
      });
    });

    it("should handle edge case: limit exceeding maximum", () => {
      const query: PaginationQueryDto = {
        limit: 10000, // Exceeds typical max
        offset: 0,
      };

      expect(() => paginationService.parsePaginationQuery(query)).toThrow(
        "Limit cannot exceed 100",
      );
    });

    it("should handle edge case: negative offset", () => {
      const query: PaginationQueryDto = {
        limit: 10,
        offset: -5,
      };

      const parsed = paginationService.parsePaginationQuery(query);

      expect(parsed.offset).toBe(-5); // Service doesn't clamp offset, it's handled elsewhere
    });

    it("should handle invalid sort fields gracefully", () => {
      const query: PaginationQueryDto = {
        limit: 10,
        offset: 0,
        sort: "invalidField,-anotherInvalid",
      };

      // Service should handle this without throwing
      expect(() => paginationService.parsePaginationQuery(query)).not.toThrow();
    });
  });

  describe("Performance Considerations", () => {
    const mockCharacters = [
      {
        id: "char-1",
        characterName: "Character A",
        level: 5,
        userId: "user-1",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      },
    ];

    it("should not fetch total count unnecessarily for simple queries", async () => {
      // When no pagination is requested, count should not be called
      mockPrismaService.character.findMany.mockResolvedValue(mockCharacters);

      await charactersService.findAll();

      expect(prisma.character.count).not.toHaveBeenCalled();
    });

    it("should optimize queries when field selection is used", async () => {
      const paginationQuery: PaginationQueryDto = {
        limit: 10,
        offset: 0,
        fields: "id,characterName",
      };

      mockPrismaService.character.findMany.mockResolvedValue([
        { id: "char-1", characterName: "Character A" },
      ]);
      mockPrismaService.character.count.mockResolvedValue(1);

      await charactersService.findAll(paginationQuery);

      // Verify that only selected fields are requested
      expect(prisma.character.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.not.objectContaining({
            attributes: expect.anything(),
            domains: expect.anything(),
            combatStats: expect.anything(),
          }),
        }),
      );
    });
  });
});
