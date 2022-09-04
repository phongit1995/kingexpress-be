import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductSearchDto {
  @ApiProperty({ description: 'Name Of Product' })
  name: string;

  @ApiProperty({ description: 'Price Of Product' })
  price?: number;

  @ApiProperty({ description: 'Starting Price Of Product' })
  startPrice?: number;

  @ApiProperty({ description: 'Buying Price Of Product' })
  buyNowPrice?: number;

  @ApiProperty({ description: 'Source Image Of Product' })
  imageUrl?: string;

  @ApiProperty({ description: 'Source Of Product' })
  productUrl?: string;

  @ApiProperty({ description: 'Endtime Of Product' })
  endTime?: number;
}

export class QuerySearchDto {
  @ApiProperty({ description: 'Keyword', required: false })
  @IsOptional()
  key?: string;

  @ApiProperty({ description: 'Page', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Amount Product of Per Page', required: false })
  @IsOptional()
  pageSize?: number;

  @ApiProperty({ description: 'Min Price', required: false })
  @IsOptional()
  min?: number;

  @ApiProperty({ description: 'Max Price', required: false })
  @IsOptional()
  max?: number;

  @ApiProperty({ description: 'Price Type', required: false })
  @IsOptional()
  priceType?: string;

  @ApiProperty({ description: 'Status [1: sản phẩm mới]', required: false })
  @IsOptional()
  status?: number;
}
