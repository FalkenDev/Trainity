import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressPhoto } from './progressPhoto.entity';
import { User } from '../user/user.entity';
import { ProgressPhotoService } from './progressPhoto.service';
import { ProgressPhotoController } from './progressPhoto.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProgressPhoto, User]), UploadModule],
  controllers: [ProgressPhotoController],
  providers: [ProgressPhotoService],
})
export class ProgressPhotoModule {}
