import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  hello() {
    return '<h1>Hello World!...</h1>';
  }
}
