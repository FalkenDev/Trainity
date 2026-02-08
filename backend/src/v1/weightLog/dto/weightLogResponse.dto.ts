import { ApiProperty } from '@nestjs/swagger';

export class WeightLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  weight: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;
}

export class WeightLogStatsDto {
  @ApiProperty({ required: false })
  currentWeight?: number;

  @ApiProperty({ required: false })
  startWeight?: number;

  @ApiProperty({ required: false })
  changeFromStart?: number;

  @ApiProperty({ required: false })
  lastLogWeight?: number;

  @ApiProperty({ required: false })
  changeFromLastLog?: number;

  @ApiProperty({ required: false })
  targetWeight?: number;

  @ApiProperty({ required: false })
  weightGoalType?: string;
}
