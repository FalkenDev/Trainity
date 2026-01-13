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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
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

    return new UserWithoutPasswordDto(savedUser);
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
