import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { PersonsModule } from 'src/persons/persons.module';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), PersonsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
