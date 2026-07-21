import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req
} from '@nestjs/common';

import { ItemService } from './item.service';
import { UpdateItemDto } from './dto/update-item.dto';
import { CreateItemRequest } from './dto/create-item.dto';
import { AuthenticatedRequest, JwtAuthGuard } from '@org/auth';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createItemDto: CreateItemRequest
  ) {
    return this.itemService.create(createItemDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.itemService.findAll(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.itemService.findOne(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.itemService.update(id, updateItemDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.itemService.remove(id, req.user.sub);
  }
}
