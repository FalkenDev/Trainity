import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserWithoutPasswordDto } from './dto/UserWithoutPassword.dto';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ActivityService } from '../activity/activity.service';
import { ActivityIcon } from '../activity/activity.entity';
import { ExerciseSeedService } from '../exercise/exerciseSeed.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly activityService: ActivityService,
    private readonly exerciseSeedService: ExerciseSeedService,
  ) {}

  async register(dto: RegisterDto): Promise<UserWithoutPasswordDto> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const defaultShowRpeRaw =
      this.configService.get<string>('DEFAULT_SHOW_RPE');
    const defaultShowRpe =
      defaultShowRpeRaw == null
        ? true
        : ['1', 'true', 'yes', 'on'].includes(defaultShowRpeRaw.toLowerCase());

    const user = this.userRepo.create({
      ...dto,
      password: hashed,
      showRpe: defaultShowRpe,
    });
    const savedUser = await this.userRepo.save(user);

    // Seed default activities for new user
    await this.seedDefaultActivities(savedUser.id);

    // Seed default exercises for new user
    await this.exerciseSeedService.seedDefaultExercises(savedUser.id);

    return new UserWithoutPasswordDto(savedUser);
  }

  /**
   * Seed default activities for a new user
   */
  private async seedDefaultActivities(userId: number): Promise<void> {
    const defaultActivities = [
      {
        name: 'Running',
        description: 'Outdoor running sessions',
        icon: ActivityIcon.RUNNING,
        trackDistance: true,
        trackPace: true,
        trackElevation: true,
        trackCalories: true,
      },
      {
        name: 'Walking',
        description: 'Walking and hiking',
        icon: ActivityIcon.WALKING,
        trackDistance: true,
        trackPace: true,
        trackElevation: true,
        trackCalories: true,
      },
      {
        name: 'Cycling',
        description: 'Road and mountain biking',
        icon: ActivityIcon.CYCLING,
        trackDistance: true,
        trackPace: false,
        trackElevation: true,
        trackCalories: true,
      },
      {
        name: 'Floorball',
        description: 'Floorball training and matches',
        icon: ActivityIcon.OTHER,
        trackDistance: false,
        trackPace: false,
        trackElevation: false,
        trackCalories: true,
      },
      {
        name: 'Football',
        description: 'Football training and matches',
        icon: ActivityIcon.FOOTBALL,
        trackDistance: false,
        trackPace: false,
        trackElevation: false,
        trackCalories: true,
      },
      {
        name: 'Swimming',
        description: 'Swimming sessions',
        icon: ActivityIcon.SWIMMING,
        trackDistance: true,
        trackPace: false,
        trackElevation: false,
        trackCalories: true,
      },
      {
        name: 'Kayaking',
        description: 'Kayaking and canoeing',
        icon: ActivityIcon.KAYAKING,
        trackDistance: true,
        trackPace: false,
        trackElevation: false,
        trackCalories: true,
      },
    ];

    for (const activity of defaultActivities) {
      try {
        await this.activityService.create(activity, userId);
      } catch (error) {
        // Ignore errors (e.g., duplicate names) and continue
        console.error(
          `Failed to seed activity ${activity.name}:`,
          error.message,
        );
      }
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'firstName', 'lastName', 'password', 'showRpe'],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userDto = new UserWithoutPasswordDto(user);

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    return {
      token,
      user: userDto,
    };
  }
}
