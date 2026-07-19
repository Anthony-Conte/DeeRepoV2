import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsString()
  username!: string;

  @IsString()
  @ApiProperty({
    example: 'password',
    description: 'User password',
    minLength: 6
  })
  password!: string;
}
