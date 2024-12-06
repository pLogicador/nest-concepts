import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personsService.create(createPersonDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll() {
    return this.personsService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personsService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personsService.update(+id, updatePersonDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personsService.remove(+id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FilesInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    const result = [];
    files.forEach(async file => {
      const fileExtension = path
        .extname(file.originalname)
        .toLowerCase()
        .substring(1);
      const fileName = `${randomUUID()}.${fileExtension}`;
      const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

      result.push(fileFullPath);

      await fs.writeFile(fileFullPath, file.buffer);
    });

    return result;
    /*
    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    return {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: {},
      size: file.size,
    };*/
  }
}
