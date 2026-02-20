import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateProgressPhotoDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsIn(['front', 'side', 'back'])
  poseTag?: 'front' | 'side' | 'back' | null;

  @IsOptional()
  @IsString()
  notes?: string;
}
