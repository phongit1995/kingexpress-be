import { ApiProperty } from '@nestjs/swagger';

export class ProductOfCategoryDto {
  @ApiProperty({ description: 'name product' })
  name: string;

  @ApiProperty({ description: 'price product' })
  price: number;

  @ApiProperty({ description: 'image product' })
  image: string;

  @ApiProperty({ description: 'url product' })
  url: string;
}
