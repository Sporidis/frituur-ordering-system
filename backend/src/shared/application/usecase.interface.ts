/**
 * UseCase interface following Clean Architecture pattern
 *
 * Use cases return Promise<void> and use OutputPort to present results.
 * This decouples use cases from how results are handled.
 */
export interface UseCase<Input> {
  /**
   * Execute the use case
   * @param input The input data for the use case
   * @returns Promise that resolves when execution is complete
   */
  execute(input: Input): Promise<void>;
}
