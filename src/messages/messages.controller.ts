import { Controller, Get } from '@nestjs/common';

@Controller('messages')
export class MessagesController {

    @Get()
    findAll() {
        return 'this route returns all messages';
    }

    // you can switch between -> fixed/:dynamic/:id
    @Get(':id')
    findOne() {
        return 'this route returns one message';
    }
}
