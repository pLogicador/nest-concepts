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
import { MessagesUtils } from './messages.utils';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
  SERVER_NAME,
} from 'src/messages/messages.constant';
import { RegexProtocol } from 'src/common/regex/regex.protocol';

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
    private readonly messagesUtils: MessagesUtils,
    @Inject(SERVER_NAME)
    private readonly serverName: string,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RegexProtocol,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowercaseRegex: RegexProtocol,
  ) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    console.log(this.removeSpacesRegex.execute(this.serverName));
    console.log(this.onlyLowercaseRegex.execute(this.serverName));
    console.log(this.serverName);
    const messages = await this.messagesService.findAll(paginationDto);
    return messages;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log(this.messagesUtils.reverseString('ABCEF'));
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
