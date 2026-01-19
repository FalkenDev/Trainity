import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../../user/user.entity';
import { usersToSeed } from '../data/users.data';

export async function seedUsers(dataSource: DataSource): Promise<User[]> {
  const userRepo = dataSource.getRepository(User);

  const createdUsers: User[] = [];
  for (const u of usersToSeed) {
    const password = await bcrypt.hash(u.password, 10);
    const user = userRepo.create({ ...u, password });
    await userRepo.save(user);
    createdUsers.push(user);
  }

  console.log(`👤 Seeded ${createdUsers.length} user(s)`);
  return createdUsers;
}
