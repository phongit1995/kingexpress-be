import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenUserGuard } from 'src/common/decorators/token.guard';
import { TokenUser } from 'src/common/decorators/token.user';
import { OrderProductRakutenDto } from './dto/order-product-rakuten.dto';
import { SearchQueryDto } from './dto/search.dto';
import { RakutenService } from './rakuten.service';

@Controller('rakuten')
@ApiTags('rakuten')
export class RakutenController {
  constructor(private rakutenService: RakutenService) {}

  @Get('/category/main-page')
  @ApiOperation({ summary: 'get category in main page' })
  @ApiResponse({ status: 200 })
  getListCategoryInMainPage() {
    return this.rakutenService.getListCategoryInMainPage();
  }

  @Get('/category/:id/')
  @ApiOperation({ summary: 'get list product by category' })
  async getListByCategory(@Param('id') id: string, @Query('page') page: number) {
    return this.rakutenService.getListProductByCategory(id, page);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'get product detail' })
  async getProductDetail(@Param('productId') productId: string) {
    return this.rakutenService.getProductDetail(productId);
  }

  @Get('/search')
  @ApiOperation({ summary: 'search product rakuten' })
  @ApiResponse({ status: 200 })
  search(@Query() query?: SearchQueryDto) {
    return this.rakutenService.searchProduct(query);
  }

  @Post('order')
  @ApiOperation({ summary: 'order product rakuten' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(TokenUserGuard)
  async orderProduct(@TokenUser() token: string, @Body() orderProductRakutenDto: OrderProductRakutenDto) {
    return this.rakutenService.orderProduct(token, orderProductRakutenDto);
  }
}
