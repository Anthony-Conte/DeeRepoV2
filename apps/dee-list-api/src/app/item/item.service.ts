import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { CreateItemDto } from '@org/models';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {}

  async create(
    createItemDto: CreateItemDto,
    createdByUserId: string
  ): Promise<Item> {
    const item = this.itemRepository.create({
      ...createItemDto,
      createdByUserId
    });

    return this.itemRepository.save(item);
  }

  async findAll(createdByUserId: string): Promise<Item[]> {
    return this.itemRepository.find({
      where: { createdByUserId }
    });
  }

  async findOne(id: string, createdByUserId: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: {
        id,
        createdByUserId
      }
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async update(
    id: string,
    updateItemDto: UpdateItemDto,
    createdByUserId: string
  ): Promise<Item> {
    const result = await this.itemRepository.update(
      {
        id,
        createdByUserId
      },
      updateItemDto
    );

    if (result.affected === 0) {
      throw new NotFoundException('Item not found');
    }

    return this.findOne(id, createdByUserId);
  }

  async remove(id: string, createdByUserId: string): Promise<void> {
    const result = await this.itemRepository.delete({
      id,
      createdByUserId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Item not found');
    }
  }
}
