import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ type: String, example: 'test' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  password: string;
}
