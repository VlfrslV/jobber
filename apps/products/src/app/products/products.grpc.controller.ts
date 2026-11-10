import { Controller, UseInterceptors } from '@nestjs/common';
import {
  CreateProductRequest,
  CreateProductResponse,
  DeleteProductRequest,
  DeleteProductResponse,
  GetProductRequest,
  GetProductResponse,
  GrpcLoggingInterceptor,
  ProductsServiceController,
  ProductsServiceControllerMethods,
  UpdateProductRequest,
  UpdateProductResponse,
} from '@jobber/grpc';
import { ProductsService } from './products.service';

@Controller()
@ProductsServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class ProductsGrpcController implements ProductsServiceController {
  constructor(private readonly productsService: ProductsService) {}

  async createProduct(
    request: CreateProductRequest,
  ): Promise<CreateProductResponse> {
    await this.productsService.createProduct({
      name: request.name,
      category: request.category,
      price: String(request.price),
      stock: request.stock,
      description: request.description || null,
    });
    return {};
  }

  async getProduct(request: GetProductRequest): Promise<GetProductResponse> {
    const product = await this.productsService.getProduct(Number(request.id));
    return {
      id: String(product.id),
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
    };
  }

  async updateProduct(
    request: UpdateProductRequest,
  ): Promise<UpdateProductResponse> {
    const product = await this.productsService.updateProduct(
      Number(request.id),
      {
        ...(request.name ? { name: request.name } : {}),
        ...(request.description ? { description: request.description } : {}),
        ...(request.price ? { price: request.price } : {}),
      },
    );
    return { id: String(product.id) };
  }

  async deleteProduct(
    request: DeleteProductRequest,
  ): Promise<DeleteProductResponse> {
    const product = await this.productsService.deleteProduct(
      Number(request.id),
    );
    return { id: String(product.id) };
  }
}
