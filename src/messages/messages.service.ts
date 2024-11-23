import { Injectable } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  private lastId = 1;
  private messages: MessageEntity[] = [
    {
      id: 1,
      text: 'This is a test message',
      from: 'Jane',
      to: 'Robert',
      read: false,
      date: new Date(),
    },
  ];

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    return this.messages.find(item => item.id === +id);
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...body,
    };
    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: string, body: any) {
    const messageExistingIndex = this.messages.findIndex(
      item => item.id === +id,
    );

    if (messageExistingIndex >= 0) {
      const messageExisting = this.messages[messageExistingIndex];

      this.messages[messageExistingIndex] = {
        ...messageExisting,
        ...body,
      };
    }

    return this.messages[messageExistingIndex];
  }

  remove(id: string) {
    const messageExistingIndex = this.messages.findIndex(
      item => item.id === +id,
    );

    if (messageExistingIndex >= 0) {
      this.messages.splice(messageExistingIndex, 1);
    }
  }
}
