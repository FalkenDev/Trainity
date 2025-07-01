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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/createWorkout.dto';
import { UpdateWorkoutDto } from './dto/updateWorkout.dto';
import { WorkoutResponseDto } from './dto/workoutResponse.dto';
import { RequestWithUser } from '../types/requestWithUser.type';
import { AddRemoveExercisesDto } from './dto/addRemoveExercises.dto';

@ApiTags('workouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  private getUserId(req: RequestWithUser): number {
    if (!req.user?.id)
      throw new UnauthorizedException('User not authenticated');
    return +req.user.id;
  }

  @Get()
  @ApiOperation({ summary: 'Get all workouts for the logged-in user' })
  @ApiOkResponse({ type: [WorkoutResponseDto] })
  getWorkoutList(@Req() req: RequestWithUser) {
    return this.workoutService.getWorkoutList(this.getUserId(req));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workout' })
  @ApiCreatedResponse({ type: WorkoutResponseDto })
  createWorkout(@Req() req: RequestWithUser, @Body() dto: CreateWorkoutDto) {
    return this.workoutService.createWorkout(dto, this.getUserId(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a workout by ID' })
  @ApiOkResponse({ type: WorkoutResponseDto })
  getWorkout(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.workoutService.getWorkout(id, this.getUserId(req));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a workout by ID' })
  @ApiOkResponse({ type: WorkoutResponseDto })
  updateWorkout(
    @Param('id') id: number,
    @Body() dto: UpdateWorkoutDto,
    @Req() req: RequestWithUser,
  ) {
    return this.workoutService.updateWorkout(id, dto, this.getUserId(req));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workout by ID' })
  @ApiOkResponse({
    schema: { example: { message: 'Workout deleted and references removed' } },
  })
  deleteWorkout(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.workoutService.deleteWorkout(id, this.getUserId(req));
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a workout' })
  @ApiCreatedResponse({ type: WorkoutResponseDto })
  duplicateWorkout(@Param('id') id: number, @Req() req: RequestWithUser) {
    return this.workoutService.duplicateWorkout(id, this.getUserId(req));
  }

  @Post(':id/exercises')
  @ApiOperation({ summary: 'Add one or more exercises to a workout' })
  @ApiOkResponse({ type: WorkoutResponseDto })
  addExercisesToWorkout(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddRemoveExercisesDto,
    @Req() req: RequestWithUser,
  ) {
    return this.workoutService.addExercisesToWorkout(
      id,
      dto,
      this.getUserId(req),
    );
  }

  @Delete(':id/exercises')
  @ApiOperation({ summary: 'Remove one or more exercises from a workout' })
  @ApiOkResponse({
    schema: { example: { message: 'Exercises removed successfully' } },
  })
  removeExercisesFromWorkout(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddRemoveExercisesDto,
    @Req() req: RequestWithUser,
  ) {
    return this.workoutService.removeExercisesFromWorkout(
      id,
      dto,
      this.getUserId(req),
    );
  }
}
