import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEssenceDto } from "./dto/create-essence.dto";
import { UpdateEssenceDto } from "./dto/update-essence.dto";

@Injectable()
export class EssencesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new essence for a character
   */
  async create(createEssenceDto: CreateEssenceDto) {
    const { characterId, text } = createEssenceDto;

    // Verify character exists
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    return this.prisma.essence.create({
      data: {
        characterId,
        text,
      },
    });
  }

  /**
   * Get all essences for a specific character
   */
  async findByCharacter(characterId: string) {
    return this.prisma.essence.findMany({
      where: { characterId },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Get a single essence by ID
   */
  async findOne(id: string) {
    const essence = await this.prisma.essence.findUnique({
      where: { id },
      include: { character: true },
    });

    if (!essence) {
      throw new NotFoundException(`Essence with ID ${id} not found`);
    }

    return essence;
  }

  /**
   * Update an essence
   */
  async update(id: string, updateEssenceDto: UpdateEssenceDto) {
    // Verify essence exists
    await this.findOne(id);

    return this.prisma.essence.update({
      where: { id },
      data: updateEssenceDto,
    });
  }

  /**
   * Delete an essence
   */
  async remove(id: string) {
    // Verify essence exists
    await this.findOne(id);

    return this.prisma.essence.delete({
      where: { id },
    });
  }

  /**
   * Create multiple essences for a character at once
   */
  async createMany(characterId: string, texts: string[]) {
    // Verify character exists
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Validate text length
    const invalidTexts = texts.filter((text) => text.length > 200);
    if (invalidTexts.length > 0) {
      throw new BadRequestException(
        "One or more essence texts exceed 200 characters",
      );
    }

    const essences = texts.map((text) => ({
      characterId,
      text,
    }));

    await this.prisma.essence.createMany({
      data: essences,
    });

    return this.findByCharacter(characterId);
  }

  /**
   * Replace all essences for a character
   */
  async replaceAll(characterId: string, texts: string[]) {
    // Verify character exists
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Validate text length
    const invalidTexts = texts.filter((text) => text.length > 200);
    if (invalidTexts.length > 0) {
      throw new BadRequestException(
        "One or more essence texts exceed 200 characters",
      );
    }

    // Delete existing essences and create new ones in a transaction
    return this.prisma.$transaction(async (tx) => {
      await tx.essence.deleteMany({
        where: { characterId },
      });

      if (texts.length > 0) {
        const essences = texts.map((text) => ({
          characterId,
          text,
        }));

        await tx.essence.createMany({
          data: essences,
        });
      }

      return tx.essence.findMany({
        where: { characterId },
        orderBy: { createdAt: "asc" },
      });
    });
  }
}
