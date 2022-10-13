import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { MercariService } from './mercari.service';

@ApiTags('mercari')
@Controller('mercari')
export class MercariController {
  constructor(private readonly service: MercariService) {}

  @Get('/main-page/category')
  @ApiOperation({ summary: 'List category on main page ' })
  getAllCategoryMain() {
    return this.service.getAllCategoryMain();
  }

  @Get('/category/product/:category_id')
  @ApiOperation({ summary: 'List product by category ' })
  async searchProductByCategoryId(@Query('page') page: string, @Param('category_id') category_id: string) {
    return await this.service.searchProductByCategoryId(category_id, parseInt(page));
  }

  @Get('/product/:pid')
  @ApiOperation({ summary: 'Detail Product' })
  async detailProduct(@Param('pid') pid: string) {
    return await this.service.getDetailProduct(pid);
  }
}
