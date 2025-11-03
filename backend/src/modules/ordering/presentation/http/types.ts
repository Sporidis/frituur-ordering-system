export type OrderView = {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  estimatedReadyTime: string;
  createdAt: string;
};
