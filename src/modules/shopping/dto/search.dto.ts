import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({ description: 'Keyword', required: false })
  @IsOptional()
  keyword?: string;

  @ApiProperty({ description: 'Page', required: true })
  @IsNumber()
  page: number;

  @ApiProperty({ description: 'Min Price', required: false })
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ description: 'Max Price', required: false })
  @IsOptional()
  maxPrice?: number;
}
