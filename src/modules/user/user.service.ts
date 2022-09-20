import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
@Injectable()
export class UserService {
  constructor(private requestService: RequestService) {}
  private readonly baseUrl = 'https://api.kimlongexpress.vn';
  async loginUser(username: string, password: string) {
    const urlLogin = `${this.baseUrl}/api/auth/login`;
    try {
      const result = await this.requestService.postMethod(urlLogin, {
        body: {
          username,
          password,
        },
        json: true,
      });
      return result;
    } catch (error) {
      throw new HttpException(
        'Tài khoản hoặc mật khẩu chưa đúng !!!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserInfo(token: string) {
    const urlUserInfo = `${this.baseUrl}/api/auth`;
    try {
      const result = await this.requestService.getMethod(urlUserInfo, {
        headers: {
          authorization: token,
        },
        json: true,
      });
      return result;
    } catch (error) {
      throw new HttpException(
        'Lỗi hệ thống vui lòng liên hệ admin !!!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getStatistics(token: string) {
    const urlUserInfo = `${this.baseUrl}/api/auth/thongkemuahang`;
    try {
      const result = await this.requestService.getMethod(urlUserInfo, {
        headers: {
          authorization: token,
        },
        json: true,
      });
      return result;
    } catch (error) {
      throw new HttpException(
        'Lỗi hệ thống vui lòng liên hệ admin !!!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
