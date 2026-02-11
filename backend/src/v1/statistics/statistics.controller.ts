import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RequestWithUser } from '../types/requestWithUser.type';

@ApiTags('statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  private getUserId(req: RequestWithUser): number {
    if (!req.user?.id)
      throw new UnauthorizedException('User not authenticated');
    return +req.user.id;
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get overview statistics for the user' })
  getOverview(@Req() req: RequestWithUser) {
    return this.statisticsService.getOverview(this.getUserId(req));
  }

  @Get('exercises/:exerciseId/history')
  @ApiOperation({ summary: 'Get exercise performance history' })
  getExerciseHistory(
    @Req() req: RequestWithUser,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.statisticsService.getExerciseHistory(
      this.getUserId(req),
      exerciseId,
      parseInt(page ?? '1', 10),
      parseInt(limit ?? '20', 10),
    );
  }

  @Get('exercises/:exerciseId/records')
  @ApiOperation({ summary: 'Get personal records for an exercise' })
  getExerciseRecords(
    @Req() req: RequestWithUser,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    return this.statisticsService.getExerciseRecords(
      this.getUserId(req),
      exerciseId,
    );
  }

  @Get('exercises/:exerciseId/progress')
  @ApiOperation({ summary: 'Get exercise progress chart data' })
  getExerciseProgress(
    @Req() req: RequestWithUser,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Query('metric') metric: string = 'estimated_1rm',
    @Query('period') period: string = 'all',
  ) {
    return this.statisticsService.getExerciseProgress(
      this.getUserId(req),
      exerciseId,
      metric as any,
      period as any,
    );
  }

  @Get('exercises/:exerciseId/quick')
  @ApiOperation({ summary: 'Get quick stats for exercise dialog' })
  getExerciseQuickStats(
    @Req() req: RequestWithUser,
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
  ) {
    return this.statisticsService.getExerciseQuickStats(
      this.getUserId(req),
      exerciseId,
    );
  }

  @Get('workouts/:workoutId/history')
  @ApiOperation({ summary: 'Get workout session history' })
  getWorkoutHistory(
    @Req() req: RequestWithUser,
    @Param('workoutId', ParseIntPipe) workoutId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.statisticsService.getWorkoutHistory(
      this.getUserId(req),
      workoutId,
      parseInt(page ?? '1', 10),
      parseInt(limit ?? '20', 10),
    );
  }

  @Get('workouts/:workoutId/quick')
  @ApiOperation({ summary: 'Get quick stats for workout details page' })
  getWorkoutQuickStats(
    @Req() req: RequestWithUser,
    @Param('workoutId', ParseIntPipe) workoutId: number,
  ) {
    return this.statisticsService.getWorkoutQuickStats(
      this.getUserId(req),
      workoutId,
    );
  }
}
