import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TokenUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const bearToken = request.headers.authorization?.match(/^Bearer (.*)$/);
    if (!bearToken) {
      throw new HttpException('Lỗi xác minh !!!', HttpStatus.BAD_REQUEST);
    }
    const token = bearToken[0];
    console.log('tokenGuards', token);
    request.token = token;
    return true;
  }
}
