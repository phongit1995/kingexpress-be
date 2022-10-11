import { Module } from '@nestjs/common';
import { MercariService } from './mercari.service';
import { MercariController } from './mercari.controller';

@Module({
  providers: [MercariService],
  controllers: [MercariController],
})
export class MercariModule {}
