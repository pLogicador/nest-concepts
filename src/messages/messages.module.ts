import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { MessagesUtils, MessagesUtilsMock } from './messages.utils';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => PersonsModule),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    {
      provide: MessagesUtils, // Token
      useValue: new MessagesUtilsMock(), // Value to useValue
      //useClass: MessagesUtils,
    },
    {
      provide: SERVER_NAME,
      useValue: 'Im NESTJS',
    },
  ],
  exports: [MessagesUtils, SERVER_NAME],
})
export class MessagesModule {}
