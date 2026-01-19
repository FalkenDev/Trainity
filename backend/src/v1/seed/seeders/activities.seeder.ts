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
