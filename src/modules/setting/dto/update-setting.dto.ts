import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class SettingGlobalDto {
  @ApiProperty()
  @IsInt()
  exchangeRate: number;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  urlFacebook: string;

  @ApiProperty()
  @IsString()
  hotline: string;

  @ApiProperty()
  @IsString()
  urlManage: string;
}
export class UpdateSettingGlobalDto extends PartialType(SettingGlobalDto) {}
