import { registerAs } from '@nestjs/config';

export default registerAs('messages', () => ({
  test1: 'VALUE 1',
  test2: 'VALUE 2',
}));
