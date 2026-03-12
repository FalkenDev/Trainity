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

import { DataSource } from 'typeorm';
import { Activity } from '../../activity/activity.entity';
import { User } from '../../user/user.entity';
import { activitiesToSeed } from '../data/activities.data';

export async function seedActivities(
  dataSource: DataSource,
  user: User,
): Promise<void> {
  const activityRepo = dataSource.getRepository(Activity);

  for (const activity of activitiesToSeed) {
    const act = activityRepo.create({
      ...activity,
      createdBy: user,
    });
    await activityRepo.save(act);
  }

  console.log(`🏃 Seeded ${activitiesToSeed.length} default activit(y/ies)`);
}
