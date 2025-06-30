import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  avatar?: string;
}
