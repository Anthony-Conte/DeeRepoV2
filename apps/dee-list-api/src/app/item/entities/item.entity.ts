import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Item as ItemInterface } from '@org/models';

@Entity({ name: 'items' })
export class Item implements ItemInterface {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 255 })
  public name!: string;

  @Column({ type: 'uuid', name: 'created_by_user_id' })
  public createdByUserId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @Column({ type: 'boolean', default: false })
  public selected!: boolean;
}
