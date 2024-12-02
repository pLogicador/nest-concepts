import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { MessagesUtils, MessagesUtilsMock } from './messages.utils';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from 'src/messages/messages.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';

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
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useClass: OnlyLowercaseLettersRegex,
    },
    {
      provide: REMOVE_SPACES_REGEX,
      useClass: RemoveSpacesRegex,
    },
  ],
  exports: [MessagesUtils, SERVER_NAME],
})
export class MessagesModule {}
