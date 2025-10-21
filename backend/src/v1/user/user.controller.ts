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
    @UploadedFile() file: Express.Multer.File,
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
}
