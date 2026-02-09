import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './exercise.entity';
import { MuscleGroupService } from '../muscleGroup/muscleGroup.service';
import { exercisesToSeed } from '../seed/data/exercises.data';

@Injectable()
export class ExerciseSeedService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    private readonly muscleGroupService: MuscleGroupService,
  ) {}

  /**
   * Seeds the default exercise catalog for a newly registered user.
   * Each exercise is created as a user-owned Exercise with an i18n key
   * for localized display names.
   */
  async seedDefaultExercises(userId: number): Promise<void> {
    // Fetch all muscle groups once and build a name→entity map
    const allMuscleGroups = await this.muscleGroupService.findAll();
    const mgMap = new Map(allMuscleGroups.map((mg) => [mg.name, mg]));

    const exercises: Exercise[] = [];

    for (const def of exercisesToSeed) {
      const muscleGroups = def.muscleGroups
        .map((name) => mgMap.get(name))
        .filter((mg): mg is NonNullable<typeof mg> => !!mg);

      const exercise = this.exerciseRepo.create({
        name: def.defaultName,
        i18nKey: def.i18nKey,
        isNameCustom: false,
        description: def.defaultDescription ?? '',
        defaultSets: def.defaultSets ?? 3,
        defaultReps: def.defaultReps ?? 10,
        defaultPauseSeconds: def.defaultPauseSeconds ?? 60,
        muscleGroups,
        createdBy: { id: userId } as any,
      });

      exercises.push(exercise);
    }

    await this.exerciseRepo.save(exercises);
  }
}
