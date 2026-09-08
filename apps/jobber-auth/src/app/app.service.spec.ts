import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    service = app.get(AppService);
  });

  describe('getData', () => {
    it('should return "Hello API"', async () => {
      await expect(service.getData()).resolves.toEqual({
        message: 'Hello API',
      });
    });
  });
});
