import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Creator } from '../creator/creator.entity';

@Entity('medias')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mediaUrl: string;

  @Column()
  blurredMediaUrl: string;

  @Column()
  creatorId: string;

  @ManyToOne(() => Creator)
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
