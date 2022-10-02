import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  author: string;
  @Column()
  title: string;
  @Column('text')
  content: string;
  @Column()
  tag: string;
  @CreateDateColumn()
  create_at: string;
  @UpdateDateColumn()
  update_at: string;
}
