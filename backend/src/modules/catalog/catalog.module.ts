import { Module } from '@nestjs/common';
import { CatalogHttpController } from './presentation/http/controllers/catalog.http.controller';
import { CatalogQueryService } from './application/catalog.query.service';
import { InMemoryCatalogRepository } from './infrastructure/inmemory/catalog.repository';
import { CATALOG_REPOSITORY } from './domain/repositories/catalog.repository';

@Module({
  imports: [],
  providers: [
    CatalogQueryService,
    { provide: CATALOG_REPOSITORY, useClass: InMemoryCatalogRepository },
  ],
  controllers: [CatalogHttpController],
  exports: [CatalogQueryService],
})
export class CatalogModule {}
