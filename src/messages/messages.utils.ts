import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesUtils {
  reverseString(str: string) {
    return str.split('').reverse().join('');
  }
}
