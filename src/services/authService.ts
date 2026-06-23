import type { UserRole } from '../types';
import { useStore } from '../hooks/useStore';
import { apiClient, setTokens, clearTokens } from './apiClient';

export const pageAccessRules: Record<string, UserRole[]> = {
  dashboard: ['Collector', 'Commissioner', 'Secretary', 'District Officer', 'Environmental Officer', 'Admin'],
  'active-alerts': ['Collector', 'Commissioner', 'Secretary', 'District Officer', 'Environmental Officer', 'Admin'],
  'gis-intelligence': ['Collector', 'Commissioner', 'Secretary', 'District Officer', 'Environmental Officer', 'Admin'],
  'analytics-desk': ['Collector', 'Commissioner', 'Secretary', 'Admin'],
  'ai-decision-center': ['Collector', 'Commissioner', 'Secretary', 'Admin'],
  'reports-library': ['Collector', 'Commissioner', 'Secretary', 'Admin'],
  'schemes-grants': ['Collector', 'Commissioner', 'Secretary', 'Admin'],
  villages: ['Collector', 'Commissioner', 'Secretary', 'District Officer', 'Admin'],
  officers: ['Collector', 'Commissioner', 'Admin'],
  settings: ['Collector', 'Commissioner', 'Secretary', 'District Officer', 'Environmental Officer', 'Admin']
};

export const authService = {
  login: async (role: UserRole) => {
    try {
      const response: any = await apiClient.post('/api/auth/login', { role });
      if (response.success) {
        useStore.getState().setCurrentRole(role);
        useStore.getState().resetSessionTime();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login failed:", e);
      return false;
    }
  },

  refreshSession: async () => {
    try {
      const response: any = await apiClient.post('/api/auth/refresh', {
        refreshToken: localStorage.getItem('prakriti_refresh_token')
      });
      if (response.success) {
        setTokens(response.token, localStorage.getItem('prakriti_refresh_token') || '');
        useStore.getState().resetSessionTime();
        console.log("JWT Session renewed via refresh token.");
        return true;
      }
      return false;
    } catch (e) {
      console.error("Session refresh failed:", e);
      return false;
    }
  },

  logout: () => {
    clearTokens();
    useStore.getState().setCurrentPage('dashboard');
  },

  hasPageAccess: (role: UserRole, page: string): boolean => {
    const allowedRoles = pageAccessRules[page];
    if (!allowedRoles) return true; // default public
    return allowedRoles.includes(role);
  }
};
export default authService;
