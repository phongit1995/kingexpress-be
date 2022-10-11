import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductOfCategoryDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  url: string;
}
