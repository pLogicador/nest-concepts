import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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

  @Post()
  create(@Body() body: any) {
    return body;
  }
}
