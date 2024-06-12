import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from '~event/entities/event.entity';
import { NoteEntity } from '~note/entities/note.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string | null;

  @OneToMany(() => EventEntity, event => event.user)
  events: EventEntity[];

  @OneToMany(() => NoteEntity, note => note.user)
  notes: NoteEntity[];
}
