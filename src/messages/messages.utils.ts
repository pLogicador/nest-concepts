import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesUtils {
  reverseString(str: string) {
    console.log('Not Mock');
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class MessagesUtilsMock {
  reverseString() {
    console.log('I passed the Mock');
    return 'Im pretending';
  }
}
