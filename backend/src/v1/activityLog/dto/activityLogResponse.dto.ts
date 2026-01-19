import { ApiProperty } from '@nestjs/swagger';
import { ActivityResponseDto } from '../../activity/dto/activityResponse.dto';

export class ActivityLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: ActivityResponseDto })
  activity: ActivityResponseDto;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  duration: number;

  @ApiProperty({ required: false })
  distance?: number;

  @ApiProperty({ required: false })
  pace?: string;

  @ApiProperty({ required: false })
  elevationGain?: number;

  @ApiProperty({ required: false })
  maxElevation?: number;

  @ApiProperty({ required: false })
  calories?: number;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty()
  createdAt: Date;
}
