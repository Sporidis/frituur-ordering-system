sealed class Result<T> {
  const Result();

  bool get isSuccess => this is Success<T>;
  bool get isError => this is ErrorResult<T>;
  R when<R>({
    required R Function(T) success,
    required R Function(String) error,
  }) {
    final self = this;
    if (self is Success<T>) return success(self.value);
    if (self is ErrorResult<T>) return error(self.message);
    throw StateError('Unknown Result type');
  }
}

final class Success<T> extends Result<T> {
  final T value;
  const Success(this.value);
}

final class ErrorResult<T> extends Result<T> {
  final String message;
  const ErrorResult(this.message);
}
