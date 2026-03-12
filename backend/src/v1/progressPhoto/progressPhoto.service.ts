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

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgressPhoto } from './progressPhoto.entity';
import { User } from '../user/user.entity';
import { CreateProgressPhotoDto } from './dto/createProgressPhoto.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProgressPhotoService {
  constructor(
    @InjectRepository(ProgressPhoto)
    private readonly photoRepo: Repository<ProgressPhoto>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(userId: number): Promise<ProgressPhoto[]> {
    return this.photoRepo.find({
      where: { user: { id: userId } },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async create(
    userId: number,
    file: any,
    dto: CreateProgressPhotoDto,
  ): Promise<ProgressPhoto> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const photoUrl = await this.uploadService.processProgressPhoto(file);

    const photo = this.photoRepo.create({
      user,
      photoUrl,
      date: dto.date ?? new Date().toISOString().split('T')[0],
      poseTag: dto.poseTag ?? null,
      notes: dto.notes ?? null,
    });

    return this.photoRepo.save(photo);
  }

  async delete(userId: number, photoId: number): Promise<void> {
    const photo = await this.photoRepo.findOne({
      where: { id: photoId },
      relations: ['user'],
    });

    if (!photo) throw new NotFoundException('Photo not found');
    if (photo.user.id !== userId)
      throw new ForbiddenException('Not your photo');

    await this.uploadService.deleteImage(photo.photoUrl);
    await this.photoRepo.remove(photo);
  }
}
