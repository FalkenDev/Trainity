import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuscleGroup } from './muscleGroup.entity';
import { MuscleGroupService } from './muscleGroup.service';
import { MuscleGroupController } from './muscleGroup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MuscleGroup])],
  providers: [MuscleGroupService],
  controllers: [MuscleGroupController],
  exports: [MuscleGroupService],
})
export class MuscleGroupModule {}
