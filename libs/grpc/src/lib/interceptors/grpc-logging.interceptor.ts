import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { randomUUID } from 'crypto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable, tap } from 'rxjs';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(GrpcLoggingInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'rpc') {
      return next.handle();
    }

    const handler = context.getHandler().name;
    const data = context.switchToRpc().getData();
    const metadata = context.switchToRpc().getContext<Metadata>();
    const existingId = metadata?.get?.('x-request-id')?.[0]?.toString();
    const requestId = existingId ?? randomUUID();

    if (!existingId && metadata?.set) {
      metadata.set('x-request-id', requestId);
    }

    const start = Date.now();

    this.logger.info({ requestId, data }, `gRPC ${handler} started`);

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info(
            { requestId, durationMs: Date.now() - start },
            `gRPC ${handler} completed`,
          );
        },
        error: (error: Error) => {
          this.logger.error(
            {
              requestId,
              durationMs: Date.now() - start,
              err: error,
            },
            `gRPC ${handler} failed`,
          );
        },
      }),
    );
  }
}
