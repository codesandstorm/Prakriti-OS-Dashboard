import { useStore } from '../hooks/useStore';

// Mock storage for JWTs
let mockAccessToken = localStorage.getItem('prakriti_access_token') || 'valid_token_123';
let mockRefreshToken = localStorage.getItem('prakriti_refresh_token') || 'valid_refresh_token_456';

export const setTokens = (accessToken: string, refreshToken: string) => {
  mockAccessToken = accessToken;
  mockRefreshToken = refreshToken;
  localStorage.setItem('prakriti_access_token', accessToken);
  localStorage.setItem('prakriti_refresh_token', refreshToken);
};

export const clearTokens = () => {
  mockAccessToken = '';
  mockRefreshToken = '';
  localStorage.removeItem('prakriti_access_token');
  localStorage.removeItem('prakriti_refresh_token');
};

class ApiClient {
  private async simulateLatency() {
    const delay = 200 + Math.random() * 200; // 200-400ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private checkNetwork() {
    const isOnline = useStore.getState().isOnline;
    if (!isOnline) {
      throw new Error("Network Error: Connection dropped. Fallback to cached registry.");
    }
  }

  // Interceptor mimicking token refresh
  private async ensureValidSession() {
    // If token is simulated as expired (e.g. keying off a variable), refresh it
    if (mockAccessToken === 'expired_token') {
      console.log(`Access token expired. Intercepting and refreshing JWT session using refresh token: ${mockRefreshToken}...`);
      await this.simulateLatency();
      // Simulate token refresh success
      mockAccessToken = 'refreshed_valid_token_789';
      localStorage.setItem('prakriti_access_token', mockAccessToken);
      useStore.getState().resetSessionTime();
    }
  }

  public async get<T>(url: string): Promise<T> {
    this.checkNetwork();
    await this.ensureValidSession();
    await this.simulateLatency();
    
    // Log request headers simulation
    console.log(`[API Client] GET ${url} - Headers: { Authorization: Bearer ${mockAccessToken} }`);

    // In a real app, this would perform fetch()
    // Here we resolve the request internally using mock store registers
    return this.routeRequest<T>('GET', url);
  }

  public async post<T>(url: string, data: any): Promise<T> {
    this.checkNetwork();
    await this.ensureValidSession();
    await this.simulateLatency();

    console.log(`[API Client] POST ${url} - Headers: { Authorization: Bearer ${mockAccessToken} } - Data:`, data);
    return this.routeRequest<T>('POST', url, data);
  }

  public async put<T>(url: string, data: any): Promise<T> {
    this.checkNetwork();
    await this.ensureValidSession();
    await this.simulateLatency();

    console.log(`[API Client] PUT ${url} - Headers: { Authorization: Bearer ${mockAccessToken} } - Data:`, data);
    return this.routeRequest<T>('PUT', url, data);
  }

  // Request router for local stores mapping
  private routeRequest<T>(method: string, url: string, data?: any): T {
    const store = useStore.getState();

    if (url.includes('/api/auth/login')) {
      const { role } = data;
      setTokens(`token_for_${role}_${Date.now()}`, `refresh_token_for_${role}_${Date.now()}`);
      return { success: true, role } as any;
    }

    if (url.includes('/api/auth/refresh')) {
      setTokens('refreshed_token_val_999', 'refresh_token_val_999');
      return { success: true, token: 'refreshed_token_val_999' } as any;
    }

    if (url.includes('/api/officers')) {
      if (method === 'GET') {
        return store.officers as any;
      }
    }

    if (url.includes('/api/tasks')) {
      if (method === 'GET') {
        return store.officerTasks as any;
      }
      if (method === 'POST') {
        return data as any; // Returns created task
      }
    }

    if (url.includes('/api/incidents')) {
      return store.incidents as any;
    }

    throw new Error(`Endpoint not configured in Central API Client: ${url}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
