import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './exercise.entity';
import { MuscleGroupModule } from '../muscleGroup/muscleGroup.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise]), MuscleGroupModule],
  controllers: [ExerciseController],
  providers: [ExerciseService],
  exports: [TypeOrmModule],
})
export class ExerciseModule {}
