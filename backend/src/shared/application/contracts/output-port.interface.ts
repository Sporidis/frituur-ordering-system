/**
 * OutputPort interface for presenting use case results
 *
 * Use cases call outputPort.present() instead of returning values directly.
 * This decouples use cases from how results are handled (HTTP, WebSocket, CLI, etc.)
 */
export interface OutputPort<Output> {
  /**
   * Present the output from a use case
   * @param output The output data to present
   */
  present(output: Output): void;
}
