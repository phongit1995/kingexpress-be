import { Controller, Get, Param, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListProductSuggestDto } from './dto/product-suggest.dto';
import { ProductService } from './product.service';
import { QuerySearchDto } from './dto/product-search.dto';
import { LastOrderProductDto } from './dto/last-order.dto';
import { TokenUserGuard } from 'src/common/decorators/token.guard';
import { TokenUser } from 'src/common/decorators/token.user';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get('suggest-for-you')
  @ApiOperation({ summary: 'get list suggest home page' })
  @ApiResponse({ status: 200, type: [ListProductSuggestDto] })
  suggestProduct() {
    const categorySuggest = '23140';
    return this.productService.listProductCategory(categorySuggest);
  }

  @Get('search')
  @ApiOperation({ summary: 'search product' })
  searchProduct(@Query() query?: QuerySearchDto) {
    return this.productService.searchProduct(
      query.key,
      query.page,
      query.pageSize,
      query.min,
      query.max,
      query.priceType,
      query.status,
    );
  }

  @Get('category-home')
  @ApiOperation({ summary: 'list category home product' })
  async listCategoryHome() {
    return [
      {
        id: '26320',
        name: 'Phu Kien Xe',
      },
      {
        id: '2084008366',
        name: 'Noi Com Dien ',
      },
      {
        id: '2084245309',
        name: 'Robot hut bui',
      },
    ];
  }

  @Get('category/:id')
  @ApiOperation({ summary: 'get  list product category' })
  async listProductCategory(@Param('id') id: string) {
    return this.productService.listProductCategory(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get detail product' })
  detailProduct(@Param('id') id: string) {
    return this.productService.getDetailProduct(id);
  }

  @Post('last-order')
  @ApiOperation({ summary: 'săn phút chót' })
  @ApiBearerAuth()
  @UseGuards(TokenUserGuard)
  async lastOrder(@Body() lastOrderProductDto: LastOrderProductDto, @TokenUser() token: string) {
    return this.productService.lastOrderProduct(token, lastOrderProductDto);
  }
}
