import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivityLogService } from './activityLog.service';
import { CreateActivityLogDto } from './dto/createActivityLog.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { ActivityLogResponseDto } from './dto/activityLogResponse.dto';
import { RequestWithUser } from '../types/requestWithUser.type';

@ApiTags('activityLog')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activityLog')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activity logs for the logged-in user' })
  @ApiOkResponse({ type: [ActivityLogResponseDto] })
  getAllActivityLogs(
    @Req() req: RequestWithUser,
  ): Promise<ActivityLogResponseDto[]> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityLogService.findAll(+req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific activity log by ID' })
  @ApiOkResponse({ type: ActivityLogResponseDto })
  getActivityLog(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<ActivityLogResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityLogService.findOne(id, +req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new activity log' })
  @ApiCreatedResponse({ type: ActivityLogResponseDto })
  createActivityLog(
    @Body() body: CreateActivityLogDto,
    @Req() req: RequestWithUser,
  ): Promise<ActivityLogResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityLogService.create(body, +req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity log' })
  @ApiOkResponse({ description: 'Activity log deleted successfully' })
  deleteActivityLog(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityLogService.delete(id, +req.user.id);
  }
}
