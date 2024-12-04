import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonsService } from 'src/persons/persons.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable({ scope: Scope.DEFAULT })
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

  async create(
    createMessageDto: CreateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const { toId } = createMessageDto;
    // Find a person to whom the message is being sent
    const to = await this.personsService.findOne(toId);

    // Find a person who is creating the message
    const from = await this.personsService.findOne(tokenPayload.sub);

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
        name: message.from.name,
      },
      to: {
        id: message.to.id,
        name: message.to.name,
      },
    };
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const message = await this.findOne(id);

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException('This message is not yours');
    }

    message.text = updateMessageDto?.text ?? message.text;
    message.read = updateMessageDto?.read ?? message.read;

    await this.messageRepository.save(message);
    return message;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const message = await this.findOne(id);

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException('This message is not yours');
    }

    return this.messageRepository.remove(message);
  }
}
