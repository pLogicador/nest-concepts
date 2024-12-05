import { IsEmail } from 'class-validator';
import { MessageEntity } from 'src/messages/entities/message.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // A person may have sent many messages (as "from")
  // These messages are related to the "from" field in the message entity
  @OneToMany(() => MessageEntity, message => message.from)
  messagesSent: MessageEntity[];

  // A person may have received many messages (as "to")
  // These messages are related to the "to" field in the message entity
  @OneToMany(() => MessageEntity, message => message.to)
  messagesReceived: MessageEntity[];

  @Column({ default: true })
  active: boolean;
}
