import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListProductSuggestDto } from './dto/product-suggest.dto';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'get detail product' })
  @ApiOkResponse({ status: 200, type: ProductDto })
  detailProduct(@Param('id') id: string) {
    return this.productService.getDetailProduct(id);
  }
}
