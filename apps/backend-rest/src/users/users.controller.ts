import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminChangePasswordDto } from "./dto/admin-change-password.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query("page") page?: string, @Query("limit") limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.usersService.findAll(pageNum, limitNum);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id/role")
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Param("id") id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(id, updateUserRoleDto.role);
  }

  @Patch(":id/profile")
  @ApiOperation({
    summary: "Update user profile information",
    description:
      "Update name, username, email, or language. Email updates require currentPassword.",
  })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  async updateProfile(
    @Param("id") id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }

  @Patch(":id/password")
  @ApiOperation({ summary: "Change user password" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  async changePassword(
    @Param("id") id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Patch(":id/reset-password")
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Admin: Change user password without current password",
  })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  async adminChangePassword(
    @Param("id") id: string,
    @Body() adminChangePasswordDto: AdminChangePasswordDto,
  ) {
    return this.usersService.adminChangePassword(id, adminChangePasswordDto);
  }
}
