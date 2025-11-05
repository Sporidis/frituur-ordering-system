import { Module } from '@nestjs/common';
import { CatalogHttpController } from './presentation/http/controllers/catalog.http.controller';
import { InMemoryCatalogRepository } from './infrastructure/inmemory/catalog.repository';
import { CATALOG_REPOSITORY } from './domain/repositories/catalog.repository';
import { CATALOG_HTTP_ENDPOINTS } from './presentation/http/endpoints';

@Module({
  imports: [],
  providers: [
    ...CATALOG_HTTP_ENDPOINTS,
    { provide: CATALOG_REPOSITORY, useClass: InMemoryCatalogRepository },
  ],
  controllers: [CatalogHttpController],
})
export class CatalogModule {}
