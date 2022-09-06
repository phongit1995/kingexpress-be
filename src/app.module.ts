import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './modules/product/product.module';
import { ShoppingModule } from './modules/shopping/shopping.module';

@Module({
  imports: [SharedModule, ProductModule, ShoppingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
