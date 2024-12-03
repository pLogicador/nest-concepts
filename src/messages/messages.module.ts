import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { MessagesUtils } from './messages.utils';
import { ConfigModule } from '@nestjs/config';
import messagesConfig from './messages.config';

@Module({
  imports: [
    ConfigModule.forFeature(messagesConfig),
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => PersonsModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesUtils],
  exports: [MessagesUtils],
})
export class MessagesModule {}
