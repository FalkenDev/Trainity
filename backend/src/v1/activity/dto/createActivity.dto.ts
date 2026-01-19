import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityIcon } from '../activity.entity';

export class CreateActivityDto {
  @ApiProperty({ example: 'Running' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Outdoor running sessions', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ActivityIcon, example: ActivityIcon.RUNNING })
  @IsEnum(ActivityIcon)
  icon: ActivityIcon;

  @ApiProperty({ example: true, description: 'Track distance in kilometers' })
  @IsBoolean()
  trackDistance: boolean;

  @ApiProperty({ example: true, description: 'Track pace (min/km)' })
  @IsBoolean()
  trackPace: boolean;

  @ApiProperty({
    example: true,
    description: 'Track elevation gain and max elevation',
  })
  @IsBoolean()
  trackElevation: boolean;

  @ApiProperty({ example: true, description: 'Track calories burned' })
  @IsBoolean()
  trackCalories: boolean;
}
