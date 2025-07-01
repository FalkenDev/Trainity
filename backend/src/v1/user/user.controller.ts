import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RequestWithUser } from '../types/requestWithUser.type';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserWithoutPasswordDto } from '../auth/dto/UserWithoutPassword.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
