import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './modules/product/product.module';
import { ShoppingModule } from './modules/shopping/shopping.module';
import { SettingModule } from './modules/setting/setting.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/config/config.validate';
import { RakutenModule } from './modules/rakuten/rakuten.module';
import { MercariModule } from './modules/mercari/mercari.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<EnvironmentVariables>) => {
        return {
          uri: config.get('MONGO_URL'),
        };
      },
      inject: [ConfigService],
    }),
    SharedModule,
    ProductModule,
    ShoppingModule,
    SettingModule,
    UserModule,
    RakutenModule,
    MercariModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
