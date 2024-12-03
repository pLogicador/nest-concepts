import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Person } from 'src/persons/entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingService,
  ) {}

  async login(LoginDto: LoginDto) {
    const person = await this.personRepository.findOneBy({
      email: LoginDto.email,
    });

    if (!person) {
      throw new UnauthorizedException('Person does not exist.');
    }

    const passwordIsValid = await this.hashingService.compare(
      LoginDto.password,
      person.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password.');
    }

    // Here we will make the new token and we will deliver to the user in the answer

    return {
      message: 'User logged!!',
    };
  }
}
