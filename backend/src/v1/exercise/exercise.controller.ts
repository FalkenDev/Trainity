import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/createExercise.dto';
import { UpdateExerciseDto } from './dto/updateExercise.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { ExerciseResponseDto } from './dto/exerciseResponse.dto';
import { RequestWithUser } from '../types/requestWithUser.type';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all exercises for the logged-in user' })
  @ApiOkResponse({ type: [ExerciseResponseDto] })
  getAllExercises(@Req() req: RequestWithUser): Promise<ExerciseResponseDto[]> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.exerciseService.findAll(+req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiCreatedResponse({ type: ExerciseResponseDto })
  createExercise(
    @Body() body: CreateExerciseDto,
    @Req() req: RequestWithUser,
  ): Promise<ExerciseResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.exerciseService.create(body, +req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific exercise by ID' })
  @ApiOkResponse({ type: ExerciseResponseDto })
  getExercise(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<ExerciseResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.exerciseService.findOne(id, +req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific exercise by ID' })
  @ApiOkResponse({ type: ExerciseResponseDto })
  updateExercise(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateExerciseDto,
    @Req() req: RequestWithUser,
  ): Promise<ExerciseResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.exerciseService.update(id, body, +req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific exercise by ID' })
  @ApiOkResponse({ schema: { example: { message: 'Exercise deleted' } } })
  deleteExercise(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ): Promise<{ message: string }> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.exerciseService.remove(id, +req.user.id);
  }
}
