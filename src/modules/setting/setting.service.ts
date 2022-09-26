import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, set } from 'mongoose';
import { SettingDocument, SettingModel } from 'src/models/setting.model';
import { UpdateSettingGlobalDto } from './dto/update-setting.dto';

@Injectable()
export class SettingService {
  constructor(@InjectModel(SettingModel.name) private readonly settingModel: Model<SettingDocument>) {}
  async getGlobalSetting() {
    let setting = await this.settingModel.findOne();
    if (setting) {
      return setting;
    }
    setting = await this.settingModel.create({
      exchangeRate: 220,
      address: 'B13-T59 đường gom Pháp Vân, Hoàng Liệt, Hoàng Mai, Hà Nộ',
      email: 'kingexpress@gmail.com',
      urlFacebook: 'https://www.facebook.com/n.tuan.kiet.1410',
      hotline: '0354216821',
      urlManage: 'https://kimlongexpress.vn/auth?token=',
    });
    return setting;
  }

  async updateSettingGlobal(updateSettingGlobalDto: UpdateSettingGlobalDto) {
    let setting = await this.settingModel.findOne();
    if (!setting) {
      setting = await this.settingModel.create({
        exchangeRate: 220,
        address: 'B13-T59 đường gom Pháp Vân, Hoàng Liệt, Hoàng Mai, Hà Nộ',
        email: 'kingexpress@gmail.com',
        urlFacebook: 'https://www.facebook.com/n.tuan.kiet.1410',
        hotline: '0354216821',
        urlManage: 'https://kimlongexpress.vn/auth?token=',
      });
    }
    Object.assign(setting, { ...updateSettingGlobalDto });
    await setting.save();
  }
}
