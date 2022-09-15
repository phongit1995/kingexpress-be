import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('setting')
@ApiTags('setting')
export class SettingController {
  @Get('global')
  async getSetting() {
    return {
      exchangeRate: 220,
      address:
        '03-6770-3693 Nhật Bản, 〒136-0075 Tokyo, Koto City, Shinsuna,3 Chome−10−8,  1F Warehouse 3',
      email: 'kingexpress@gmail.com',
    };
  }
}
