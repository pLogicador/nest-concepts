import { Controller, Get, Param } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  @Get()
  findAll() {
    return 'this route returns all messages';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `this route returns the message ID ${id}`;
  }
}
