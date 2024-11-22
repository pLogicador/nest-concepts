import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

// CRUD
// Create -> POST       -> Create a message
// Read   -> GET        -> Read all messages
// Read   -> GET        -> Read just one message
// Update -> PATCH/PUT  -> Update a message
// Delete -> DELETE     -> Delete a message

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return {
      id,
      ...body,
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `this route DELETE the message ID ${id}`;
  }
}
