import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchQueryDto } from './dto/search.dto';
import { TokenUserGuard } from 'src/common/decorators/token.guard';
import { TokenUser } from 'src/common/decorators/token.user';
import { OrderProductShoppingDto } from './dto/order-product-shopping.dto';

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

  @Get('/search')
  @ApiOperation({ summary: 'search product' })
  @ApiResponse({ status: 200 })
  search(@Query() query?: SearchQueryDto) {
    return this.shoppingService.searchProduct(
      query.keyword,
      query.page,
      query.minPrice,
      query.maxPrice,
    );
  }

  @Post('order')
  @ApiOperation({ summary: 'order product shopping' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(TokenUserGuard)
  async orderProduct(
    @TokenUser() token: string,
    @Body() orderProductShoppingDto: OrderProductShoppingDto,
  ) {
    return this.shoppingService.orderProduct(token, orderProductShoppingDto);
  }
}
