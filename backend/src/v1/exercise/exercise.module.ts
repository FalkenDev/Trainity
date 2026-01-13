import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { MuscleGroupModule } from '../muscleGroup/muscleGroup.module';
import { UploadModule } from '../upload/upload.module';
import { GlobalExercise } from '../globalExercise/globalExercise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, GlobalExercise]),
    MuscleGroupModule,
    UploadModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [TypeOrmModule],
})
export class ExerciseModule {}
