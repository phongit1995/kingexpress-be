import { Module } from '@nestjs/common';
import { RakutenController } from './rakuten.controller';
import { RakutenService } from './rakuten.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RakutenController],
  providers: [RakutenService],
})
export class RakutenModule {}
