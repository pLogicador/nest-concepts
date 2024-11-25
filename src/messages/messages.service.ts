import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

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

  async findAll() {
    const messages = await this.messageRepository.find();
    return messages;
  }

  async findOne(id: number) {
    // const message = this.messages.find(item => item.id === id);
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
    });

    if (message) return message;
    this.throwNotFoundError();
  }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = {
      ...createMessageDto,
      read: false,
      date: new Date(),
    };
    const message = await this.messageRepository.create(newMessage);
    return this.messageRepository.save(message);
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

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({
      id,
    });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.remove(message);
  }
}
