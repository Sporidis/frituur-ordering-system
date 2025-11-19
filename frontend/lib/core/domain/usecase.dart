/// Base interface for all use cases
// Enforces a consistent pattern: UseCase<Input, Output>
abstract class UseCase<Input, Output> {
  /// Execute the use case with the given input
  Future<Output> call(Input input);
}

/// Base interface for use cases that don't require input
abstract class UseCaseNoInput<Output> {
  /// Execute the use case
  Future<Output> call();
}
