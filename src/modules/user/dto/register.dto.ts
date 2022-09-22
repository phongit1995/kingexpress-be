import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({ type: String, example: 'test account' })
  @IsString()
  @MinLength(1)
  fullname: string;

  @ApiProperty({ type: String, example: 'test@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'test1234' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, example: '1234' })
  @IsString()
  password: string;

  @ApiProperty({ type: String, example: '0382651478' })
  @IsString()
  @Length(10)
  phonenumber: string;
}
