import { api } from "./api";

export interface DashboardOverviewData {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}

export const dashboardService = {
  /**
   * Get the logged-in user's dashboard overview metrics
   */
  async getOverview(): Promise<DashboardOverviewData> {
    return api.get<DashboardOverviewData>("/api/dashboard/overview");
  },
  async getDashboardOverview(): Promise<DashboardOverviewData> {
    return this.getOverview();
  },
};
