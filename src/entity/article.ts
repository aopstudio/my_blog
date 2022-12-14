import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Article')
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
  tags: string;
  @CreateDateColumn()
  create_at: string;
  @UpdateDateColumn()
  update_at: string;
}
