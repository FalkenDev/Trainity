import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
  ValidateIf,
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
  @ValidateIf((_, value) => value !== null)
  @IsNumber()
  targetWeight?: number | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsNumber()
  goalTimeframe?: number | null;

  @IsOptional()
  @IsBoolean()
  showRpe?: boolean;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  showWeightTracking?: boolean;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  weightGoalType?: string | null;

  @IsOptional()
  @IsNumber()
  startWeight?: number;
}
