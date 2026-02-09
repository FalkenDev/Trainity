import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseSeedService } from './exerciseSeed.service';
import { ExerciseController } from './exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { MuscleGroupModule } from '../muscleGroup/muscleGroup.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise]),
    MuscleGroupModule,
    UploadModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService, ExerciseSeedService],
  exports: [TypeOrmModule, ExerciseService, ExerciseSeedService],
})
export class ExerciseModule {}
