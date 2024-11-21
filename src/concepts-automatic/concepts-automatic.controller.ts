import { Controller, Get } from '@nestjs/common';

@Controller('concepts-automatic')
export class ConceptsAutomaticController {
    @Get()
    home(): string {
        return '<h2>Welcome to Home2 (concepts-automatic)</h2>';
    }
}
