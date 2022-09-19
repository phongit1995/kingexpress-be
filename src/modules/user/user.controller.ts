import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('login')
  @ApiOperation({ summary: 'login user' })
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.loginUser(
      userLoginDto.username,
      userLoginDto.password,
    );
  }
}
