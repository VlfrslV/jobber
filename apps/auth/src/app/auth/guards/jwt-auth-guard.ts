import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      return context.switchToRpc().getData();
    }

    return context.switchToHttp().getRequest();
  }
}
