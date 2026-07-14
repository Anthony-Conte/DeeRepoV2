import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ length: 255 })
  public name: string;

  //   @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  //   @JoinColumn({ name: 'created_by_user_id' })
  //   public createdBy: User;

  @RelationId((item: ListItem) => item.createdBy)
  public createdByUserId: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;
}
