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
      const newPerson = {
        id: 1,
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash,
      };

      // Simulating or value returned by hashingService.hash
      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      // Simulating person returned by personRepository.create in personRepository.save
      jest.spyOn(personRepository, 'create').mockReturnValue(newPerson as any);

      // Act
      const result = await personService.create(createPersonDto);

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(
        createPersonDto.password,
      );
      expect(personRepository.create).toHaveBeenCalledWith({
        name: createPersonDto.name,
        passwordHash,
        email: createPersonDto.email,
      });
      expect(personRepository.save).toHaveBeenCalledWith(newPerson);
      expect(result).toEqual(newPerson);
    });
  });
});
