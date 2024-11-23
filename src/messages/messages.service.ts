import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

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

  throwNotFoundError() {
    throw new NotFoundException('Message not found');
  }

  findAll() {
    return this.messages;
  }

  findOne(id: number) {
    const message = this.messages.find(item => item.id === id);

    if (message) return message;
    this.throwNotFoundError();
  }

  create(createMessageDto: CreateMessageDto) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...createMessageDto,
      read: false,
      date: new Date(),
    };
    this.messages.push(newMessage);

    return newMessage;
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    const messageExistingIndex = this.messages.findIndex(
      item => item.id === +id,
    );

    if (messageExistingIndex < 0) {
      this.throwNotFoundError();
    }

    const messageExisting = this.messages[messageExistingIndex];

    this.messages[messageExistingIndex] = {
      ...messageExisting,
      ...updateMessageDto,
    };

    return this.messages[messageExistingIndex];
  }

  remove(id: number) {
    const messageExistingIndex = this.messages.findIndex(
      item => item.id === id,
    );

    if (messageExistingIndex < 0) {
      this.throwNotFoundError();
    }

    const message = this.messages[messageExistingIndex];

    this.messages.splice(messageExistingIndex, 1);

    return message;
  }
}
