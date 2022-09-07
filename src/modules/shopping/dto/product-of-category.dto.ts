import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProductOfCategoryDto {
  @ApiProperty({ description: 'name product', required: false })
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'price product', required: false })
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'image product', required: false })
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'url product', required: false })
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'slug shop', required: false })
  @IsOptional()
  slugShop?: string;

  @ApiProperty({ description: 'slug product', required: false })
  @IsOptional()
  slugProduct?: string;
}
