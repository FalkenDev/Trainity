import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
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
  @IsString()
  @IsIn(['lose', 'gain', 'maintain'])
  weightGoalType?: string;

  @IsOptional()
  @IsNumber()
  targetWeight?: number;

  @IsOptional()
  @IsNumber()
  startWeight?: number;
}
