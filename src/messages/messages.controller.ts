import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';

@Controller('messages')
export class MessagesController {
  @HttpCode(HttpStatus.OK)
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
