import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWeightLogDto {
  @ApiProperty({ example: '2026-02-08' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 82.5, description: 'Weight in kg' })
  @IsNumber()
  @Min(1)
  weight: number;

  @ApiProperty({ example: 'Feeling good today', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
