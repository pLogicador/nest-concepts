import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonsService } from 'src/persons/persons.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly personsService: PersonsService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Message not found');
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const messages = await this.messageRepository.find({
      take: limit, // how many records to display (per page)
      skip: offset, // how many records to skip
      //relations: ['from', 'to'],
      order: {
        id: 'desc',
      },
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });
    return messages;
  }

  async findOne(id: number) {
    // const message = this.messages.find(item => item.id === id);
    const message = await this.messageRepository.findOne({
      where: {
        id,
      },
      relations: ['from', 'to'],
      order: {
        id: 'desc',
      },
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    if (message) return message;
    this.throwNotFoundError();
  }

  async create(createMessageDto: CreateMessageDto) {
    const { fromId, toId } = createMessageDto;
    // Find a person who is creating the message
    const from = await this.personsService.findOne(fromId);

    // Find a person to whom the message is being sent
    const to = await this.personsService.findOne(toId);

    const newMessage = {
      text: createMessageDto.text,
      from,
      to,
      read: false,
      date: new Date(),
    };
    const message = await this.messageRepository.create(newMessage);
    await this.messageRepository.save(message);

    return {
      ...message,
      from: {
        id: message.from.id,
      },
      to: {
        id: message.to.id,
      },
    };
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);

    message.text = updateMessageDto?.text ?? message.text;
    message.read = updateMessageDto?.read ?? message.read;

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
