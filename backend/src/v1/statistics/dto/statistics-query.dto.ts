import { IsEnum, IsOptional, IsString, IsNumberString } from 'class-validator';

export class ExerciseProgressQueryDto {
  @IsEnum(['estimated_1rm', 'max_weight', 'total_volume', 'max_reps'])
  metric: 'estimated_1rm' | 'max_weight' | 'total_volume' | 'max_reps';

  @IsOptional()
  @IsEnum(['1m', '3m', '6m', '1y', 'all'])
  period?: '1m' | '3m' | '6m' | '1y' | 'all' = 'all';
}

export class PaginationQueryDto {
  @IsOptional()
  @IsString()
  page?: string = '1';

  @IsOptional()
  @IsString()
  limit?: string = '20';
}

export class WeeklyTrendsQueryDto {
  @IsOptional()
  @IsNumberString()
  weeks?: string = '12';
}

export class HeatmapQueryDto {
  @IsOptional()
  @IsNumberString()
  weeks?: string = '12';
}
