export interface QuoteOrderRequest {
  items: Array<{ name: string; price: number; quantity: number }>;
}
