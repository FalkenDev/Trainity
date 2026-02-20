import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;

  @IsOptional()
  @IsBoolean()
  showRpe?: boolean;

  @IsOptional()
  @IsBoolean()
  showWeightTracking?: boolean;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsIn(['lose', 'gain', 'maintain'])
  weightGoalType?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsNumber()
  targetWeight?: number | null;

  @IsOptional()
  @IsNumber()
  startWeight?: number;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsNumber()
  goalTimeframe?: number | null;
}
