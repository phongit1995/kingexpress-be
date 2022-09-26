import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingModel, SettingSchema } from 'src/models/setting.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: SettingModel.name, schema: SettingSchema }])],
  providers: [SettingService],
  controllers: [SettingController],
})
export class SettingModule {}
