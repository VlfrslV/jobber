import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  async getData(): Promise<{ message: string }> {
    const users = await this.prismaService.user.findMany();
    return { message: 'Hello API' };
  }
}
