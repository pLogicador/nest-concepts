import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable({ scope: Scope.DEFAULT })
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPersonDto.password,
      );

      const personData = {
        name: createPersonDto.name,
        passwordHash,
        email: createPersonDto.email,
        //routePolicies: createPersonDto.routePolicies,
      };

      const newPerson = this.personRepository.create(personData);
      await this.personRepository.save(newPerson);
      return newPerson;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already registered.');
      }

      throw error;
    }
  }

  async findAll() {
    const persons = this.personRepository.find({
      order: {
        id: 'desc',
      },
    });

    return persons;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) {
      throw new NotFoundException('Person not found.');
    }

    return person;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const personData = {
      name: updatePersonDto?.name,
    };

    if (updatePersonDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePersonDto.password,
      );

      personData['passwordHash'] = passwordHash;
    }

    const person = await this.personRepository.preload({
      id,
      ...personData,
    });

    if (!person) {
      throw new NotFoundException('Person not found.');
    }

    if (person.id !== tokenPayload.sub) {
      throw new ForbiddenException('You are not that person.');
    }

    return this.personRepository.save(person);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const person = await this.findOne(id);

    if (person.id !== tokenPayload.sub) {
      throw new ForbiddenException('You are not that person.');
    }

    return this.personRepository.remove(person);
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    if (file.size < 1024) {
      throw new BadRequestException('Very small file');
    }

    const person = await this.findOne(tokenPayload.sub);

    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    person.picture = fileName;
    await this.personRepository.save(person);

    return person;
  }
}
