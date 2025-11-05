# Changelog

All notable changes to the Frituur Ordering System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup and documentation
- Research flow documentation with 10-step methodology
- Technology stack selection and justification
- Architecture design with modular monolith approach
- Proof of concept implementation plans
- `CategoryEntity` and `MenuItemEntity` with business logic for sorting and filtering
- `InMemoryOrderRepository` implementing repository pattern for order persistence
- `QuoteOrderEndpoint` and `QuoteOrderHttpController` for order price quotes
- Application controllers for Catalog module (`GetCategoriesController`, `GetMenuItemsController`)
- HTTP endpoints for Catalog module (`GetCategoriesEndpoint`, `GetMenuItemsEndpoint`)
- Presenters for Catalog module responses (`CatalogPresenters`)
- Pricing calculation methods in `OrderEntity` (`calculateTotalWithTax`, `estimateReadyTime`)

### Changed

- Renamed `OrderingModule` to `OrderModule` for broader scope
- Integrated pricing logic directly into `OrderEntity` (removed dependency on `PricingModule`)
- Refactored Catalog module to use Complex Pattern (entities, controllers, endpoints, presenters)
- Updated `CreateOrderUseCase` to use `OrderEntity.calculateTotalWithTax()` instead of `PricingPort`
- Updated `CreateOrderEndpoint` and `UpdateOrderStatusEndpoint` to use `OrderRepository` instead of `OrderService`
- Moved quote functionality from Pricing module to Order module
- Updated all module imports and dependencies to reflect OrderModule renaming
- Updated architecture documentation to reflect module restructuring

### Deprecated

- N/A

### Removed

- `PricingModule` (functionality integrated into `OrderModule`)
- All pricing module files (services, controllers, endpoints, presenters)
- Pricing module test files

### Fixed

- Business logic distribution: moved sorting/filtering logic from services to domain entities
- Test files updated to reflect new module structure and dependencies
- Import paths corrected for Catalog module endpoints and presenters
- Type compatibility issues in `CreateOrderUseCase` with `OrderEntity.calculateTotalWithTax()`

### Security

- N/A

## [0.1.0] - 2024-11-24

### Added

- Project initialization
- Research documentation
- Technology selection rationale
- Architecture planning
- Implementation timeline

---

## Version History

- **0.1.0**: Initial project setup and research phase
- **0.2.0**: Planned - Proof of concept implementations
- **0.3.0**: Planned - Backend core development
- **0.4.0**: Planned - Frontend development
- **0.5.0**: Planned - Payment integration
- **0.6.0**: Planned - Admin interface
- **1.0.0**: Planned - Production release

## Development Notes

This changelog will be updated as development progresses. Each major milestone will be documented with specific features, improvements, and fixes.

For more detailed information about the project, see the [README.md](README.md) and [RESEARCH.md](RESEARCH.md) files.
