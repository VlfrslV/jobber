import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Jobs } from '@jobber/nestjs';
import {
  ProductsLoadMessage,
  PulsarClient,
  PulsarConsumer,
} from '@jobber/pulsar';
import {
  Packages,
  PRODUCTS_SERVICE_NAME,
  ProductsServiceClient,
} from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoadProductsConsumer
  extends PulsarConsumer<ProductsLoadMessage>
  implements OnModuleInit
{
  private productsService: ProductsServiceClient;

  constructor(
    pulsarClient: PulsarClient,
    @Inject(Packages.PRODUCTS) private readonly client: ClientGrpc,
  ) {
    super(pulsarClient, Jobs.LOAD_PRODUCTS);
  }

  override async onModuleInit() {
    this.productsService = this.client.getService<ProductsServiceClient>(
      PRODUCTS_SERVICE_NAME,
    );
    await super.onModuleInit();
  }

  protected async onMessage(data: ProductsLoadMessage): Promise<void> {
    console.log(data);
    await firstValueFrom(
      this.productsService.createProduct({
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        rating: data.rating,
        description: data.description ?? '',
      }),
    );
  }
}
