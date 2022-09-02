import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListProductSuggestDto } from './dto/product-suggest.dto';
import { ProductService } from './product.service';
import { ProductDetail, ProductDto } from './dto/product.dto';
import { ProductSearchDto } from './dto/product-search.dto';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get('suggest-for-you')
  @ApiOperation({ summary: 'get list suggest home page' })
  @ApiResponse({ status: 200, type: [ListProductSuggestDto] })
  suggestProduct() {
    return this.productService.listSuggest();
  }

  @Get('search')
  @ApiOperation({ summary: 'search product' })
  searchProduct(
    @Query('key') key: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.productService.searchProduct(key, page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get detail product' })
  detailProduct(@Param('id') id: string) {
    return this.productService.getDetailProduct(id);
  }
}
