import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListProductSuggestDto } from './dto/product-suggest.dto';
import { ProductService } from './product.service';

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
}
