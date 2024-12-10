import { Repository } from 'typeorm';
import { PersonsService } from './persons.service';
import { Person } from './entities/person.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';

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
          useValue: {
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
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

  describe('create', () => {
    it('should create a new person', async () => {
      // Arange
      // createPersonDto
      const createPersonDto: CreatePersonDto = {
        email: 'pedro@email.com',
        name: 'Pedro',
        password: '123456',
      };
      const passwordHash = 'PASSHASH';

      // Hashing service needs to have the hash method
      // Know if the hashing service was called with createPersonDto
      // Know if the personRepository.create was called with personData
      // Know if personRepository.save was called with the created person
      // The final return must be the new person created -> expect

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);

      // Act
      await personService.create(createPersonDto);

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPersonDto.password,
      );
      expect(personRepository.create).toHaveBeenCalledWith({
        name: createPersonDto.name,
        passwordHash: passwordHash,
        email: createPersonDto.email,
      });
    });
  });
});
