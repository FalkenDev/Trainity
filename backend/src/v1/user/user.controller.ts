import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RequestWithUser } from '../types/requestWithUser.type';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UserWithoutPasswordDto } from '../auth/dto/UserWithoutPassword.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UpdateUserPreferencesDto } from './dto/UpdateUserPreferences.dto';
import { UploadService } from '../upload/upload.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ type: UserWithoutPasswordDto })
  getProfile(@Req() req: RequestWithUser) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.findOneById(+req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiOkResponse({ type: UserWithoutPasswordDto })
  updateProfile(@Req() req: RequestWithUser, @Body() dto: UpdateUserDto) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.updateUser(+req.user.id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user and related data (exercises, etc)' })
  @ApiOkResponse({
    description: 'Success message after deleting the user and their data',
    schema: {
      example: { message: 'User and all related data deleted' },
    },
  })
  deleteProfile(@Req() req: RequestWithUser) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.deleteUser(+req.user.id);
  }

  @Post('avatar')
  @ApiOperation({ summary: 'Upload avatar for the authenticated user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: UserWithoutPasswordDto })
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  async uploadAvatar(
    @UploadedFile() file: any,
    @Req() req: RequestWithUser,
  ): Promise<UserWithoutPasswordDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const validation = this.uploadService.validateImageFile(file);
    if (!validation.valid) {
      throw new BadRequestException(validation.error);
    }

    const avatarUrl = await this.uploadService.processAvatarImage(file);

    return this.userService.updateAvatar(+req.user.id, avatarUrl);
  }

  @Get('streak')
  @ApiOperation({ summary: 'Get user streak information' })
  @ApiOkResponse({
    description: 'User streak information',
    schema: {
      example: {
        currentStreak: 5,
        weeklyWorkoutGoal: 3,
        currentWeekWorkouts: 2,
        progressPercentage: 67,
      },
    },
  })
  getStreak(@Req() req: RequestWithUser) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.getStreakInfo(+req.user.id);
  }

  @Put('weekly-goal')
  @ApiOperation({ summary: 'Update weekly workout goal' })
  @ApiOkResponse({ type: UserWithoutPasswordDto })
  updateWeeklyGoal(
    @Req() req: RequestWithUser,
    @Body() body: { weeklyWorkoutGoal: number },
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.updateWeeklyWorkoutGoal(
      +req.user.id,
      body.weeklyWorkoutGoal,
    );
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user preferences and onboarding data' })
  @ApiOkResponse({ type: UserWithoutPasswordDto })
  updatePreferences(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserPreferencesDto,
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.userService.updateUserPreferences(+req.user.id, dto);
  }
}
