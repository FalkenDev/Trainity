import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { ExerciseMedia } from './exerciseMedia.entity';
import { CreateExerciseDto } from './dto/createExercise.dto';
import { UpdateExerciseDto } from './dto/updateExercise.dto';
import { ExerciseResponseDto } from './dto/exerciseResponse.dto';
import { MuscleGroupService } from '../muscleGroup/muscleGroup.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(ExerciseMedia)
    private readonly mediaRepo: Repository<ExerciseMedia>,
    private readonly muscleGroupService: MuscleGroupService,
    private readonly uploadService: UploadService,
  ) {}

  private toResponseDto(exercise: Exercise): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      i18nKey: exercise.i18nKey,
      isNameCustom: exercise.isNameCustom,
      description: exercise.description,
      image: exercise.image,
      exerciseType: exercise.exerciseType,
      createdAt: exercise.createdAt,
      deletedAt: exercise.deletedAt,
      defaultPauseSeconds: exercise.defaultPauseSeconds,
      defaultReps: exercise.defaultReps,
      defaultSets: exercise.defaultSets,
      equipment: exercise.equipment || [],
      instructions: exercise.instructions || [],
      proTips: exercise.proTips || [],
      mistakes: exercise.mistakes || [],
      primaryMuscleGroup: exercise.primaryMuscleGroup
        ? {
            id: exercise.primaryMuscleGroup.id,
            name: exercise.primaryMuscleGroup.name,
            description: exercise.primaryMuscleGroup.description,
            createdAt: exercise.primaryMuscleGroup.createdAt,
            updatedAt: exercise.primaryMuscleGroup.updatedAt,
          }
        : undefined,
      muscleGroups:
        exercise.muscleGroups?.map((mg) => ({
          id: mg.id,
          name: mg.name,
          description: mg.description,
          createdAt: mg.createdAt,
          updatedAt: mg.updatedAt,
        })) || [],
      media:
        exercise.media
          ?.sort((a, b) => a.order - b.order)
          .map((m) => ({
            id: m.id,
            type: m.type,
            url: m.url,
            order: m.order,
          })) || [],
    };
  }

  private toResponseList(exercises: Exercise[]): ExerciseResponseDto[] {
    return exercises.map((e) => this.toResponseDto(e));
  }

  async findAll(userId: number): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseRepo.find({
      where: { createdBy: { id: userId } },
      relations: ['muscleGroups', 'primaryMuscleGroup', 'media'],
    });

    return this.toResponseList(exercises);
  }

  async findOne(id: number, userId: number): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['muscleGroups', 'primaryMuscleGroup', 'media'],
      withDeleted: true,
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return this.toResponseDto(exercise);
  }

  async create(
    dto: CreateExerciseDto,
    userId: number,
  ): Promise<ExerciseResponseDto> {
    const { muscleGroupIds, primaryMuscleGroupId, ...exerciseData } = dto;

    const exercise = this.exerciseRepo.create({
      ...exerciseData,
      createdBy: { id: userId } as any,
    });

    if (muscleGroupIds && muscleGroupIds.length > 0) {
      exercise.muscleGroups =
        await this.muscleGroupService.findByIds(muscleGroupIds);
    }

    if (primaryMuscleGroupId) {
      exercise.primaryMuscleGroup =
        await this.muscleGroupService.findOne(primaryMuscleGroupId);
    }

    const saved = await this.exerciseRepo.save(exercise);

    // Re-fetch with all relations
    return this.findOne(saved.id, userId);
  }

  async update(
    id: number,
    dto: UpdateExerciseDto,
    userId: number,
  ): Promise<ExerciseResponseDto> {
    const { muscleGroupIds, primaryMuscleGroupId, ...exerciseData } = dto;

    const existing = await this.exerciseRepo.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['muscleGroups', 'primaryMuscleGroup', 'media'],
    });

    if (!existing) {
      throw new NotFoundException('Exercise not found');
    }

    // If the user changes the name on an exercise that has an i18n key,
    // mark it as custom so we stop using the translation.
    if (
      typeof exerciseData.name === 'string' &&
      existing.i18nKey &&
      exerciseData.name.trim() !== '' &&
      exerciseData.name !== existing.name
    ) {
      existing.isNameCustom = true;
    }

    Object.assign(existing, exerciseData);

    // Check if muscleGroupIds were provided in the DTO
    if (muscleGroupIds !== undefined) {
      existing.muscleGroups =
        await this.muscleGroupService.findByIds(muscleGroupIds);
    }

    // Handle primaryMuscleGroupId
    if (primaryMuscleGroupId !== undefined) {
      if (primaryMuscleGroupId === null) {
        existing.primaryMuscleGroup = undefined;
      } else {
        existing.primaryMuscleGroup =
          await this.muscleGroupService.findOne(primaryMuscleGroupId);
      }
    }

    const updated = await this.exerciseRepo.save(existing);
    return this.toResponseDto(updated);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id, createdBy: { id: userId } },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    await this.exerciseRepo.softRemove(exercise);
    return { message: 'Exercise deleted' };
  }

  async updateImage(
    id: number,
    imageUrl: string,
    userId: number,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id, createdBy: { id: userId } },
      relations: ['muscleGroups', 'primaryMuscleGroup', 'media'],
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // Delete old image if exists
    if (exercise.image) {
      await this.uploadService.deleteImage(exercise.image);
    }

    // Update image URL
    exercise.image = imageUrl;
    const updated = await this.exerciseRepo.save(exercise);

    return this.toResponseDto(updated);
  }

  // --- Media management ---

  async addMedia(
    exerciseId: number,
    userId: number,
    mediaUrl: string,
    mediaType: string,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId, createdBy: { id: userId } },
      relations: ['muscleGroups', 'primaryMuscleGroup', 'media'],
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const maxOrder = exercise.media?.length
      ? Math.max(...exercise.media.map((m) => m.order))
      : -1;

    const media = this.mediaRepo.create({
      type: mediaType as any,
      url: mediaUrl,
      order: maxOrder + 1,
      exercise,
    });

    await this.mediaRepo.save(media);

    return this.findOne(exerciseId, userId);
  }

  async removeMedia(
    exerciseId: number,
    mediaId: number,
    userId: number,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId, createdBy: { id: userId } },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    const media = await this.mediaRepo.findOne({
      where: { id: mediaId, exercise: { id: exerciseId } },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    // Delete the file from disk
    await this.uploadService.deleteImage(media.url);

    await this.mediaRepo.remove(media);

    return this.findOne(exerciseId, userId);
  }

  async reorderMedia(
    exerciseId: number,
    mediaIds: number[],
    userId: number,
  ): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId, createdBy: { id: userId } },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    for (let i = 0; i < mediaIds.length; i++) {
      await this.mediaRepo.update(
        { id: mediaIds[i], exercise: { id: exerciseId } },
        { order: i },
      );
    }

    return this.findOne(exerciseId, userId);
  }
}
