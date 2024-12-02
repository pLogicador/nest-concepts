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
      provide: REMOVE_SPACES_REGEX, // token
      useFactory: (regexFactory: RegexFactory) => {
        // My Code
        return regexFactory.create('RemoveSpacesRegex');
      }, // Factory
      inject: [RegexFactory], // Injecting in Factory in Order
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX, // token
      useFactory: (regexFactory: RegexFactory) => {
        // My Code
        return regexFactory.create('OnlyLowercaseLettersRegex');
      }, // Factory
      inject: [RegexFactory], // Injecting in Factory in Order
    },
  ],
  exports: [MessagesUtils],
})
export class MessagesModule {}
