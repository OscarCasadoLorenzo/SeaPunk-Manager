import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { AdminChangePasswordDto } from "./dto/admin-change-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        language: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const { currentPassword, email, username, ...otherFields } =
      updateProfileDto;

    // If updating email, password verification is required
    if (email) {
      if (!currentPassword) {
        throw new BadRequestException(
          "Current password is required to update email",
        );
      }

      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new UnauthorizedException("User not found");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Current password is incorrect");
      }

      // Check if email is already taken
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("Email is already in use");
      }
    }

    // Check if username is already taken
    if (username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("Username is already taken");
      }
    }

    // Build update data (exclude currentPassword from db update)
    const updateData: any = { ...otherFields };
    if (email) updateData.email = email;
    if (username) updateData.username = username;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        language: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: "Password changed successfully" };
  }

  async adminChangePassword(
    id: string,
    adminChangePasswordDto: AdminChangePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      adminChangePasswordDto.password,
      12,
    );

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: "Password changed successfully by admin" };
  }
}
