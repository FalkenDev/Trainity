import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  Patch,
  UseGuards,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { WorkoutSessionService } from './workoutSession.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RequestWithUser } from '../types/requestWithUser.type';
import { CreateWorkoutSessionDto } from './dto/createWorkoutSession.dto';
import { AddExerciseToSessionDto } from './dto/addExerciseToSession.dto';
import { WorkoutSession } from './workoutSession.entity';
import { UpdateWorkoutSessionDto } from './dto/updateWorkoutSession.dto';

@ApiTags('workout-sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workoutSessions')
export class WorkoutSessionController {
  constructor(private readonly sessionService: WorkoutSessionService) {}

  private getUserId(req: RequestWithUser): number {
    if (!req.user?.id)
      throw new UnauthorizedException('User not authenticated');
    return +req.user.id;
  }

  @Get()
  @ApiOperation({ summary: 'Get all workout sessions for the user' })
  @ApiOkResponse({ type: [WorkoutSession] })
  getAll(@Req() req: RequestWithUser): Promise<WorkoutSession[]> {
    console.log('Fetching all workout sessions for user:', this.getUserId(req));
    return this.sessionService.getAllSessions(this.getUserId(req));
  }

  @Post()
  @ApiOperation({ summary: 'Create a workout session' })
  @ApiCreatedResponse({ type: WorkoutSession })
  create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateWorkoutSessionDto,
  ): Promise<WorkoutSession> {
    return this.sessionService.createSession(
      dto.workoutId,
      this.getUserId(req),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one workout session by ID' })
  @ApiOkResponse({ type: WorkoutSession })
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<WorkoutSession> {
    return this.sessionService.getOneSession(id, this.getUserId(req));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workout session' })
  @ApiOkResponse({ type: WorkoutSession })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkoutSessionDto,
    @Req() req: RequestWithUser,
  ): Promise<WorkoutSession> {
    return this.sessionService.updateSession(id, this.getUserId(req), dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workout session' })
  @ApiOkResponse({
    schema: { example: { message: 'Workout session deleted' } },
  })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    return this.sessionService.deleteSession(id, this.getUserId(req));
  }

  @Patch(':id/exercises')
  @ApiOperation({ summary: 'Add exercise to workout session' })
  @ApiOkResponse({ type: WorkoutSession })
  addExercise(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddExerciseToSessionDto,
    @Req() req: RequestWithUser,
  ): Promise<WorkoutSession> {
    return this.sessionService.addExerciseToSession(
      id,
      dto.exerciseId,
      this.getUserId(req),
      dto.sets,
    );
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark session as completed and calculate stats' })
  @ApiOkResponse({ type: WorkoutSession })
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
    @Body()
    payload: {
      completedExercises?: {
        exerciseId: number;
        notes?: string;
        sets: {
          setNumber: number;
          weight: number;
          reps: number;
          rpe?: number;
          notes?: string;
        }[];
      }[];
      notes?: string;
    },
  ): Promise<WorkoutSession> {
    return this.sessionService.completeSession(
      id,
      this.getUserId(req),
      payload,
    );
  }

  @Post(':id/abandon')
  @ApiOperation({ summary: 'Mark session as abandoned' })
  @ApiOkResponse({ type: WorkoutSession })
  abandon(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<WorkoutSession> {
    return this.sessionService.abandonSession(id, this.getUserId(req));
  }
}
