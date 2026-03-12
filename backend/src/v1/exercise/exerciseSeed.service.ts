/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
        exerciseType: def.exerciseType,
        equipment: def.equipment,
        instructions: def.instructions,
        proTips: def.proTips,
        mistakes: def.mistakes,
        muscleGroups,
        createdBy: { id: userId } as any,
      });

      exercises.push(exercise);
    }

    await this.exerciseRepo.save(exercises);
  }
}
