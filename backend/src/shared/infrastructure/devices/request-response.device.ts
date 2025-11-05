/**
 * RequestResponse device for capturing output from OutputPort
 * Used in HTTP endpoints to capture use case results
 */
export interface RequestResponseDevice<Data> {
  /**
   * Get the captured response data
   */
  readonly response: Data | undefined;

  /**
   * Update the device with new data
   * Called by presenters that implement OutputPort
   */
  update(data: Data): void;
}

/**
 * RequestResponse device implementation
 * Captures output from OutputPort for HTTP responses
 */
export class RequestResponse<Data> implements RequestResponseDevice<Data> {
  private _data: Data | undefined;

  constructor() {
    this._data = undefined;
  }

  get response(): Data | undefined {
    return this._data;
  }

  update(data: Data): void {
    this._data = data;
  }
}
