import { forwardRef, Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { PersonsModule } from 'src/persons/persons.module';
import { MessagesUtils } from './messages.utils';
import { RegexFactory } from 'src/common/regex/regex.factory';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './messages.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => PersonsModule),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesUtils,
    RegexFactory,
    {
      provide: REMOVE_SPACES_REGEX,
      useFactory: (regexFactory: RegexFactory) => {
        return regexFactory.create('RemoveSpacesRegex');
      },
      inject: [RegexFactory],
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useFactory: async (regexFactory: RegexFactory) => {
        // Expect something to happen
        console.log('I will wait for the promise below to be resolved...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('All ready!');

        return regexFactory.create('OnlyLowercaseLettersRegex');
      },
      inject: [RegexFactory],
    },
  ],
  exports: [MessagesUtils],
})
export class MessagesModule {}
