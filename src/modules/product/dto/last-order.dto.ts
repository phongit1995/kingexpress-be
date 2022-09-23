import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class LastOrderProductDto {
  @ApiProperty({ type: String })
  @IsString()
  link: string;

  @ApiProperty({ type: String })
  @IsString()
  image: string;

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(1)
  monney: string;
}
