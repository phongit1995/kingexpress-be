import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class OrderProductMercariDto {
  @ApiProperty({
    type: String,
    example: 'https://www.mercari.com/jp/items/m27869485173/',
  })
  @IsUrl()
  @IsString()
  link: string;

  @ApiProperty({ type: String, example: 'màu nâu' })
  @IsOptional()
  @IsString()
  properties: string;

  @ApiProperty({ type: String, example: 'màu nâu' })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ type: Number, example: 200 })
  @IsInt()
  @IsOptional()
  price: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  quantity: number;
}
