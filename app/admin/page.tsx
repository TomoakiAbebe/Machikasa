'use client';

import { useState, useEffect } from 'react';
import { LocalDB } from '@/lib/localDB';
import { User } from '@/types';
import { InfoCard } from '@/components/Cards';
import { PrimaryButton, DangerButton, SuccessButton, SecondaryButton } from '@/components/Button';
import { useToast } from '@/components/Toast';
import LoadingSpinner, { InlineLoading } from '@/components/LoadingSpinner';
import EmptyState, { NoStatsEmpty } from '@/components/EmptyState';
import { InfoTooltip } from '@/components/Tooltip';
import ConfirmationModal from '@/components/ConfirmationModal';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Umbrella, MapPin, TrendingUp, Download, RefreshCw, 
  AlertTriangle, Users, Activity, Award 
} from 'lucide-react';

// Custom colors for charts
const COLORS = {
  primary: '#3B82F6',
  secondary: '#FCD34D', 
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  neutral: '#6B7280',
};

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initializeData = async () => {
      LocalDB.initialize();
      setCurrentUser(LocalDB.getCurrentUser());
      setIsLoading(false);
    };
    
    initializeData();
  }, []);

  // Check if user has admin access
  const hasAdminAccess = currentUser?.role === 'admin' || currentUser?.role === 'shop';

  const handleReset = () => {
    LocalDB.reset();
    setShowResetModal(false);
    showToast({
      type: 'success',
      title: 'データリセット完了',
      message: 'すべてのデータが初期状態にリセットされました。'
    });
  };

    const handleCSVExport = () => {
    try {
      LocalDB.downloadTransactionsCSV();
      showToast({
        type: 'success',
        title: 'CSV出力完了',
        message: '取引データのCSVファイルをダウンロードしました。'
      });
    } catch (error) {
      console.error('CSV export error:', error);
      showToast({
        type: 'error',
        title: 'CSV出力エラー',
        message: 'CSVファイルの出力に失敗しました。'
      });
    }
  };

  const handleResetData = () => {
    try {
      // Reset localStorage
      localStorage.clear();
      showToast({
        type: 'success',
        title: 'データリセット完了',
        message: '全てのデータが初期状態にリセットされました。'
      });
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Reset data error:', error);
      showToast({
        type: 'error',
        title: 'リセットエラー',
        message: 'データのリセットに失敗しました。'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-machikasa-neutral flex items-center justify-center">
        <LoadingSpinner size="lg" text="管理データを読み込み中..." />
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-machikasa-neutral flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="h-16 w-16 text-warning-amber mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            アクセス権限がありません
          </h1>
          <p className="text-gray-600 mb-6">
            この管理画面にアクセスするには管理者権限が必要です。
          </p>
          <p className="text-sm text-gray-500">
            現在のユーザー: {currentUser?.nameJa || '未ログイン'}
            <br />
            権限: {currentUser?.role || 'なし'}
          </p>
        </div>
      </div>
    );
  }

  // Get analytics data
  const adminSummary = LocalDB.getAdminSummary();
  const transactionStats = LocalDB.getTransactionStats();
  const umbrellaStatus = LocalDB.getUmbrellaStatusDistribution();
  const stationUtilization = LocalDB.getStationUtilization();

  // Prepare chart data
  const pieChartData = [
    { name: '利用可能', value: umbrellaStatus.available, color: PIE_COLORS[0] },
    { name: '使用中', value: umbrellaStatus.inUse, color: PIE_COLORS[1] },
    { name: 'メンテナンス', value: umbrellaStatus.maintenance, color: PIE_COLORS[2] },
    { name: '紛失', value: umbrellaStatus.lost, color: PIE_COLORS[3] },
  ];

  const dailyTrendData = transactionStats.daily.map(day => ({
    date: new Date(day.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
    貸出: day.borrows,
    返却: day.returns,
    合計: day.count,
  }));

  const stationBarData = transactionStats.byStation.slice(0, 5).map(station => ({
    name: station.stationName.length > 8 ? station.stationName.substring(0, 8) + '...' : station.stationName,
    貸出: station.borrows,
    返却: station.returns,
  }));

  return (
    <div className="min-h-screen bg-machikasa-neutral">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              管理者ダッシュボード
            </h1>
            <InfoTooltip content="リアルタイムでサービスの利用状況や統計情報を確認できます。データは5分ごとに自動更新されます。" />
          </div>
          <p className="text-gray-600">Machikasa 傘シェアサービス管理画面</p>
          <div className="text-xs text-gray-500 mt-1">
            最終更新: {new Date().toLocaleString('ja-JP')}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard
            title="総傘数"
            value={adminSummary.totalUmbrellas}
            subtitle="本"
            icon={<Umbrella className="h-5 w-5" />}
            color="blue"
          />
          <InfoCard
            title="稼働ステーション"
            value={adminSummary.activeStations}
            subtitle="箇所"
            icon={<MapPin className="h-5 w-5" />}
            color="green"
          />
          <InfoCard
            title="総取引数"
            value={adminSummary.totalTransactions}
            subtitle="回"
            icon={<Activity className="h-5 w-5" />}
            color="yellow"
          />
          <InfoCard
            title="返却率"
            value={`${adminSummary.returnRate}%`}
            subtitle=""
            icon={<Award className="h-5 w-5" />}
            color="green"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <SuccessButton 
            onClick={handleCSVExport}
            icon={<Download className="h-4 w-4" />}
            className="flex-1"
          >
            データをCSVで出力
          </SuccessButton>
          <DangerButton 
            onClick={() => setShowResetModal(true)}
            icon={<RefreshCw className="h-4 w-4" />}
            className="flex-1"
          >
            データをリセット
          </DangerButton>
        </div>

        {/* Top Stations */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">利用上位ステーション</h2>
          <div className="space-y-3">
            {adminSummary.topStations.map((station, index) => (
              <div key={station.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-machikasa-blue text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{station.name}</span>
                </div>
                <span className="text-machikasa-blue font-semibold">
                  {station.transactions} 回
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Daily Trend Chart */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              日別利用トレンド（7日間）
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="貸出" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="返却" 
                    stroke={COLORS.success} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Umbrella Status Distribution */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              傘の状態分布
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Station Usage Bar Chart */}
          <div className="bg-white rounded-card shadow-card p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ステーション別利用状況（上位5位）
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stationBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="貸出" fill={COLORS.primary} />
                  <Bar dataKey="返却" fill={COLORS.success} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">システム情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">データ概要</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• データ保存: ブラウザローカルストレージ</li>
                <li>• 自動バックアップ: 無効</li>
                <li>• データ同期: オフライン専用</li>
                <li>• 最大容量: ブラウザ依存</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">管理者情報</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ログイン中: {currentUser?.nameJa}</li>
                <li>• 権限レベル: {currentUser?.role}</li>
                <li>• アクセス日時: {new Date().toLocaleString('ja-JP')}</li>
                <li>• セッション: ブラウザセッション</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card max-w-md w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <AlertTriangle className="h-12 w-12 text-warning-amber mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                データリセットの確認
              </h3>
              <p className="text-gray-600">
                すべてのデータが削除され、初期状態に戻ります。この操作は取り消せません。
              </p>
            </div>
            <div className="flex space-x-3">
              <SecondaryButton 
                onClick={() => setShowResetModal(false)}
                className="flex-1"
              >
                キャンセル
              </SecondaryButton>
              <DangerButton 
                onClick={handleReset}
                className="flex-1"
              >
                リセット実行
              </DangerButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}