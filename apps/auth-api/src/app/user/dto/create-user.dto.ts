import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  private static readonly ALLOWED_ROLES = ['admin', 'user', 'editor'];

  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username!: string;

  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'User password',
    minLength: 6
  })
  password!: string;

  @ApiProperty({ example: 'admin', description: 'Role', enum: UserRole })
  @IsString()
  @IsEnum(UserRole)
  role = UserRole.USER;
}
