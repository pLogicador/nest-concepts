import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(LoginDto: LoginDto) {
    return LoginDto;
  }
}
