import { Controller, Get, Patch, Delete, Param, Body, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers(); // Directly return the users without a success message
  }

  @Get('users/:id')
  async getUserById(@Param('id') userId: number) {
    const user = await this.adminService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Patch('users/:id')
  async changeUserRole(@Param('id') userId: number) {
    const updatedUser = await this.adminService.changeUserRole(userId);
    return { message: 'User role changed to admin successfully', user: updatedUser };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') userId: number) {
    await this.adminService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }

  // Public endpoint to register a user
  @Post('register')
  async registerUser(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.adminService.registerUser(username, password);
  }

  // Public endpoint to register an admin user
  @Post('register-admin')
  async registerAdmin(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.adminService.registerAdmin(username, password);
  }
}
