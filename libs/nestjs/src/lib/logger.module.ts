import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import type { IncomingMessage } from 'http';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : { target: 'pino-pretty', options: { singleLine: true } },
            level: isProduction ? 'info' : 'debug',
            genReqId: (req: IncomingMessage) =>
              req.headers['x-request-id']?.toString() ?? randomUUID(),
            customProps: (req: IncomingMessage) => ({
              requestId: req.id,
            }),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
