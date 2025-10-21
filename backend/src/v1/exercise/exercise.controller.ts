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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/createExercise.dto';
import { UpdateExerciseDto } from './dto/updateExercise.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { ExerciseResponseDto } from './dto/exerciseResponse.dto';
import { RequestWithUser } from '../types/requestWithUser.type';
import { UploadService } from '../upload/upload.service';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly uploadService: UploadService,
  ) {}

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

  @Post(':id/image')
  @ApiOperation({ summary: 'Upload an image for an exercise' })
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
  @ApiOkResponse({ type: ExerciseResponseDto })
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  async uploadExerciseImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<ExerciseResponseDto> {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate the uploaded file
    const validation = this.uploadService.validateImageFile(file);
    if (!validation.valid) {
      throw new BadRequestException(validation.error);
    }

    // Process and save the image
    const imageUrl = await this.uploadService.processExerciseImage(file);

    // Update the exercise with the new image URL
    return this.exerciseService.updateImage(id, imageUrl, +req.user.id);
  }
}
