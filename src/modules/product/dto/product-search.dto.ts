import { ApiProperty } from '@nestjs/swagger';

export class ProductSearchDto {
  @ApiProperty({ description: 'Name Of Product' })
  name: string;

  @ApiProperty({ description: 'Price Of Product' })
  price?: number;

  @ApiProperty({ description: 'Price Of Product' })
  startPrice?: number;

  @ApiProperty({ description: 'Price Of Product' })
  buyNowPrice?: number;

  @ApiProperty({ description: 'Source Image Of Product' })
  imageUrl: string;

  @ApiProperty({ description: 'Source Of Product' })
  productUrl: string;

  @ApiProperty({ description: 'Price Of Product' })
  endTime?: number;
}
