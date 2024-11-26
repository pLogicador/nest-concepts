import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonsService } from 'src/persons/persons.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly personService: PersonsService,
  ) {}

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
    // Find a person who is creating the message
    // Find a person to whom the message is being sent

    const newMessage = {
      ...createMessageDto,
      read: false,
      date: new Date(),
    };
    const message = await this.messageRepository.create(newMessage);
    return this.messageRepository.save(message);
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const partialUpdateMessageDto = {
      read: updateMessageDto?.read,
      text: updateMessageDto?.text,
    };
    const message = await this.messageRepository.preload({
      id,
      ...partialUpdateMessageDto,
    });

    if (!message) return this.throwNotFoundError();

    await this.messageRepository.save(message);

    return message;
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({
      id,
    });

    if (!message) return this.throwNotFoundError();

    return this.messageRepository.remove(message);
  }
}
