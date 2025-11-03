import { Module } from '@nestjs/common';
import { CatalogHttpController } from './presentation/http/controllers/catalog.http.controller';
import { CATALOG_USE_CASES } from './application/use-cases';
import { InMemoryCatalogRepository } from './infrastructure/inmemory/catalog.repository';
import { CATALOG_REPOSITORY } from './domain/repositories/catalog.repository';

@Module({
  imports: [],
  providers: [
    ...CATALOG_USE_CASES,
    { provide: CATALOG_REPOSITORY, useClass: InMemoryCatalogRepository },
  ],
  controllers: [CatalogHttpController],
})
export class CatalogModule {}
