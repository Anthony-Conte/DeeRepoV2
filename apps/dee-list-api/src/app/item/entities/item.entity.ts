import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ length: 255 })
  public name!: string;

  @Column({ type: 'uuid', name: 'created_by_user_id' })
  public createdByUserId!: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;
}
