import { Controller, Get } from '@nestjs/common';

@Controller('concepts-manual')
export class ConceptsManualController {
  // methods to respond to the request
  @Get()
  home(): string {
    return '<h1>Welcome to Home (concepts-manual)</h1>';
  }
}
