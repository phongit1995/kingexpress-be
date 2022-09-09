import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('shopping')
@ApiTags('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Get('/category/main-page')
  @ApiOperation({ summary: 'get category in main page' })
  @ApiResponse({ status: 200 })
  getListCategoryInMainPage() {
    return this.shoppingService.getListCategoryInMainPage();
  }

  @Get('/category/:id/')
  @ApiOperation({ summary: 'get list product by category' })
  @ApiResponse({ status: 200 })
  getProductByCategory(@Param('id') id: string, @Query('page') page: number) {
    return this.shoppingService.getProductByCateGory(id, page);
  }

  @Get('/product/:slugShop/:slugPro')
  @ApiOperation({ summary: 'get detail product' })
  @ApiResponse({ status: 200 })
  getDetailProduct(
    @Param('slugShop') slugShop: string,
    @Param('slugPro') slugPro: string,
  ) {
    return this.shoppingService.getDetailProduct(slugShop, slugPro);
  }
}
