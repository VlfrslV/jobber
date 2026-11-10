import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as categoriesSchema from './schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof categoriesSchema>,
  ) {}

  async getCategoryByName(name: string) {
    return this.database.query.categories.findFirst({
      where: eq(categoriesSchema.categories.name, name),
    });
  }
}
