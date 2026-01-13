import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/v1/user/user.entity';

export class UserWithoutPasswordDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ default: true })
  showRpe: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatar = user.avatar;
    this.showRpe = user.showRpe ?? true;
  }
}
