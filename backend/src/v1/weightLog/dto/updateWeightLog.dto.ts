import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWeightLogDto {
  @ApiProperty({ example: 81.0, required: false, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  weight?: number;

  @ApiProperty({ example: 'Corrected entry', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
