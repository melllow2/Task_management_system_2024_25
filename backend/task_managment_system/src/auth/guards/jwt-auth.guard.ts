import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// This class uses the built-in Passport JWT strategy, which is registered in your `JwtStrategy` file.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
