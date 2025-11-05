export interface GetStatsOverviewResponse {
  stats: any;
  connectedClients: Record<string, number>;
  totalConnectedClients: number;
}
