import { Controller, Get } from '@nestjs/common';
//import { AppService } from './app.service';

@Controller('first')
export class AppController {
  //constructor(private readonly appService: AppService) {}

  @Get('second') // Now this route responds -> http://localhost:3000/first/second
  getHello(): string {
    return "<p>@Get is a request method. Just for reference, it is part of the 'R' of CRUD</p>";
  }

  @Get('example')
  example() {
    return '<h1>Example route</h1>';
  }
}
