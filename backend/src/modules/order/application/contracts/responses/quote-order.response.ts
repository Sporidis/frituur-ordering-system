export interface QuoteOrderResponse {
  breakdown: {
    subtotal: number;
    tax: number;
    total: number;
  };
}
