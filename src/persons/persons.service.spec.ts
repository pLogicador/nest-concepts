import { Repository } from 'typeorm';
import { PersonsService } from './persons.service';
import { Person } from './entities/person.entity';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('PersonsService', () => {
  let personsService: PersonsService;
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
            findOneBy: jest.fn(),
            find: jest.fn(),
            preload: jest.fn(),
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

    personsService = module.get<PersonsService>(PersonsService);
    personRepository = module.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    hashingService = module.get<HashingService>(HashingService);
  });

  it('personService should be defined', () => {
    expect(personsService).toBeDefined();
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
      const result = await personsService.create(createPersonDto);

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

    it('should to throw ConflictException when email already exists', async () => {
      jest.spyOn(personRepository, 'save').mockRejectedValue({
        code: '23505',
      });

      await expect(personsService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should to throw a generic error when an error is sent', async () => {
      jest
        .spyOn(personRepository, 'save')
        .mockRejectedValue(new Error('Generic error'));

      await expect(personsService.create({} as any)).rejects.toThrow(
        new Error('Generic error'),
      );
    });
  });

  describe('findOne', () => {
    it('should return a person if the person is found', async () => {
      const personId = 1;
      const personFound = {
        id: personId,
        name: 'Pedro',
        email: 'pedro@email.com',
        passwordHash: '123456',
      };

      jest
        .spyOn(personRepository, 'findOneBy')
        .mockResolvedValue(personFound as any);

      const result = await personsService.findOne(personId);

      expect(result).toEqual(personFound);
    });

    it('should throw a NotFoundException error when the person does not exist', async () => {
      await expect(personsService.findOne(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all persons', async () => {
      const personsMock: Person[] = [
        {
          id: 1,
          name: 'Pedro',
          email: 'pedro@email.com',
          passwordHash: '123456',
        } as Person,
      ];

      jest.spyOn(personRepository, 'find').mockResolvedValue(personsMock);

      const result = await personsService.findAll();

      expect(result).toEqual(personsMock);
      expect(personRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'desc',
        },
      });
    });
  });

  describe('update', () => {
    it('should update a person if authorized', async () => {
      // Arrange
      const personId = 1;
      const updatePersonDto = { name: 'Katy', password: '141414' };
      const tokenPayload = { sub: personId } as any;
      const passwordHash = 'PASSHASH';
      const updatedPerson = { id: personId, name: 'Katy', passwordHash };

      jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash);
      jest
        .spyOn(personRepository, 'preload')
        .mockResolvedValue(updatedPerson as any);
      jest
        .spyOn(personRepository, 'save')
        .mockResolvedValue(updatedPerson as any);

      // Act
      const result = await personsService.update(
        personId,
        updatePersonDto,
        tokenPayload,
      );

      // Assert
      expect(hashingService.hash).toHaveBeenCalledWith(
        updatePersonDto.password,
      );
      expect(personRepository.preload).toHaveBeenCalledWith({
        id: personId,
        name: updatePersonDto.name,
        passwordHash,
      });
      expect(personRepository.save).toHaveBeenCalledWith(updatedPerson);
      expect(result).toEqual(updatedPerson);
    });

    it('should to throw NotFoundException if the person does not exist', async () => {
      // Arrange
      const personId = 1;
      const updatePersonDto = { name: 'Kate Perry' };
      const tokenPayload = { sub: personId } as any;

      // Simulates that preload returned null
      jest.spyOn(personRepository, 'preload').mockResolvedValue(null);

      // Act and Assert
      await expect(
        personsService.update(personId, updatePersonDto, tokenPayload),
      ).rejects.toThrow(NotFoundException);
    });

    it('should to throw ForbiddenException if unauthorized user', async () => {
      // Arrange
      const personId = 1; // Right user
      const tokenPayload = { sub: 2 } as any; // Wrong user
      const updatePersonDto = { name: 'Maria Five' } as any;
      const existingPerson = { id: personId, name: 'Marron Five' };

      // Simulates that the person exists
      jest
        .spyOn(personRepository, 'preload')
        .mockResolvedValue(existingPerson as any);

      // Act and Assert
      await expect(
        personsService.update(personId, updatePersonDto, tokenPayload),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
