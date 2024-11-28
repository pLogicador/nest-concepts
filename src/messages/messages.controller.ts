import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptor } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
import { SimpleCacheInterceptor } from 'src/common/interceptors/simple-cache.interceptor';

// CRUD
// Create -> POST       -> Create a message
// Read   -> GET        -> Read all messages
// Read   -> GET        -> Read just one message
// Update -> PATCH/PUT  -> Update a message
// Delete -> DELETE     -> Delete a message

// DTO (Data Transfer Object) -> validate data/transform data

@UseInterceptors(SimpleCacheInterceptor)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseInterceptors(TimingConnectionInterceptor, ErrorHandlingInterceptor)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    console.log('MessagesController findAll executed.');
    //return `returns all messages. Limit=${limit}, Offset=${offset}`;
    const messages = await this.messagesService.findAll(paginationDto);
    return messages;
  }

  @UseInterceptors(AddHeaderInterceptor, ErrorHandlingInterceptor)
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
