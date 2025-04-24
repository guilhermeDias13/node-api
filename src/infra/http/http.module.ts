import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthenticateSellerUseCase } from '@domain/marketplace/application/use-cases/authenticate-seller.use-case';
import { CountProductViewsUseCase } from '@domain/marketplace/application/use-cases/count-product-views.use-case';
import { CountSellerAvailableProductsUseCase } from '@domain/marketplace/application/use-cases/count-seller-available-products.use-case';
import { CountSellerSoldProductsUseCase } from '@domain/marketplace/application/use-cases/count-seller-sold-products.use-case';
import { CountSellerViewsPerDayUseCase } from '@domain/marketplace/application/use-cases/count-seller-views-per-day.use-case';
import { CountSellerViewsUseCase } from '@domain/marketplace/application/use-cases/count-seller-views.use-case';
import { EditProductUseCase } from '@domain/marketplace/application/use-cases/edit-product.use-case';
import { GetProductUseCase } from '@domain/marketplace/application/use-cases/get-product.use-case';
import { ListAllCategoriesUseCase } from '@domain/marketplace/application/use-cases/list-all-categories.use-case';
import { ListAllProductsUseCase } from '@domain/marketplace/application/use-cases/list-all-products.use-case';
import { ListAllSellerProductsUseCase } from '@domain/marketplace/application/use-cases/list-all-seller-products.use-case';
import { MarkSellAsAvailableUseCase } from '@domain/marketplace/application/use-cases/mark-sell-as-available.use-case';
import { MarkSellAsCancelledUseCase } from '@domain/marketplace/application/use-cases/mark-sell-as-cancelled.use-case';
import { MarkSellAsSoldUseCase } from '@domain/marketplace/application/use-cases/mark-sell-as-sold.use-case';
import { RegisterSellerUseCase } from '@domain/marketplace/application/use-cases/register-seller.use-case';
import { RegisterViewUseCase } from '@domain/marketplace/application/use-cases/register-view.use-case';
import { SellProductUseCase } from '@domain/marketplace/application/use-cases/sell-product.use-case';
import { SellerProfileUseCase } from '@domain/marketplace/application/use-cases/seller-profile.use-case';
import { UpdateSellerUseCase } from '@domain/marketplace/application/use-cases/update-seller.use-case';
import { UploadAttachmentUseCase } from '@domain/marketplace/application/use-cases/upload-attachments.use-case';

import { CryptographyModule } from '@infra/cryptography/cryptography.module';
import { DatabaseModule } from '@infra/database/database.module';
import { EnvModule } from '@infra/env/env.module';
import { AuthModule } from '@infra/http/auth/auth.module';
import { AuthenticateSellerController } from '@infra/http/controllers/authenticate-seller.controller';
import { ChangeProductStatusController } from '@infra/http/controllers/change-product-status.controller';
import { CountProductViewsController } from '@infra/http/controllers/count-product-views.controller';
import { CountSellerAvailableProductsController } from '@infra/http/controllers/count-seller-available-products.controller';
import { CountSellerSoldProductsController } from '@infra/http/controllers/count-seller-sold-products.controller';
import { CountSellerViewsPerDayController } from '@infra/http/controllers/count-seller-views-per-day.controller';
import { CountSellerViewsController } from '@infra/http/controllers/count-seller-views.controller';
import { EditProductController } from '@infra/http/controllers/edit-product.controller';
import { GetProductController } from '@infra/http/controllers/get-product.controller';
import { ListAllCategoriesController } from '@infra/http/controllers/list-all-categories.controller';
import { ListAllProductsController } from '@infra/http/controllers/list-all-products.controller';
import { ListAllSellerProductsController } from '@infra/http/controllers/list-all-seller-products.controller';
import { RegisterSellerController } from '@infra/http/controllers/register-seller.controller';
import { RegisterViewController } from '@infra/http/controllers/register-view.controller';
import { SellProductController } from '@infra/http/controllers/sell-product.controller';
import { SellerProfileController } from '@infra/http/controllers/seller-profile.controller';
import { SignOutController } from '@infra/http/controllers/sign-out.controller';
import { UpdateSellerController } from '@infra/http/controllers/update-seller.controller';
import { UploadAttachmentsController } from '@infra/http/controllers/upload-attachments.controller';
import { StorageModule } from '@infra/storage/storage.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'temp'),
      serveRoot: '/attachments',
    }),
    DatabaseModule,
    CryptographyModule,
    StorageModule,
    EnvModule,
    AuthModule,
  ],
  controllers: [
    RegisterSellerController,
    UpdateSellerController,
    SellerProfileController,
    CountSellerSoldProductsController,
    CountSellerAvailableProductsController,
    CountSellerViewsController,
    CountSellerViewsPerDayController,
    AuthenticateSellerController,
    SignOutController,

    ListAllSellerProductsController,
    SellProductController,
    ListAllProductsController,
    GetProductController,
    EditProductController,
    ChangeProductStatusController,
    RegisterViewController,
    CountProductViewsController,

    ListAllCategoriesController,
    UploadAttachmentsController,
  ],
  providers: [
    RegisterSellerUseCase,
    UpdateSellerUseCase,
    AuthenticateSellerUseCase,
    SellProductUseCase,
    ListAllCategoriesUseCase,
    EditProductUseCase,
    UploadAttachmentUseCase,
    MarkSellAsAvailableUseCase,
    MarkSellAsCancelledUseCase,
    MarkSellAsSoldUseCase,
    ListAllSellerProductsUseCase,
    RegisterViewUseCase,
    SellerProfileUseCase,
    CountSellerSoldProductsUseCase,
    CountSellerAvailableProductsUseCase,
    CountSellerViewsUseCase,
    CountSellerViewsPerDayUseCase,
    ListAllProductsUseCase,
    GetProductUseCase,
    CountProductViewsUseCase,
  ],
})
export class HttpModule {}
