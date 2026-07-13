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
  async getBuyerOrders(): Promise<any[]> {
    return api.get<any[]>("/api/dashboard/orders");
  },
  async getBuyerOrderById(id: string): Promise<any> {
    return api.get<any>(`/api/dashboard/orders/${id}`);
  },
  async getBuyerWishlist(): Promise<any[]> {
    return api.get<any[]>("/api/dashboard/wishlist");
  },
  async addToWishlist(gameId: string): Promise<any> {
    return api.post<any>("/api/dashboard/wishlist", { gameId });
  },
  async removeFromWishlist(id: string): Promise<any> {
    return api.delete<any>(`/api/dashboard/wishlist/${id}`);
  },
  async getBuyerProfile(): Promise<any> {
    return api.get<any>("/api/dashboard/profile");
  },
  async updateBuyerProfile(name: string): Promise<any> {
    return api.patch<any>("/api/dashboard/profile", { name });
  },
  async getSellerOverview(): Promise<any> {
    return api.get<any>("/api/dashboard/seller/overview");
  },
  async getSellerProducts(): Promise<any[]> {
    return api.get<any[]>("/api/dashboard/seller/products");
  },
  async deleteSellerProduct(id: string): Promise<any> {
    return api.delete<any>(`/api/dashboard/seller/products/${id}`);
  },
  async getGames(): Promise<any[]> {
    return api.get<any[]>("/api/games");
  },
  async createSellerProduct(data: any): Promise<any> {
    return api.post<any>("/api/dashboard/seller/products", data);
  },
  async getSellerProductById(id: string): Promise<any> {
    return api.get<any>(`/api/dashboard/seller/products/${id}`);
  },
  async updateSellerProduct(id: string, data: any): Promise<any> {
    return api.patch<any>(`/api/dashboard/seller/products/${id}`, data);
  },
  async getSellerOrders(): Promise<any[]> {
    return api.get<any[]>("/api/dashboard/seller/orders");
  },
  async updateSellerOrderStatus(id: string, status: string): Promise<any> {
    return api.patch<any>(`/api/dashboard/seller/orders/${id}/status`, { orderStatus: status });
  },
  async getSellerAnalytics(): Promise<any> {
    return api.get<any>("/api/dashboard/seller/analytics");
  },
};

