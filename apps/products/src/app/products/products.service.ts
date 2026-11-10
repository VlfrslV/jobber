import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../database/database-connection';
import * as productsSchema from './schema';

type Product = typeof productsSchema.products.$inferSelect;
type NewProduct = Omit<
  typeof productsSchema.products.$inferInsert,
  'id' | 'createdAt' | 'updatedAt'
>;

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof productsSchema>,
  ) {}

  async createProduct(product: NewProduct): Promise<Product> {
    const [created] = await this.database
      .insert(productsSchema.products)
      .values(product)
      .returning();
    return created;
  }

  async getProduct(id: number): Promise<Product> {
    const [product] = await this.database
      .select()
      .from(productsSchema.products)
      .where(eq(productsSchema.products.id, id))
      .limit(1);

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  async updateProduct(
    id: number,
    data: Partial<Pick<NewProduct, 'name' | 'description' | 'price'>>,
  ): Promise<Product> {
    const [updated] = await this.database
      .update(productsSchema.products)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(productsSchema.products.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return updated;
  }

  async deleteProduct(id: number): Promise<Product> {
    const [deleted] = await this.database
      .delete(productsSchema.products)
      .where(eq(productsSchema.products.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return deleted;
  }
}
