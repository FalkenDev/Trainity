import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalExercise } from './globalExercise.entity';
import { GlobalExerciseService } from './globalExercise.service';
import { GlobalExerciseController } from './globalExercise.controller';
import { Exercise } from '../exercise/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalExercise, Exercise])],
  providers: [GlobalExerciseService],
  controllers: [GlobalExerciseController],
  exports: [TypeOrmModule],
})
export class GlobalExerciseModule {}
