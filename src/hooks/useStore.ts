import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Officer, Incident, UserRole, AppSettings, AppNotification, DashboardFilters, BaseMapMode, GisBoundary, OfficerTask, AuditTrailLog } from '../types';
import { mpOfficers, mpIncidents } from '../services/mpMockData';
import { initialOfficerTasks, initialAuditLogs } from '../services/officerWorkflowMock';

interface CommandCenterState {
  // Theme & Settings
  settings: AppSettings;
  updateSettings: (updater: Partial<AppSettings>) => void;
  toggleTheme: () => void;

  // Authentication & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Connection & Connection telemetry
  isOnline: boolean;
  toggleConnection: () => void;
  sessionTimeRemaining: number; // in seconds
  decrementSessionTime: () => void;
  resetSessionTime: () => void;

  // Navigation & History
  currentPage: 'dashboard' | 'mission' | 'analysis' | 'officers' | 'settings' | 'reports' | 'villages';
  setCurrentPage: (page: 'dashboard' | 'mission' | 'analysis' | 'officers' | 'settings' | 'reports' | 'villages') => void;
  navigationHistory: string[];
  clearNavigationHistory: () => void;
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  
  selectedVillageId: string;
  setSelectedVillageId: (id: string) => void;

  // GIS layers & telemetry
  activeLayers: string[];
  toggleLayer: (layerId: string) => void;
  mapZoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  coordinates: string;
  setCoordinates: (coords: string) => void;

  // Extended GIS parameters
  gisViewMode: 'single' | 'split';
  setGisViewMode: (mode: 'single' | 'split') => void;
  activeBaseMap: BaseMapMode;
  setActiveBaseMap: (mapMode: BaseMapMode) => void;
  splitBaseMap: BaseMapMode;
  setSplitBaseMap: (mapMode: BaseMapMode) => void;
  timelineYear: number;
  setTimelineYear: (year: number) => void;
  selectedGisBoundary: GisBoundary | null;
  setSelectedGisBoundary: (boundary: GisBoundary | null) => void;
  measurementTool: 'distance' | 'area' | null;
  setMeasurementTool: (tool: 'distance' | 'area' | null) => void;
  drawingMode: 'point' | 'polyline' | 'polygon' | null;
  setDrawingMode: (mode: 'point' | 'polyline' | 'polygon' | null) => void;

  // Right Inspector Drawer
  selectedOfficer: Officer | null;
  setSelectedOfficer: (officer: Officer | null) => void;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  selectedVillage: any | null;
  setSelectedVillage: (village: any | null) => void;
  selectedScheme: any | null;
  setSelectedScheme: (scheme: any | null) => void;
  
  inspectorType: 'officer' | 'incident' | 'village' | 'scheme' | 'map' | null;
  setInspectorType: (type: 'officer' | 'incident' | 'village' | 'scheme' | 'map' | null) => void;
  isDrawerOpen: boolean;
  setDrawerOpen: (isOpen: boolean) => void;
  isDrawerPinned: boolean;
  toggleDrawerPin: () => void;
  drawerWidth: number; // in pixels
  setDrawerWidth: (width: number) => void;

  // Bottom Analytics Dock
  activeDockTab: 'analytics' | 'logs' | 'timeline' | 'audit' | 'downloads' | 'performance';
  setActiveDockTab: (tab: 'analytics' | 'logs' | 'timeline' | 'audit' | 'downloads' | 'performance') => void;
  isDockExpanded: boolean;
  setDockExpanded: (isExpanded: boolean) => void;
  dockHeight: number; // in pixels
  setDockHeight: (height: number) => void;

  // Notifications center
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'archived'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  archiveNotification: (id: string) => void;
  clearNotification: (id: string) => void;

  // Universal Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  isSearchOpen: boolean;
  setSearchOpen: (isOpen: boolean) => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (isOpen: boolean) => void;

  // Incidents List & Intel
  incidents: Incident[];
  isIntelOpen: boolean;
  setIntelOpen: (isOpen: boolean) => void;

  // Officers List
  officers: Officer[];

  // Filters
  filters: {
    dateRange: string;
    region: string;
    sector: string;
    pollutant: string;
  };
  setFilter: (key: 'dateRange' | 'region' | 'sector' | 'pollutant', value: string) => void;

  // Overview Dashboard Filters & Loading State
  dashboardFilters: DashboardFilters;
  setDashboardFilter: (key: keyof DashboardFilters, value: string) => void;
  isDashboardLoading: boolean;
  setDashboardLoading: (loading: boolean) => void;

  // AI Scenario Simulation variables
  policyBudgetModifier: number;
  industrialEnforcement: number;
  reforestationTarget: number;
  setPolicyBudgetModifier: (val: number) => void;
  setIndustrialEnforcement: (val: number) => void;
  setReforestationTarget: (val: number) => void;

  // Government Analytics states
  analyticsTab: 'schemes' | 'budget' | 'pensions' | 'incentives';
  setAnalyticsTab: (tab: 'schemes' | 'budget' | 'pensions' | 'incentives') => void;
  presentationMode: boolean;
  setPresentationMode: (val: boolean) => void;

  // Officer Workflows
  officerTasks: OfficerTask[];
  addOfficerTask: (task: OfficerTask) => void;
  updateOfficerTaskStatus: (taskId: string, status: OfficerTask['status']) => void;
  officerAudits: AuditTrailLog[];
  addOfficerAudit: (audit: AuditTrailLog) => void;
}

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'critical',
    title: 'ILLEGAL LOGGING SIGNALS',
    description: 'Thermal activity spike at Satpura Forest Range Sector C-2. Patrol dispatched.',
    timestamp: '02:45 AM',
    read: false,
    archived: false,
    priority: 'high'
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'WATER DROP LEVEL',
    description: 'Narmada River Sensor Node #412 reported 15% rate reduction.',
    timestamp: '1 hour ago',
    read: false,
    archived: false,
    priority: 'medium'
  },
  {
    id: 'notif-3',
    type: 'assignment',
    title: 'NEW FIELD ASSIGNMENT',
    description: 'Chief Arjun Sharma assigned to Satpura Wildlife patrol.',
    timestamp: '3 hours ago',
    read: false,
    archived: false,
    priority: 'high'
  },
  {
    id: 'notif-4',
    type: 'success',
    title: 'AQI MITIGATION SYSTEM ACTIVE',
    description: 'Dry fog AQI mitigation grid active at Pithampur Industrial Sector.',
    timestamp: '4 hours ago',
    read: true,
    archived: false,
    priority: 'low'
  },
  {
    id: 'notif-5',
    type: 'approval',
    title: 'Erosion Survey Awaiting Signoff',
    description: 'Environmental review document for Gwalior Sector 12 awaiting Secretary signature.',
    timestamp: 'Yesterday',
    read: false,
    archived: false,
    priority: 'medium'
  }
];

export const useStore = create<CommandCenterState>()(
  persist(
    (set) => ({
      // Theme & Settings
      settings: {
        theme: 'light',
        language: 'en',
        units: 'metric',
        dateFormat: 'YYYY-MM-DD',
        mapPreference: 'satellite',
        accessibilityScale: 'normal',
        notificationsEnabled: true
      },
      updateSettings: (updater) => set((state) => ({ settings: { ...state.settings, ...updater } })),
      toggleTheme: () => set((state) => {
        const nextTheme = state.settings.theme === 'light' ? 'dark' : 'light';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
        return { settings: { ...state.settings, theme: nextTheme } };
      }),

      // Authentication & Role
      currentRole: 'Collector',
      setCurrentRole: (role) => set({ currentRole: role }),

      // Connection Status & Timer
      isOnline: true,
      toggleConnection: () => set((state) => ({ isOnline: !state.isOnline })),
      sessionTimeRemaining: 1800, // 30 minutes
      decrementSessionTime: () => set((state) => ({ 
        sessionTimeRemaining: Math.max(state.sessionTimeRemaining - 1, 0) 
      })),
      resetSessionTime: () => set({ sessionTimeRemaining: 1800 }),

      // Navigation & History
      currentPage: 'dashboard',
      setCurrentPage: (page) => set((state) => {
        const history = [...state.navigationHistory];
        if (history[history.length - 1] !== page) {
          history.push(page);
        }
        return { 
          currentPage: page,
          navigationHistory: history.slice(-10) // Limit history size
        };
      }),
      navigationHistory: ['dashboard'],
      clearNavigationHistory: () => set({ navigationHistory: ['dashboard'] }),
      isSidebarExpanded: false,
      toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),

      selectedVillageId: 'VIL-001',
      setSelectedVillageId: (id) => set({ selectedVillageId: id }),

      // GIS Layers & Telemetry
      activeLayers: ['forestry', 'hydrology'],
      toggleLayer: (layerId) => set((state) => ({
        activeLayers: state.activeLayers.includes(layerId)
          ? state.activeLayers.filter((id) => id !== layerId)
          : [...state.activeLayers, layerId]
      })),
      mapZoom: 12,
      zoomIn: () => set((state) => ({ mapZoom: Math.min(state.mapZoom + 1, 18) })),
      zoomOut: () => set((state) => ({ mapZoom: Math.max(state.mapZoom - 1, 1) })),
      coordinates: '22.7534° N, 77.7265° E',
      setCoordinates: (coords) => set({ coordinates: coords }),

      // Extended GIS parameters
      gisViewMode: 'single',
      setGisViewMode: (mode) => set({ gisViewMode: mode }),
      activeBaseMap: 'satellite',
      setActiveBaseMap: (mapMode) => set({ activeBaseMap: mapMode }),
      splitBaseMap: 'terrain',
      setSplitBaseMap: (mapMode) => set({ splitBaseMap: mapMode }),
      timelineYear: 2026,
      setTimelineYear: (year) => set({ timelineYear: year }),
      selectedGisBoundary: null,
      setSelectedGisBoundary: (boundary) => set((state) => ({ 
        selectedGisBoundary: boundary,
        inspectorType: boundary ? 'map' : state.inspectorType,
        isDrawerOpen: boundary ? true : state.isDrawerOpen
      })),
      measurementTool: null,
      setMeasurementTool: (tool) => set({ measurementTool: tool }),
      drawingMode: null,
      setDrawingMode: (mode) => set({ drawingMode: mode }),

      // Right Inspector Drawer
      selectedOfficer: null,
      setSelectedOfficer: (officer) => set({ 
        selectedOfficer: officer, 
        inspectorType: officer ? 'officer' : null,
        isDrawerOpen: officer ? true : false
      }),
      selectedIncident: mpIncidents[0],
      setSelectedIncident: (incident) => set({ 
        selectedIncident: incident, 
        inspectorType: incident ? 'incident' : null,
        isDrawerOpen: incident ? true : false
      }),
      selectedVillage: null,
      setSelectedVillage: (village) => set({ 
        selectedVillage: village, 
        inspectorType: village ? 'village' : null,
        isDrawerOpen: village ? true : false
      }),
      selectedScheme: null,
      setSelectedScheme: (scheme) => set({ 
        selectedScheme: scheme, 
        inspectorType: scheme ? 'scheme' : null,
        isDrawerOpen: scheme ? true : false
      }),
      inspectorType: null,
      setInspectorType: (type) => set({ inspectorType: type }),
      isDrawerOpen: false,
      setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
      isDrawerPinned: false,
      toggleDrawerPin: () => set((state) => ({ isDrawerPinned: !state.isDrawerPinned })),
      drawerWidth: 400,
      setDrawerWidth: (width) => set({ drawerWidth: Math.max(300, Math.min(width, 800)) }),

      // Bottom Analytics Dock
      activeDockTab: 'analytics',
      setActiveDockTab: (tab) => set({ activeDockTab: tab }),
      isDockExpanded: false,
      setDockExpanded: (isExpanded) => set({ isDockExpanded: isExpanded }),
      dockHeight: 250,
      setDockHeight: (height) => set({ dockHeight: Math.max(160, Math.min(height, 500)) }),

      // Notifications
      notifications: initialNotifications,
      addNotification: (notif) => set((state) => ({
        notifications: [
          {
            ...notif,
            id: `notif-${Date.now()}`,
            read: false,
            archived: false
          },
          ...state.notifications
        ]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      })),
      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),
      archiveNotification: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, archived: true } : n)
      })),
      clearNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      })),

      // Universal Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      recentSearches: ['Indore AQI', 'Satpura Forest', 'Chief Arjun Sharma', 'Budhni Water'],
      addRecentSearch: (query) => set((state) => {
        const filtered = state.recentSearches.filter((q) => q !== query);
        return { recentSearches: [query, ...filtered].slice(0, 5) };
      }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      isSearchOpen: false,
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

      // Command Palette
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),

      // Incidents List & Intel
      incidents: mpIncidents,
      isIntelOpen: false,
      setIntelOpen: (isOpen) => set({ isIntelOpen: isOpen }),

      // Officers List
      officers: mpOfficers,

      // Filters
      filters: {
        dateRange: 'Last 10 Years (2014-2024)',
        region: 'All Jurisdictions',
        sector: 'Industrial + Residential',
        pollutant: 'PM2.5 / PM10 / NO2'
      },
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),

      // Overview Dashboard Filters & Loading State
      dashboardFilters: {
        district: 'Indore',
        block: 'All Blocks',
        village: 'All Villages',
        dateRange: 'Last 30 Days',
        season: 'All Seasons',
        scheme: 'All Schemes',
        department: 'All Departments',
        environmentalLayer: 'All Layers'
      },
      setDashboardFilter: (key, value) => set((state) => ({
        dashboardFilters: { ...state.dashboardFilters, [key]: value }
      })),
      isDashboardLoading: false,
      setDashboardLoading: (loading) => set({ isDashboardLoading: loading }),

      // AI Scenario Simulation initial values & setters
      policyBudgetModifier: 40,
      industrialEnforcement: 50,
      reforestationTarget: 30,
      setPolicyBudgetModifier: (val) => set({ policyBudgetModifier: val }),
      setIndustrialEnforcement: (val) => set({ industrialEnforcement: val }),
      setReforestationTarget: (val) => set({ reforestationTarget: val }),

      // Government Analytics initial values & setters
      analyticsTab: 'schemes',
      setAnalyticsTab: (tab) => set({ analyticsTab: tab }),
      presentationMode: false,
      setPresentationMode: (val) => set({ presentationMode: val }),

      // Officer Workflows
      officerTasks: initialOfficerTasks,
      addOfficerTask: (task) => set((state) => ({ officerTasks: [...state.officerTasks, task] })),
      updateOfficerTaskStatus: (taskId, status) => set((state) => ({
        officerTasks: state.officerTasks.map(t => t.id === taskId ? { ...t, status } : t)
      })),
      officerAudits: initialAuditLogs,
      addOfficerAudit: (audit) => set((state) => ({ officerAudits: [...state.officerAudits, audit] }))
    }),
    {
      name: 'prakriti-command-center-store',
      partialize: (state) => ({
        settings: state.settings,
        currentRole: state.currentRole,
        currentPage: state.currentPage,
        navigationHistory: state.navigationHistory,
        recentSearches: state.recentSearches,
        isDrawerPinned: state.isDrawerPinned,
        drawerWidth: state.drawerWidth,
        dockHeight: state.dockHeight,
        activeLayers: state.activeLayers,
        selectedVillageId: state.selectedVillageId,
        officerTasks: state.officerTasks,
        officerAudits: state.officerAudits
      })
    }
  )
);
