import { Station, Umbrella, User, Transaction, Sponsor, PartnerStore, SponsorshipDeal, PartnerStoreReturn } from '@/types';
import { mockStations, mockUmbrellas, mockUsers, mockTransactions, mockSponsors, mockPartnerStores, mockSponsorshipDeals } from './mockData';
import { SafeStorage, withErrorHandling, validateAndRecover, ErrorHandler, ERROR_CODES } from './errorHandler';

// LocalStorage keys
const STORAGE_KEYS = {
  STATIONS: 'machikasa_stations',
  UMBRELLAS: 'machikasa_umbrellas',
  USERS: 'machikasa_users',
  TRANSACTIONS: 'machikasa_transactions',
  SPONSORS: 'machikasa_sponsors',
  PARTNER_STORES: 'machikasa_partner_stores',
  SPONSORSHIP_DEALS: 'machikasa_sponsorship_deals',
  PARTNER_RETURNS: 'machikasa_partner_returns',
  CURRENT_USER: 'machikasa_current_user',
  INITIALIZED: 'machikasa_initialized'
} as const;

/**
 * LocalDB utility class for handling localStorage operations
 */
export class LocalDB {
  /**
   * Initialize the database with mock data if not already initialized
   * Enhanced with error handling and data validation
   */
  static initialize(): void {
    if (typeof window === 'undefined') return; // Skip on server side
    
    const initializeWithErrorHandling = withErrorHandling(
      () => {
        const isInitialized = SafeStorage.get(STORAGE_KEYS.INITIALIZED, false);
        
        if (!isInitialized) {
          // Validate mock data before initialization
          const mockDataValid = this.validateMockData();
          if (!mockDataValid) {
            console.warn('Mock data validation failed, using minimal fallback data');
            this.initializeWithFallbackData();
            return;
          }

          this.setStations(mockStations);
          this.setUmbrellas(mockUmbrellas);
          this.setUsers(mockUsers);
          this.setTransactions(mockTransactions);
          this.setSponsors(mockSponsors);
          this.setPartnerStores(mockPartnerStores);
          this.setSponsorshipDeals(mockSponsorshipDeals);
          this.setPartnerReturns([]);
          this.setCurrentUser(mockUsers[0]); // Default to first user
          SafeStorage.set(STORAGE_KEYS.INITIALIZED, true);
          console.log('🚀 LocalDB initialized with mock data');
        } else {
          // Verify existing data integrity
          this.verifyDataIntegrity();
        }
      },
      'LocalDB.initialize',
      (error) => {
        console.error('Failed to initialize LocalDB, using fallback data:', error.userMessage);
        this.initializeWithFallbackData();
      }
    );

    initializeWithErrorHandling();
  }

  /**
   * Validate mock data structure and completeness
   */
  private static validateMockData(): boolean {
    try {
      return (
        Array.isArray(mockStations) && mockStations.length > 0 &&
        Array.isArray(mockUmbrellas) && mockUmbrellas.length > 0 &&
        Array.isArray(mockUsers) && mockUsers.length > 0 &&
        Array.isArray(mockTransactions) &&
        Array.isArray(mockSponsors) &&
        Array.isArray(mockPartnerStores) &&
        Array.isArray(mockSponsorshipDeals)
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Initialize with minimal fallback data if mock data fails
   */
  private static initializeWithFallbackData(): void {
    const fallbackUser: User = {
      id: 'user-fallback',
      name: 'Guest User',
      nameJa: 'ゲストユーザー',
      email: 'guest@example.com',
      role: 'student',
      points: 0,
      totalBorrows: 0,
      totalReturns: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const fallbackStation: Station = {
      id: 'station-fallback',
      name: 'Emergency Station',
      nameJa: '緊急ステーション',
      location: { lat: 36.0, lng: 136.0 },
      address: 'Fukui University',
      addressJa: '福井大学内',
      capacity: 5,
      currentCount: 1,
      type: 'university',
      operatingHours: { open: '09:00', close: '21:00' },
      isActive: true
    };

    const fallbackUmbrella: Umbrella = {
      id: 'umb-fallback',
      code: 'machikasa://umbrella/umb-fallback',
      qrCode: 'machikasa://umbrella/umb-fallback',
      stationId: 'station-fallback',
      status: 'available',
      condition: 'good',
      batteryLevel: 100,
      lastUpdated: new Date().toISOString()
    };

    this.setStations([fallbackStation]);
    this.setUmbrellas([fallbackUmbrella]);
    this.setUsers([fallbackUser]);
    this.setTransactions([]);
    this.setSponsors([]);
    this.setPartnerStores([]);
    this.setSponsorshipDeals([]);
    this.setPartnerReturns([]);
    this.setCurrentUser(fallbackUser);
    SafeStorage.set(STORAGE_KEYS.INITIALIZED, true);
    console.log('🆘 LocalDB initialized with fallback data');
  }

  /**
   * Verify existing data integrity and repair if needed
   */
  private static verifyDataIntegrity(): void {
    const verifyWithErrorHandling = withErrorHandling(
      () => {
        const stations = this.getStations();
        const umbrellas = this.getUmbrellas();
        const users = this.getUsers();
        const currentUser = this.getCurrentUser();

        // Check if essential data exists
        if (!stations.length || !umbrellas.length || !users.length) {
          console.warn('Essential data missing, reinitializing...');
          SafeStorage.remove(STORAGE_KEYS.INITIALIZED);
          this.initialize();
          return;
        }

        // Check if current user exists
        if (!currentUser || !users.find(u => u.id === currentUser.id)) {
          console.warn('Current user invalid, setting default user');
          this.setCurrentUser(users[0]);
        }

        console.log('✅ Data integrity verification passed');
      },
      'LocalDB.verifyDataIntegrity',
      (error) => {
        console.warn('Data integrity check failed, reinitializing:', error.userMessage);
        SafeStorage.remove(STORAGE_KEYS.INITIALIZED);
        this.initialize();
      }
    );

    verifyWithErrorHandling();
  }

  /**
   * Clear all data and reinitialize with mock data
   */
  static reset(): void {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initialize();
    console.log('🔄 LocalDB reset and reinitialized');
  }

  // Station operations
  static getStations(): Station[] {
    return this.getData<Station[]>(STORAGE_KEYS.STATIONS, []);
  }

  static setStations(stations: Station[]): void {
    this.setData(STORAGE_KEYS.STATIONS, stations);
  }

  static getStation(id: string): Station | null {
    const stations = this.getStations();
    return stations.find(s => s.id === id) || null;
  }

  static updateStationCount(stationId: string, change: number): void {
    const stations = this.getStations();
    const station = stations.find(s => s.id === stationId);
    if (station) {
      station.currentCount = Math.max(0, Math.min(station.capacity, station.currentCount + change));
      this.setStations(stations);
    }
  }

  // Umbrella operations
  static getUmbrellas(): Umbrella[] {
    return this.getData<Umbrella[]>(STORAGE_KEYS.UMBRELLAS, []);
  }

  static setUmbrellas(umbrellas: Umbrella[]): void {
    this.setData(STORAGE_KEYS.UMBRELLAS, umbrellas);
  }

  static getUmbrella(id: string): Umbrella | null {
    const umbrellas = this.getUmbrellas();
    return umbrellas.find(u => u.id === id) || null;
  }

  static getUmbrellaByQR(qrCode: string): Umbrella | null {
    // Extract umbrella ID from QR code: "machikasa://umbrella/umb-001"
    const match = qrCode.match(/machikasa:\/\/umbrella\/(.+)/);
    if (!match) return null;
    
    return this.getUmbrella(match[1]);
  }

  static getAvailableUmbrellas(stationId?: string): Umbrella[] {
    const umbrellas = this.getUmbrellas();
    return umbrellas.filter(u => 
      u.status === 'available' && 
      (stationId ? u.stationId === stationId : true)
    );
  }

  static updateUmbrellaStatus(umbrellaId: string, status: Umbrella['status'], userId?: string): boolean {
    const umbrellas = this.getUmbrellas();
    const umbrella = umbrellas.find(u => u.id === umbrellaId);
    
    if (!umbrella) return false;

    umbrella.status = status;
    umbrella.lastUpdated = new Date().toISOString();
    
    if (status === 'in_use' && userId) {
      umbrella.borrowedBy = userId;
    } else if (status === 'available') {
      delete umbrella.borrowedBy;
    }

    this.setUmbrellas(umbrellas);
    return true;
  }

  // User operations
  static getUsers(): User[] {
    return this.getData<User[]>(STORAGE_KEYS.USERS, []);
  }

  static setUsers(users: User[]): void {
    this.setData(STORAGE_KEYS.USERS, users);
  }

  static getUser(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  static getCurrentUser(): User | null {
    return this.getData<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static setCurrentUser(user: User): void {
    this.setData(STORAGE_KEYS.CURRENT_USER, user);
  }

  static updateUserStats(userId: string, type: 'borrow' | 'return', points?: number): void {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return;

    if (type === 'borrow') {
      user.totalBorrows++;
    } else {
      user.totalReturns++;
      if (points) user.points += points;
    }

    user.lastLoginAt = new Date().toISOString();
    this.setUsers(users);
    
    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(user);
    }
  }

  // Transaction operations
  static getTransactions(): Transaction[] {
    return this.getData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  }

  static setTransactions(transactions: Transaction[]): void {
    this.setData(STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  static addTransaction(action: 'borrow' | 'return', umbrellaId: string, userId: string, stationId: string): string {
    const transactions = this.getTransactions();
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTransaction: Transaction = {
      id,
      umbrellaId,
      action,
      userId,
      stationId,
      timestamp: new Date().toISOString(),
      type: action, // Legacy support
      pointsEarned: action === 'return' ? 1 : undefined
    };
    
    transactions.push(newTransaction);
    this.setTransactions(transactions);
    
    return id;
  }

  // Legacy method for backward compatibility
  static addTransactionLegacy(transaction: Omit<Transaction, 'id'>): string {
    const transactions = this.getTransactions();
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTransaction: Transaction = { id, ...transaction };
    
    transactions.push(newTransaction);
    this.setTransactions(transactions);
    
    return id;
  }

  static getUserTransactions(userId: string, limit?: number): Transaction[] {
    const transactions = this.getTransactions();
    const userTransactions = transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  // Sponsor operations
  static getSponsors(): Sponsor[] {
    return this.getData<Sponsor[]>(STORAGE_KEYS.SPONSORS, []);
  }

  static setSponsors(sponsors: Sponsor[]): void {
    this.setData(STORAGE_KEYS.SPONSORS, sponsors);
  }

  static getSponsor(id: string): Sponsor | null {
    const sponsors = this.getSponsors();
    return sponsors.find(s => s.id === id) || null;
  }

  static getActiveSponsors(): Sponsor[] {
    return this.getSponsors().filter(s => s.active);
  }

  // Partner Store operations
  static getPartnerStores(): PartnerStore[] {
    return this.getData<PartnerStore[]>(STORAGE_KEYS.PARTNER_STORES, []);
  }

  static setPartnerStores(stores: PartnerStore[]): void {
    this.setData(STORAGE_KEYS.PARTNER_STORES, stores);
  }

  static getPartnerStore(id: string): PartnerStore | null {
    const stores = this.getPartnerStores();
    return stores.find(s => s.id === id) || null;
  }

  static getActivePartnerStores(): PartnerStore[] {
    return this.getPartnerStores().filter(s => s.isActive);
  }

  static getPartnerStoresByType(type: PartnerStore['type']): PartnerStore[] {
    return this.getActivePartnerStores().filter(s => s.type === type);
  }

  static updatePartnerStoreUmbrellas(storeId: string, umbrellaCount: number): boolean {
    const stores = this.getPartnerStores();
    const store = stores.find(s => s.id === storeId);
    
    if (!store) return false;
    
    store.availableUmbrellas = Math.max(0, Math.min(umbrellaCount, store.maxCapacity));
    store.lastUpdated = new Date().toISOString();
    
    this.setPartnerStores(stores);
    return true;
  }

  // Sponsorship Deal operations
  static getSponsorshipDeals(): SponsorshipDeal[] {
    return this.getData<SponsorshipDeal[]>(STORAGE_KEYS.SPONSORSHIP_DEALS, []);
  }

  static setSponsorshipDeals(deals: SponsorshipDeal[]): void {
    this.setData(STORAGE_KEYS.SPONSORSHIP_DEALS, deals);
  }

  static getActiveDealsByPartnerStore(partnerStoreId: string): SponsorshipDeal[] {
    const deals = this.getSponsorshipDeals();
    const now = new Date().toISOString();
    
    return deals.filter(deal => 
      deal.partnerStoreId === partnerStoreId && 
      deal.active &&
      deal.startDate <= now &&
      (!deal.endDate || deal.endDate >= now)
    );
  }

  // Partner Store Return operations
  static getPartnerReturns(): PartnerStoreReturn[] {
    return this.getData<PartnerStoreReturn[]>(STORAGE_KEYS.PARTNER_RETURNS, []);
  }

  static setPartnerReturns(returns: PartnerStoreReturn[]): void {
    this.setData(STORAGE_KEYS.PARTNER_RETURNS, returns);
  }

  static addPartnerReturn(partnerStoreId: string, transactionId: string, userId: string, umbrellaId: string, bonusPoints: number, dealApplied?: string): string {
    const returns = this.getPartnerReturns();
    const id = `pr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newReturn: PartnerStoreReturn = {
      id,
      transactionId,
      partnerStoreId,
      userId,
      umbrellaId,
      bonusPoints,
      dealApplied,
      timestamp: new Date().toISOString()
    };
    
    returns.push(newReturn);
    this.setPartnerReturns(returns);
    
    return id;
  }

  // Enhanced return method for partner stores
  static returnUmbrellaToPartnerStore(umbrellaId: string, userId: string, partnerStoreId: string): { success: boolean; message: string; points?: number; dealApplied?: string } {
    const umbrella = this.getUmbrella(umbrellaId);
    const partnerStore = this.getPartnerStore(partnerStoreId);
    const user = this.getUser(userId);

    if (!umbrella) {
      return { success: false, message: '傘が見つかりません。' };
    }

    if (!partnerStore || !partnerStore.isActive) {
      return { success: false, message: '指定された加盟店は利用できません。' };
    }

    if (!user) {
      return { success: false, message: 'ユーザーが見つかりません。' };
    }

    if (umbrella.status !== 'in_use' || umbrella.borrowedBy !== userId) {
      return { success: false, message: 'この傘は返却できません。' };
    }

    if (partnerStore.availableUmbrellas >= partnerStore.maxCapacity) {
      return { success: false, message: 'この店舗は満員です。別の場所に返却してください。' };
    }

    // Apply sponsorship deals
    const activeDeals = this.getActiveDealsByPartnerStore(partnerStoreId);
    let bonusPoints = 1; // Base return points
    let dealApplied: string | undefined;

    // Find the best deal (highest bonus points)
    const bestDeal = activeDeals
      .filter(deal => deal.dealType === 'points_bonus')
      .sort((a, b) => b.value - a.value)[0];

    if (bestDeal) {
      bonusPoints = bestDeal.value;
      dealApplied = bestDeal.description;
    }

    // Update umbrella status
    umbrella.status = 'available';
    umbrella.stationId = partnerStoreId; // Treat partner store as station
    delete umbrella.borrowedBy;
    umbrella.lastUpdated = new Date().toISOString();

    // Update partner store umbrella count
    this.updatePartnerStoreUmbrellas(partnerStoreId, partnerStore.availableUmbrellas + 1);

    // Record transaction
    const transactionId = this.addTransaction('return', umbrellaId, userId, partnerStoreId);

    // Record partner return
    this.addPartnerReturn(partnerStoreId, transactionId, userId, umbrellaId, bonusPoints, dealApplied);

    // Update user stats and points
    this.updateUserStats(userId, 'return', bonusPoints);
    this.addUserPoints(userId, bonusPoints);

    // Update data
    const umbrellas = this.getUmbrellas();
    const umbrellaIndex = umbrellas.findIndex(u => u.id === umbrellaId);
    if (umbrellaIndex !== -1) {
      umbrellas[umbrellaIndex] = umbrella;
      this.setUmbrellas(umbrellas);
    }

    const successMessage = dealApplied 
      ? `${partnerStore.name}で返却完了！${dealApplied}が適用されました。`
      : `${partnerStore.name}で返却完了！`;

    return { 
      success: true, 
      message: successMessage,
      points: bonusPoints,
      dealApplied 
    };
  }

  // Enhanced generic operations with error handling
  private static getData<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    const data = SafeStorage.get(key, defaultValue);
    return validateAndRecover(data, defaultValue);
  }

  private static setData<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    const success = SafeStorage.set(key, value);
    if (!success) {
      console.warn(`Failed to save data for key: ${key}`);
    }
  }

  // Enhanced Phase 2 methods for borrow/return logic
  static borrowUmbrella(umbrellaId: string, userId: string): { success: boolean; message: string; umbrella?: Umbrella } {
    const umbrella = this.getUmbrella(umbrellaId);
    
    if (!umbrella) {
      return { success: false, message: '傘情報が見つかりませんでした。' };
    }
    
    if (umbrella.status === 'in_use') {
      return { success: false, message: 'この傘は使用中です。' };
    }
    
    if (umbrella.status !== 'available') {
      return { success: false, message: 'この傘は現在利用できません。' };
    }

    // Update umbrella status
    this.updateUmbrellaStatus(umbrellaId, 'in_use', userId);
    
    // Update station count
    this.updateStationCount(umbrella.stationId, -1);
    
    // Update user stats
    this.updateUserStats(userId, 'borrow');
    
    // Add transaction
    this.addTransaction('borrow', umbrellaId, userId, umbrella.stationId);

    const updatedUmbrella = this.getUmbrella(umbrellaId);
    return { success: true, message: '傘の貸出が完了しました！', umbrella: updatedUmbrella || undefined };
  }

  static returnUmbrella(umbrellaId: string, userId: string): { success: boolean; message: string; points?: number; umbrella?: Umbrella } {
    const umbrella = this.getUmbrella(umbrellaId);
    
    if (!umbrella) {
      return { success: false, message: '傘情報が見つかりませんでした。' };
    }
    
    if (umbrella.status === 'available') {
      return { success: false, message: 'この傘はすでに返却されています。' };
    }
    
    if (umbrella.status !== 'in_use' || umbrella.borrowedBy !== userId) {
      return { success: false, message: 'この傘の返却権限がありません。' };
    }

    const points = 1; // Simple 1 point per return

    // Update umbrella status
    this.updateUmbrellaStatus(umbrellaId, 'available');
    
    // Update station count
    this.updateStationCount(umbrella.stationId, 1);
    
    // Update user stats and add points
    this.updateUserStats(userId, 'return');
    this.addUserPoints(userId, points);
    
    // Add transaction
    this.addTransaction('return', umbrellaId, userId, umbrella.stationId);

    const updatedUmbrella = this.getUmbrella(umbrellaId);
    return { success: true, message: 'あなたの返却で1ポイント獲得しました！', points, umbrella: updatedUmbrella || undefined };
  }



  // New method: Get user points
  static getUserPoints(userId: string): number {
    const user = this.getUser(userId);
    return user ? user.points : 0;
  }

  // New method: Add points to user
  static addUserPoints(userId: string, value: number): void {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.points += value;
      this.setUsers(users);
      
      // Update current user if it's the same user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(user);
      }
    }
  }

  // Analytics and Reporting Functions for Admin Dashboard
  
  /**
   * Get comprehensive transaction statistics
   */
  static getTransactionStats(): {
    total: number;
    borrowCount: number;
    returnCount: number;
    returnRate: number;
    daily: { date: string; count: number; borrows: number; returns: number }[];
    byStation: { stationId: string; stationName: string; borrows: number; returns: number; total: number }[];
  } {
    const transactions = this.getTransactions();
    const stations = this.getStations();
    
    const borrowCount = transactions.filter(t => t.action === 'borrow').length;
    const returnCount = transactions.filter(t => t.action === 'return').length;
    const returnRate = borrowCount > 0 ? (returnCount / borrowCount) * 100 : 0;
    
    // Daily statistics for the past 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }).reverse();
    
    const daily = last7Days.map(date => {
      const dayTransactions = transactions.filter(t => 
        t.timestamp.startsWith(date)
      );
      return {
        date,
        count: dayTransactions.length,
        borrows: dayTransactions.filter(t => t.action === 'borrow').length,
        returns: dayTransactions.filter(t => t.action === 'return').length,
      };
    });
    
    // Statistics by station
    const byStation = stations.map(station => {
      const stationTransactions = transactions.filter(t => t.stationId === station.id);
      const stationBorrows = stationTransactions.filter(t => t.action === 'borrow').length;
      const stationReturns = stationTransactions.filter(t => t.action === 'return').length;
      
      return {
        stationId: station.id,
        stationName: station.nameJa,
        borrows: stationBorrows,
        returns: stationReturns,
        total: stationBorrows + stationReturns,
      };
    }).sort((a, b) => b.total - a.total); // Sort by total transactions desc
    
    return {
      total: transactions.length,
      borrowCount,
      returnCount,
      returnRate: Math.round(returnRate * 100) / 100, // Round to 2 decimal places
      daily,
      byStation,
    };
  }

  /**
   * Get umbrella status distribution for pie chart
   */
  static getUmbrellaStatusDistribution(): {
    available: number;
    inUse: number;
    maintenance: number;
    lost: number;
  } {
    const umbrellas = this.getUmbrellas();
    
    return {
      available: umbrellas.filter(u => u.status === 'available').length,
      inUse: umbrellas.filter(u => u.status === 'in_use').length,
      maintenance: umbrellas.filter(u => u.status === 'maintenance').length,
      lost: umbrellas.filter(u => u.status === 'lost').length,
    };
  }

  /**
   * Get station utilization rates
   */
  static getStationUtilization(): {
    stationId: string;
    stationName: string;
    totalUmbrellas: number;
    utilizationRate: number;
    totalTransactions: number;
  }[] {
    const stations = this.getStations();
    const umbrellas = this.getUmbrellas();
    const transactions = this.getTransactions();
    
    return stations.map(station => {
      const stationUmbrellas = umbrellas.filter(u => u.stationId === station.id);
      const stationTransactions = transactions.filter(t => t.stationId === station.id);
      const utilizationRate = stationUmbrellas.length > 0 
        ? (stationTransactions.length / stationUmbrellas.length) * 10 // Scale for better visualization
        : 0;
      
      return {
        stationId: station.id,
        stationName: station.nameJa,
        totalUmbrellas: stationUmbrellas.length,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
        totalTransactions: stationTransactions.length,
      };
    });
  }

  /**
   * Export all transactions to CSV format
   */
  static exportTransactionsToCSV(): string {
    const transactions = this.getTransactions();
    const stations = this.getStations();
    const users = this.getUsers();
    
    // Create lookup maps for better performance
    const stationMap = new Map(stations.map(s => [s.id, s.nameJa]));
    const userMap = new Map(users.map(u => [u.id, u.nameJa]));
    
    // CSV header
    const headers = [
      'transaction_id',
      'umbrella_id', 
      'action',
      'user_id',
      'user_name',
      'station_id',
      'station_name',
      'points_earned',
      'timestamp',
      'date_formatted'
    ];
    
    // CSV rows
    const rows = transactions.map(transaction => {
      const stationName = stationMap.get(transaction.stationId) || 'Unknown Station';
      const userName = userMap.get(transaction.userId) || 'Unknown User';
      const dateFormatted = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(new Date(transaction.timestamp));
      
      return [
        transaction.id,
        transaction.umbrellaId,
        transaction.action,
        transaction.userId,
        userName,
        transaction.stationId,
        stationName,
        transaction.pointsEarned || 0,
        transaction.timestamp,
        dateFormatted
      ];
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  /**
   * Trigger CSV download in browser
   */
  static downloadTransactionsCSV(): void {
    if (typeof window === 'undefined') return;
    
    const csvContent = this.exportTransactionsToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      link.setAttribute('download', `machikasa_transactions_${dateStr}.csv`);
      
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Get admin dashboard summary data
   */
  static getAdminSummary(): {
    totalUmbrellas: number;
    activeStations: number;
    totalTransactions: number;
    returnRate: number;
    topStations: { name: string; transactions: number }[];
    umbrellasByStatus: { status: string; count: number; percentage: number }[];
  } {
    const umbrellas = this.getUmbrellas();
    const stations = this.getStations();
    const transactions = this.getTransactions();
    
    const borrowCount = transactions.filter(t => t.action === 'borrow').length;
    const returnCount = transactions.filter(t => t.action === 'return').length;
    const returnRate = borrowCount > 0 ? (returnCount / borrowCount) * 100 : 0;
    
    // Active stations (stations with at least one transaction)
    const stationTransactionCounts = new Map<string, number>();
    transactions.forEach(t => {
      stationTransactionCounts.set(t.stationId, (stationTransactionCounts.get(t.stationId) || 0) + 1);
    });
    
    const topStations = Array.from(stationTransactionCounts.entries())
      .map(([stationId, count]) => {
        const station = stations.find(s => s.id === stationId);
        return {
          name: station?.nameJa || 'Unknown',
          transactions: count
        };
      })
      .sort((a, b) => b.transactions - a.transactions)
      .slice(0, 3);
    
    // Umbrella status distribution
    const statusCounts = {
      available: umbrellas.filter(u => u.status === 'available').length,
      in_use: umbrellas.filter(u => u.status === 'in_use').length,
      maintenance: umbrellas.filter(u => u.status === 'maintenance').length,
      lost: umbrellas.filter(u => u.status === 'lost').length,
    };
    
    const umbrellasByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: umbrellas.length > 0 ? Math.round((count / umbrellas.length) * 100) : 0
    }));
    
    return {
      totalUmbrellas: umbrellas.length,
      activeStations: stationTransactionCounts.size,
      totalTransactions: transactions.length,
      returnRate: Math.round(returnRate * 100) / 100,
      topStations,
      umbrellasByStatus,
    };
  }

  // Legacy methods for backward compatibility
  static borrowUmbrellaLegacy(umbrellaId: string, userId: string, stationId: string): { success: boolean; message: string } {
    const result = this.borrowUmbrella(umbrellaId, userId);
    return { success: result.success, message: result.message };
  }

  static returnUmbrellaLegacy(umbrellaId: string, userId: string, stationId: string): { success: boolean; message: string; points?: number } {
    const result = this.returnUmbrella(umbrellaId, userId);
    return { success: result.success, message: result.message, points: result.points };
  }
}