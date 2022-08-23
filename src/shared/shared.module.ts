import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { envValidate } from 'src/common/config/config.validate';
import { AllExceptionsFilter } from 'src/common/config/exceptions.filter';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: envValidate,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule {}
