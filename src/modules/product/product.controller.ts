import { Controller, Get } from '@nestjs/common';

@Controller('product')
export class ProductController {
  @Get('suggest-for-you')
  suggestProduct() {
    return 'hello';
  }
}
