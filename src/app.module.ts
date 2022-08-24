import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [SharedModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
