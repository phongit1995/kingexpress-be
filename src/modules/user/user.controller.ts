import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenUserGuard } from 'src/common/decorators/token.guard';
import { TokenUser } from 'src/common/decorators/token.user';
import { UserLoginDto } from './dto/login.dto';
import { UserRegisterDto } from './dto/register.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('login')
  @ApiOperation({ summary: 'login user' })
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.loginUser(userLoginDto.username, userLoginDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'register user' })
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.userService.registerUser(userRegisterDto);
  }

  @Get('info')
  @ApiOperation({ summary: 'get user info' })
  @ApiBearerAuth()
  @UseGuards(TokenUserGuard)
  async getUserInfo(@TokenUser() token: string) {
    return this.userService.getUserInfo(token);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'statistics purchase ( Thống kê mua hàng )' })
  @ApiBearerAuth()
  @UseGuards(TokenUserGuard)
  async getStatistics(@TokenUser() token: string) {
    return this.userService.getStatistics(token);
  }
}
