import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query, Post, UseGuards, Body } from '@nestjs/common';
import { MercariService } from './mercari.service';
import { SearchQueryDto } from './dto/search.dto';
import { TokenUserGuard } from 'src/common/decorators/token.guard';
import { TokenUser } from 'src/common/decorators/token.user';
import { OrderProductMercariDto } from './dto/order-product-mercari.dto';

@ApiTags('mercari')
@Controller('mercari')
export class MercariController {
  constructor(private readonly service: MercariService) {}

  @Get('/category/main-page')
  @ApiOperation({ summary: 'List category on main page ' })
  getAllCategoryMain() {
    return this.service.getAllCategoryMain();
  }

  @Get('/category/:category_id')
  @ApiOperation({ summary: 'List product by category ' })
  async searchProductByCategoryId(@Query('page') page: string, @Param('category_id') category_id: string) {
    return await this.service.searchProductByCategoryId(category_id, parseInt(page));
  }

  @Get('/product/:productId')
  @ApiOperation({ summary: 'Detail Product' })
  async detailProduct(@Param('productId') productId: string) {
    return await this.service.getDetailProduct(productId);
  }

  @Get('/search')
  @ApiOperation({ summary: 'search product mercari' })
  @ApiResponse({ status: 200 })
  search(@Query() query?: SearchQueryDto) {
    return this.service.searchProduct(query);
  }

  @Post('order')
  @ApiOperation({ summary: 'order product mercari' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(TokenUserGuard)
  async orderProduct(@TokenUser() token: string, @Body() orderProductMercariDto: OrderProductMercariDto) {
    return this.service.orderProduct(token, orderProductMercariDto);
  }
}
