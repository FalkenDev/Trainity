import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class UpdateUserPreferencesDto {
  @IsOptional()
  @IsString()
  unitScale?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  primaryGoal?: string;

  @IsOptional()
  @IsNumber()
  weeklyWorkoutGoal?: number;

  @IsOptional()
  @IsNumber()
  targetWeight?: number;

  @IsOptional()
  @IsNumber()
  goalTimeframe?: number;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  showWeightTracking?: boolean;

  @IsOptional()
  @IsString()
  weightGoalType?: string;

  @IsOptional()
  @IsNumber()
  startWeight?: number;
}
