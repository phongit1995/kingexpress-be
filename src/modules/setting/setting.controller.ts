import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('setting')
@ApiTags('setting')
export class SettingController {
  @Get('global')
  async getSetting() {
    return {
      exchangeRate: 220,
      address: 'B13-T59 đường gom Pháp Vân, Hoàng Liệt, Hoàng Mai, Hà Nộ',
      email: 'kingexpress@gmail.com',
      urlFacebook: 'https://www.facebook.com/n.tuan.kiet.1410',
      hotline: '0354216821',
      urlManage: 'https://kimlongexpress.vn/auth?token=',
    };
  }
}
