import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { Role } from './role/role.enum'; // Corrected import path


@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto): Promise<void> {
    const { username, password, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    await this.userRepository.createUser({ username, password });
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; role: Role }> {
    const { username, password } = authCredentialsDto;

    // Check if user exists in the database
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    // Get the user's role
    const role = user.role;

    // Create a JWT payload with username and role
    const payload: JwtPayload = { username, role };

    // Generate the access token
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    // Return the token and the role to help with redirection on the frontend
    return { accessToken, role };
  }
}
