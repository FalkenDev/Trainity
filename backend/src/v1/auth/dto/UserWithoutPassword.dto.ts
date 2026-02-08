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

  @ApiProperty({ required: false })
  unitScale?: string;

  @ApiProperty({ required: false })
  weight?: number;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  gender?: string;

  @ApiProperty({ required: false })
  primaryGoal?: string;

  @ApiProperty({ required: false })
  targetWeight?: number;

  @ApiProperty({ required: false })
  goalTimeframe?: number;

  @ApiProperty({ default: false })
  onboardingCompleted: boolean;

  @ApiProperty({ default: false })
  showWeightTracking: boolean;

  @ApiProperty({ required: false })
  weightGoalType?: string;

  @ApiProperty({ required: false })
  startWeight?: number;

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
    this.unitScale = user.unitScale;
    this.weight = user.weight;
    this.height = user.height;
    this.dateOfBirth = user.dateOfBirth;
    this.gender = user.gender;
    this.primaryGoal = user.primaryGoal;
    this.targetWeight = user.targetWeight;
    this.goalTimeframe = user.goalTimeframe;
    this.onboardingCompleted = user.onboardingCompleted ?? false;
    this.showWeightTracking = user.showWeightTracking ?? false;
    this.weightGoalType = user.weightGoalType;
    this.startWeight = user.startWeight;
  }
}
