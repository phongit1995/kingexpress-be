import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateSettingGlobalDto } from './dto/update-setting.dto';
import { SettingService } from './setting.service';

@Controller('setting')
@ApiTags('setting')
export class SettingController {
  constructor(private settingService: SettingService) {}
  @Get('global')
  async getSetting() {
    return this.settingService.getGlobalSetting();
  }

  @Get('update')
  @ApiOperation({ summary: 'update setting global' })
  @ApiResponse({ status: 200 })
  async updateSetting(@Query() updateSettingGlobalDto: UpdateSettingGlobalDto) {
    return this.settingService.updateSettingGlobal(updateSettingGlobalDto);
  }
}
