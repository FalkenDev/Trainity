import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightLog } from './weightLog.entity';
import { User } from '../user/user.entity';
import { WeightLogService } from './weightLog.service';
import { WeightLogController } from './weightLog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WeightLog, User])],
  controllers: [WeightLogController],
  providers: [WeightLogService],
  exports: [WeightLogService],
})
export class WeightLogModule {}
