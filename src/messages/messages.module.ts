import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { MessagesUtils } from './messages.utils';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => PersonsModule),
    MyDynamicModule.register({
      apiKey: 'Here comes the Key API',
      apiUrl: 'http://apiurl.any',
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesUtils],
  exports: [MessagesUtils],
})
export class MessagesModule {}
