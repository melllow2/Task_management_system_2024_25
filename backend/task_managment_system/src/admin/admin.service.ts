import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/role/role.enum'; // Ensure this import is correct

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // Change user role to admin
  async changeUserRole(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Promote the user to admin
    user.role = Role.ADMIN; // Change to Role.ADMIN
    return this.userRepository.save(user);
  }

  // Delete user and handle foreign key constraints
  async deleteUser(userId: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(userId);

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    } catch (error) {
      // Handle any database errors (e.g., foreign key constraint violations)
      throw new InternalServerErrorException('Failed to delete user', error.message);
    }
  }

  // Public function to register a new user
  async registerUser(username: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.role = Role.USER; // Default role 'user'

    return this.userRepository.save(newUser);
  }

  // Public function to register a new admin
  async registerAdmin(username: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User();
    newAdmin.username = username;
    newAdmin.password = hashedPassword;
    newAdmin.role = Role.ADMIN; // Assign role 'admin'

    return this.userRepository.save(newAdmin);
  }
}
