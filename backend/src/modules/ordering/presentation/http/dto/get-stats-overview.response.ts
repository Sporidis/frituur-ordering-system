export interface GetStatsOverviewHttpResponse {
  success: true;
  stats: any;
  connectedClients: Record<string, number>;
  totalConnectedClients: number;
  title?: string;
}
