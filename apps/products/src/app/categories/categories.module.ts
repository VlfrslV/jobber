import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
