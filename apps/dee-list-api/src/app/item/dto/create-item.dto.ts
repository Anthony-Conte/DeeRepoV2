import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'The name of the list item.',
    example: 'Watermelon',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  public name = '';
}
