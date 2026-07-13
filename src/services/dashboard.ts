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
  async getSellerMessages(): Promise<any[]> {
    return api.get<any[]>("/api/dashboard/seller/messages");
  },
  async getConversation(id: string): Promise<any> {
    return api.get<any>(`/api/dashboard/seller/messages/${id}`);
  },
  async sendMessage(data: { conversationId: string; message: string }): Promise<any> {
    return api.post<any>("/api/dashboard/seller/messages", data);
  },
  async getSellerProfile(): Promise<any> {
    return this.getBuyerProfile();
  },
  async updateSellerProfile(name: string): Promise<any> {
    return this.updateBuyerProfile(name);
  },
  async getAdminOverview(): Promise<any> {
    return api.get<any>("/api/dashboard/admin/overview");
  },
  async getAdminUsers(params: Record<string, string | number>): Promise<any> {
    const query = new URLSearchParams(params as any).toString();
    return api.get<any>(`/api/dashboard/admin/users?${query}`);
  },
  async getAdminUser(id: string): Promise<any> {
    return api.get<any>(`/api/dashboard/admin/users/${id}`);
  },
  async updateAdminUserRole(id: string, role: string): Promise<any> {
    return api.patch<any>(`/api/dashboard/admin/users/${id}/role`, { role });
  },
  async updateAdminUserStatus(id: string, isActive: boolean): Promise<any> {
    return api.patch<any>(`/api/dashboard/admin/users/${id}/status`, { isActive });
  },
  async getAdminGames(params: Record<string, string | number>): Promise<any> {
    const query = new URLSearchParams(params as any).toString();
    return api.get<any>(`/api/dashboard/admin/games?${query}`);
  },
  async getAdminGame(id: string): Promise<any> {
    return api.get<any>(`/api/dashboard/admin/games/${id}`);
  },
  async createAdminGame(data: any): Promise<any> {
    return api.post<any>("/api/dashboard/admin/games", data);
  },
  async updateAdminGame(id: string, data: any): Promise<any> {
    return api.patch<any>(`/api/dashboard/admin/games/${id}`, data);
  },
  async deleteAdminGame(id: string): Promise<any> {
    return api.delete<any>(`/api/dashboard/admin/games/${id}`);
  },
  async getAdminPackages(params: Record<string, string | number>): Promise<any> {
    const query = new URLSearchParams(params as any).toString();
    return api.get<any>(`/api/dashboard/admin/packages?${query}`);
  },
  async getAdminPackage(id: string): Promise<any> {
    return api.get<any>(`/api/dashboard/admin/packages/${id}`);
  },
  async createAdminPackage(data: any): Promise<any> {
    return api.post<any>("/api/dashboard/admin/packages", data);
  },
  async updateAdminPackage(id: string, data: any): Promise<any> {
    return api.patch<any>(`/api/dashboard/admin/packages/${id}`, data);
  },
  async deleteAdminPackage(id: string): Promise<any> {
    return api.delete<any>(`/api/dashboard/admin/packages/${id}`);
  },
  async getGameBySlug(slug: string): Promise<any> {
    return api.get<any>(`/api/games/${slug}`);
  },
  async createBuyerOrder(data: any): Promise<any> {
    return api.post<any>("/api/orders", data);
  },
  async createBuyerPayment(data: any): Promise<any> {
    return api.post<any>("/api/payments", data);
  },
};

