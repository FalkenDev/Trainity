import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/createActivity.dto';
import { UpdateActivityDto } from './dto/updateActivity.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { ActivityResponseDto } from './dto/activityResponse.dto';
import { RequestWithUser } from '../types/requestWithUser.type';

@ApiTags('activity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activities for the logged-in user' })
  @ApiOkResponse({ type: [ActivityResponseDto] })
  getAllActivities(
    @Req() req: RequestWithUser,
  ): Promise<ActivityResponseDto[]> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityService.findAll(+req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific activity by ID' })
  @ApiOkResponse({ type: ActivityResponseDto })
  getActivity(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<ActivityResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityService.findOne(id, +req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiCreatedResponse({ type: ActivityResponseDto })
  createActivity(
    @Body() body: CreateActivityDto,
    @Req() req: RequestWithUser,
  ): Promise<ActivityResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityService.create(body, +req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiOkResponse({ type: ActivityResponseDto })
  updateActivity(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateActivityDto,
    @Req() req: RequestWithUser,
  ): Promise<ActivityResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityService.update(id, body, +req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiOkResponse({ description: 'Activity deleted successfully' })
  deleteActivity(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.activityService.delete(id, +req.user.id);
  }
}
