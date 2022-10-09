import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('TagArticle')
@Index(['tag', 'article_id'], { unique: true })
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
