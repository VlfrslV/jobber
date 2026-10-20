import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from '@jobber/grpc';
import { Metadata } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, Observable, of } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;
  private readonly logger = new Logger(GqlAuthGuard.name);
  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = this.getRequest(context);
    const token = req.cookies?.Authentication;

    if (!token) return false;

    const metadata = new Metadata();
    const requestId = req.headers['x-request-id'] ?? req.id;
    if (requestId) {
      metadata.set('x-request-id', String(requestId));
    }

    return (
      this.authService.authenticate as (
        request: { token: string },
        metadata?: Metadata,
      ) => Observable<{ id: number; email: string }>
    )({ token }, metadata).pipe(
      map((res) => {
        req.user = res;
        this.logger.log(res);
        return true;
      }),
      catchError((err) => {
        this.logger.log(err);
        return of(false);
      }),
    );
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
