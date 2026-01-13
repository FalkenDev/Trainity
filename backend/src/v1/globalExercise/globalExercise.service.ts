import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GlobalExercise } from './globalExercise.entity';
import { GlobalExerciseResponseDto } from './dto/globalExerciseResponse.dto';
import { ImportGlobalExercisesDto } from './dto/importGlobalExercises.dto';
import { Exercise } from '../exercise/exercise.entity';
import { ExerciseResponseDto } from '../exercise/dto/exerciseResponse.dto';

@Injectable()
export class GlobalExerciseService {
  constructor(
    @InjectRepository(GlobalExercise)
    private readonly globalExerciseRepo: Repository<GlobalExercise>,

    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
  ) {}

  private toGlobalResponseDto(
    exercise: GlobalExercise,
  ): GlobalExerciseResponseDto {
    return {
      id: exercise.id,
      i18nKey: exercise.i18nKey,
      defaultName: exercise.defaultName,
      defaultDescription: exercise.defaultDescription,
      image: exercise.image,
      defaultSets: exercise.defaultSets,
      defaultReps: exercise.defaultReps,
      defaultPauseSeconds: exercise.defaultPauseSeconds,
      muscleGroups:
        exercise.muscleGroups?.map((mg) => ({
          id: mg.id,
          name: mg.name,
          description: mg.description,
          createdAt: mg.createdAt,
          updatedAt: mg.updatedAt,
        })) || [],
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    };
  }

  async findAll(): Promise<GlobalExerciseResponseDto[]> {
    const globals = await this.globalExerciseRepo.find({
      relations: ['muscleGroups'],
      order: { defaultName: 'ASC' },
    });
    return globals.map((g) => this.toGlobalResponseDto(g));
  }

  /**
   * Copies global exercises into a user's personal list.
   * If an exercise from a given globalExercise already exists for the user, it is skipped.
   */
  async importToUser(
    dto: ImportGlobalExercisesDto,
    userId: number,
  ): Promise<ExerciseResponseDto[]> {
    const ids = Array.from(new Set(dto.globalExerciseIds ?? [])).filter(
      Boolean,
    );
    if (!ids.length) return [];

    const globals = await this.globalExerciseRepo.find({
      where: { id: In(ids) },
      relations: ['muscleGroups'],
    });

    if (!globals.length) return [];

    const existing = await this.exerciseRepo.find({
      where: {
        createdBy: { id: userId } as any,
        globalExercise: { id: In(globals.map((g) => g.id)) } as any,
        isCustomized: false,
      } as any,
      relations: ['globalExercise'],
    });
    const existingGlobalIds = new Set(
      existing
        .map((e) => e.globalExercise?.id)
        .filter((id): id is number => typeof id === 'number'),
    );

    const toCreate = globals.filter((g) => !existingGlobalIds.has(g.id));
    if (!toCreate.length) return [];

    const created = await this.exerciseRepo.save(
      toCreate.map((g) =>
        this.exerciseRepo.create({
          name: g.defaultName,
          description: g.defaultDescription as any,
          image: g.image as any,
          defaultSets: g.defaultSets ?? 3,
          defaultReps: g.defaultReps ?? 10,
          defaultPauseSeconds: g.defaultPauseSeconds ?? 60,
          createdBy: { id: userId } as any,
          muscleGroups: g.muscleGroups,
          globalExercise: { id: g.id } as any,
          i18nKey: g.i18nKey,
          isNameCustom: false,
          isCustomized: false,
        }),
      ),
    );

    // Convert to the existing ExerciseResponseDto shape (no need to expose everything)
    return created.map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      image: e.image,
      defaultSets: e.defaultSets,
      defaultReps: e.defaultReps,
      defaultPauseSeconds: e.defaultPauseSeconds,
      createdAt: e.createdAt,
      muscleGroups:
        e.muscleGroups?.map((mg) => ({
          id: mg.id,
          name: mg.name,
          description: mg.description,
          createdAt: mg.createdAt,
          updatedAt: mg.updatedAt,
        })) || [],
      globalExerciseId: e.globalExercise?.id,
      i18nKey: e.i18nKey,
      isNameCustom: e.isNameCustom,
    }));
  }
}
