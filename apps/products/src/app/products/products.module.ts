import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsGrpcController } from './products.grpc.controller';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  providers: [ProductsService],
  controllers: [ProductsController, ProductsGrpcController],
})
export class ProductsModule {}
