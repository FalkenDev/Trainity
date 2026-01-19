import { ApiProperty } from '@nestjs/swagger';
import { ActivityIcon } from '../activity.entity';

export class ActivityResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: ActivityIcon })
  icon: ActivityIcon;

  @ApiProperty()
  trackDistance: boolean;

  @ApiProperty()
  trackPace: boolean;

  @ApiProperty()
  trackElevation: boolean;

  @ApiProperty()
  trackCalories: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
