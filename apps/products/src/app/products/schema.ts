import {
  pgTable,
  serial,
  text,
  numeric,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: numeric('price').notNull(),
  stock: integer('stock').notNull(),
  description: text('description'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
