import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';
import { AuthAndPolicyGuard } from 'src/auth/guards/auth-and-policy.guard';

// CRUD
// Create -> POST       -> Create a message
// Read   -> GET        -> Read all messages
// Read   -> GET        -> Read just one message
// Update -> PATCH/PUT  -> Update a message
// Delete -> DELETE     -> Delete a message

// DTO (Data Transfer Object) -> validate data/transform data

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const messages = await this.messagesService.findAll(paginationDto);
    return messages;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.messagesService.findOne(id);
  }

  @SetRoutePolicy(RoutePolicies.createMessage)
  @UseGuards(AuthAndPolicyGuard)
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messagesService.create(createMessageDto, tokenPayload);
  }

  @SetRoutePolicy(RoutePolicies.updateMessage)
  @UseGuards(AuthAndPolicyGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messagesService.update(id, updateMessageDto, tokenPayload);
  }

  @SetRoutePolicy(RoutePolicies.deleteMessage)
  @UseGuards(AuthAndPolicyGuard)
  @Delete(':id')
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messagesService.remove(id, tokenPayload);
  }
}
