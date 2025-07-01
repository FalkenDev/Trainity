import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExerciseModule } from './exercise/exercise.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './strategies/Jwt.strategy';
import { WorkoutModule } from './workout/workout.module';
import { WorkoutSessionModule } from './workoutSession/workoutSession.module';
import { MuscleGroupModule } from './muscleGroup/muscleGroup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // True is for development purposes only, disable in production
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ExerciseModule,
    MuscleGroupModule,
    UserModule,
    WorkoutModule,
    WorkoutSessionModule,
  ],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
