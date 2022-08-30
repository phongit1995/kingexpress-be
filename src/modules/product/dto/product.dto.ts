import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  currentPrice?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  startingPrice?: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  images?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  startDateAndTime?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  endDateAndTime?: string;
}
export type Product = {
  id?: string;
  name?: string;
  currentPrice?: number;
  quantity?: number;
  startingPrice?: number;
  images?: string[];
  startDateAndTime?: number;
  endDateAndTime?: number;
  automationExtension: boolean;
  earlyTermination: boolean;
  refund: string | boolean;
  bidderAppraisalRestriction: string | boolean;
  bidderVerificationLimit: string | boolean;
  highestBidder: string;
};
export interface ProductRelation {
  name: string;
  id: string;
}
export interface ProductDetail {
  detail: Product;
  productRelation: any;
}
