import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './messages.constant';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';

// CRUD
// Create -> POST       -> Create a message
// Read   -> GET        -> Read all messages
// Read   -> GET        -> Read just one message
// Update -> PATCH/PUT  -> Update a message
// Delete -> DELETE     -> Delete a message

// DTO (Data Transfer Object) -> validate data/transform data

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RemoveSpacesRegex,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowercaseLettersRegex: OnlyLowercaseLettersRegex,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    console.log(this.removeSpacesRegex.execute('REMOVES THE SPACES'));
    console.log(this.onlyLowercaseLettersRegex.execute('Removes The SPACES'));
    const messages = await this.messagesService.findAll(paginationDto);
    return messages;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.messagesService.findOne(id);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.messagesService.remove(id);
  }
}
