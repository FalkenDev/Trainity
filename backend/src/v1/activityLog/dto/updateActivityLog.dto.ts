import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActivityLogDto {
  @ApiProperty({ example: '2026-01-19', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: 45, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiProperty({ example: 8.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number;

  @ApiProperty({ example: 150, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  elevationGain?: number;

  @ApiProperty({ example: 320, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxElevation?: number;

  @ApiProperty({ example: 350, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @ApiProperty({ example: 'Good run today', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
