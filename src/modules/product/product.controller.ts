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
import { ProductSearchDto, QuerySearchDto } from './dto/product-search.dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'get detail product' })
  detailProduct(@Param('id') id: string) {
    return this.productService.getDetailProduct(id);
  }
}
