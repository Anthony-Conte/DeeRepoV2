import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create({
      ...createItemDto,
      createdByUserId: '550e8400-e29b-41d4-a716-446655440000', // Replace with actual user ID in a real application
    });

    return this.itemRepository.save(item);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findOne(id: string): Promise<Item | null> {
    return this.itemRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item | null> {
    await this.itemRepository.update(id, updateItemDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.itemRepository.delete(id);
  }
}
