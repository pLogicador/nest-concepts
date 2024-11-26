import { Person } from 'src/persons/entities/person.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  text: string;

  @Column({ default: false })
  read: boolean;

  @Column()
  date: Date; // createdAt

  @CreateDateColumn()
  createdAt?: Date; // createdAt

  @UpdateDateColumn()
  updatedAt?: Date; // updatedAt

  //Many messages can be sent by one person (sender)
  @ManyToOne(() => Person)
  // Specifies the "from" column that stores the ID of the person who sent the message
  @JoinColumn({ name: 'from' })
  from: Person;

  //Many messages can be sent to one person (recipient)
  @ManyToOne(() => Person)
  // Specifies the "to" column that stores the ID of the person receiving the message
  @JoinColumn({ name: 'to' })
  to: Person;
}
