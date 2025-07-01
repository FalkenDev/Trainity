import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMuscleGroupDto {
  @ApiProperty({ example: 'Chest' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Upper front torso muscle group', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
