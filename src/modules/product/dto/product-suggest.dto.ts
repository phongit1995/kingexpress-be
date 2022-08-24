import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ListProductSuggestDto {
  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsNumber()
  endTime: number;

  @ApiProperty()
  @IsNumber()
  buyNowPrice: string;

  @ApiProperty()
  @IsNumber()
  price: string;

  @ApiProperty()
  @IsNumber()
  bid: string;
}
