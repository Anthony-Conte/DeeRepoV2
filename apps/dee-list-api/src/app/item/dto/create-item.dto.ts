import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { CreateItemDto } from '@org/models';

export class CreateItemRequest implements CreateItemDto {
  @ApiProperty({
    description: 'The name of the list item.',
    example: 'Watermelon',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  public name = '';
}
