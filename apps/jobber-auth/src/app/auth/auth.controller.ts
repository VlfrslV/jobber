import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from '@jobber/types';
import { Controller, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/models/users.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { TokenPayload } from './token-payload.interface';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  async authenticate(
    request: AuthenticateRequest & { user: TokenPayload },
  ): Promise<User> {
    console.log(request);
    const user = await this.usersService.getUser({ id: request.user.userId });
    return { id: user.id, email: user.email };
  }
}
