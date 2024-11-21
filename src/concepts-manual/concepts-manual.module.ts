import { Module } from '@nestjs/common';
import { ConceptsManualController } from './concepts-manual.controller';

@Module({
  controllers: [ConceptsManualController],
})
export class ConceptsManualModule {}
