export interface Endpoint {
  handle(...args: any[]): Promise<any> | any;
}
