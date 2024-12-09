import { Repository } from 'typeorm';
import { PersonsService } from './persons.service';
import { Person } from './entities/person.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PersonsService', () => {
  let personService: PersonsService;
  let personRepository: Repository<Person>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: getRepositoryToken(Person),
          useValue: {},
        },
        {
          provide: HashingService,
          useValue: {},
        },
      ],
    }).compile();

    personService = module.get<PersonsService>(PersonsService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    hashingService = module.get<HashingService>(HashingService);
  });

  it('personService should be defined', () => {
    expect(personService).toBeDefined();
  });
});
