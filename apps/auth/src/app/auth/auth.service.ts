import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { UsersService } from '../users/models/users.service';
import { LoginInput } from './dto/login.input';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginInput, response: Response) {
    const user = await this.verifyUser(email, password);

    const expiresMs = parseInt(
      this.configService.getOrThrow('JWT_EXPIRATION_MS'),
      10,
    );
    const expires = new Date(Date.now() + expiresMs);

    const tokenPayload: TokenPayload = { userId: user.id };
    const accessToken = await this.jwtService.signAsync(tokenPayload);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires,
    });

    return user;
  }

  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await compare(password, user.password);

      if (!authenticated) {
        throw new UnauthorizedException();
      }

      return user;
    } catch {
      throw new UnauthorizedException('Creds are not valid');
    }
  }
}
