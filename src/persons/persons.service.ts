import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';

// Scope.DEFAULT -> The provider in question is a Singleton (The same instance for everyone)
// Scope.REQUEST -> The provider in question is instantiated with each request
// Scope.TRANSIENT -> Provider instance is created for each class that inject this provider

@Injectable({ scope: Scope.DEFAULT })
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const personData = {
        name: createPersonDto.name,
        passwordHash: createPersonDto.password,
        email: createPersonDto.email,
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

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const personData = {
      name: updatePersonDto?.name,
      passwordHash: updatePersonDto?.password,
    };

    const person = await this.personRepository.preload({
      id,
      ...personData,
    });

    if (!person) {
      throw new NotFoundException('Person not found.');
    }

    return this.personRepository.save(person);
  }

  async remove(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) {
      throw new NotFoundException('Person not found.');
    }

    return this.personRepository.remove(person);
  }
}
