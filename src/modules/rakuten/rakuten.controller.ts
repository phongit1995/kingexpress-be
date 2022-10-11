import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
