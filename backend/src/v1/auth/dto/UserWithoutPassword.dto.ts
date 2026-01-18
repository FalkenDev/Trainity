import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/v1/user/user.entity';

export class UserWithoutPasswordDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ default: true })
  showRpe: boolean;

  @ApiProperty({ default: 3 })
  weeklyWorkoutGoal: number;

  @ApiProperty({ default: 0 })
  currentStreak: number;

  @ApiProperty({ default: 0 })
  currentWeekWorkouts: number;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;
    this.showRpe = user.showRpe ?? true;
    this.weeklyWorkoutGoal = user.weeklyWorkoutGoal ?? 3;
    this.currentStreak = user.currentStreak ?? 0;
    this.currentWeekWorkouts = user.currentWeekWorkouts ?? 0;
  }
}
