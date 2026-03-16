/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
