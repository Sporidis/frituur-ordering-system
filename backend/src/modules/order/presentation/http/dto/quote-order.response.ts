export interface QuoteOrderHttpResponse {
  success: true;
  breakdown: {
    subtotal: number;
    tax: number;
    total: number;
  };
  title?: string;
}
