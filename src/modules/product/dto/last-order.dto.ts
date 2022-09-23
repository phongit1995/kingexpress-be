/* eslint-disable max-len */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class LastOrderProductDto {
  @ApiProperty({ type: String, example: 'https://page.auctions.yahoo.co.jp/jp/auction/r1056420477' })
  @IsString()
  link: string;

  @ApiProperty({
    type: String,
    example:
      'https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0307/users/2f41ef36e7ffda799c9e9ce9ad7b8c9e34d989eb/i-img1200x1200-1656830092nxvmkq111969.jpg',
  })
  @IsString()
  image: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  monney: number;
}
