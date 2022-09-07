import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('shopping')
@ApiTags('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  @Get('/category/:id/')
  @ApiOperation({ summary: 'get list product by category' })
  @ApiResponse({ status: 200 })
  getProductByCategory(@Param('id') id: string, @Query('page') page: number) {
    return this.shoppingService.getProductByCateGory(id, page);
  }
}
