import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RequestWithUser } from '../types/requestWithUser.type';
import { GlobalExerciseService } from './globalExercise.service';
import { GlobalExerciseResponseDto } from './dto/globalExerciseResponse.dto';
import { ImportGlobalExercisesDto } from './dto/importGlobalExercises.dto';
import { ExerciseResponseDto } from '../exercise/dto/exerciseResponse.dto';

@ApiTags('global-exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('global-exercises')
export class GlobalExerciseController {
  constructor(private readonly globalExerciseService: GlobalExerciseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all global exercises (predefined)' })
  @ApiOkResponse({ type: [GlobalExerciseResponseDto] })
  getAll(): Promise<GlobalExerciseResponseDto[]> {
    return this.globalExerciseService.findAll();
  }

  @Post('import')
  @ApiOperation({
    summary: 'Copy selected global exercises into the user account',
  })
  @ApiCreatedResponse({ type: [ExerciseResponseDto] })
  importToUser(
    @Body() body: ImportGlobalExercisesDto,
    @Req() req: RequestWithUser,
  ): Promise<ExerciseResponseDto[]> {
    if (!req.user?.id)
      throw new UnauthorizedException('User not authenticated');
    return this.globalExerciseService.importToUser(body, +req.user.id);
  }
}
