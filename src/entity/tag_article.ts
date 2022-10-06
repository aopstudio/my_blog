import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('TagArticle')
export class TagArticle {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tag: string;
  @Column()
  article_id: number;
  @CreateDateColumn()
  create_at: string;
  @UpdateDateColumn()
  update_at: string;
}
