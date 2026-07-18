import { PartialType } from '@nestjs/mapped-types';
import { CreateItemRequest } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemRequest) {}
