'use client';

import { useState, useEffect } from 'react';
import { LocalDB } from '@/lib/localDB';
import { User, Transaction } from '@/types';
import { formatDateJa, getRoleTextJa } from '@/lib/utils';
import LoadingSpinner, { InlineLoading } from '@/components/LoadingSpinner';
import { NoTransactionsEmpty } from '@/components/EmptyState';
import { InfoTooltip } from '@/components/Tooltip';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentlyBorrowed: 0,
    totalBorrows: 0,
    totalReturns: 0,
    points: 0,
    streak: 0 // consecutive returns
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      LocalDB.initialize();
      const user = LocalDB.getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        const userTransactions = LocalDB.getUserTransactions(user.id, 5); // Get recent 5 transactions
        setTransactions(userTransactions);
        
        // Calculate additional stats
        const borrowed = LocalDB.getUmbrellas().filter(u => u.borrowedBy === user.id).length;
        const allTransactions = LocalDB.getUserTransactions(user.id);
        const returns = allTransactions.filter(t => t.action === 'return');
        const recentReturns = returns.slice(0, 10);
        let streak = 0;
        for (const transaction of recentReturns) {
          if (transaction.action === 'return') streak++;
          else break;
        }
        
        setStats({
          currentlyBorrowed: borrowed,
          totalBorrows: user.totalBorrows,
          totalReturns: user.totalReturns,
          points: user.points,
          streak
        });
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  const switchToNextUser = () => {
    const users = LocalDB.getUsers();
    const currentIndex = users.findIndex(u => u.id === currentUser?.id);
    const nextIndex = (currentIndex + 1) % users.length;
    const nextUser = users[nextIndex];
    
    LocalDB.setCurrentUser(nextUser);
    setCurrentUser(nextUser);
    
    // Refresh data for new user
    const userTransactions = LocalDB.getUserTransactions(nextUser.id);
    setTransactions(userTransactions);
    
    const borrowed = LocalDB.getUmbrellas().filter(u => u.borrowedBy === nextUser.id).length;
    setStats({
      currentlyBorrowed: borrowed,
      totalBorrows: nextUser.totalBorrows,
      totalReturns: nextUser.totalReturns,
      points: nextUser.points,
      streak: 0 // simplified for demo
    });
  };

  if (loading || !currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <InlineLoading text="プロフィール情報を読み込み中..." />
      </div>
    );
  }

  const pointsToNextLevel = Math.ceil(currentUser.points / 100) * 100;
  const progressPercent = (currentUser.points % 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👤 プロフィール
          </h1>
          <p className="text-gray-600">
            あなたのMachikasaアカウント情報
          </p>
        </div>
        
        {/* Demo: User switcher */}
        <button
          onClick={switchToNextUser}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
        >
          🔄 ユーザー切替 (デモ)
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-umbrella-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {currentUser.nameJa.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{currentUser.nameJa}</h2>
            <p className="text-gray-600">{currentUser.name}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentUser.role === 'student' ? 'bg-blue-100 text-blue-800' :
                currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {getRoleTextJa(currentUser.role)}
              </span>
              {currentUser.studentId && (
                <span className="text-gray-600 text-sm">ID: {currentUser.studentId}</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">メール:</span>
            <span className="ml-2">{currentUser.email}</span>
          </div>
          {currentUser.phone && (
            <div>
              <span className="text-gray-600">電話:</span>
              <span className="ml-2">{currentUser.phone}</span>
            </div>
          )}
          {currentUser.department && (
            <div>
              <span className="text-gray-600">所属:</span>
              <span className="ml-2">{currentUser.department}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600">登録日:</span>
            <span className="ml-2">{formatDateJa(currentUser.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-umbrella-blue mb-2">
            {stats.points}
          </div>
          <div className="text-gray-600">現在のポイント</div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-umbrella-blue h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            次のレベルまで {pointsToNextLevel - stats.points}pt
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-return-green mb-2">
            {stats.totalBorrows}
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-600">総貸出回数</span>
            <InfoTooltip content="これまでに傘を借りた合計回数です。利用頻度の指標になります。" />
          </div>
          {stats.currentlyBorrowed > 0 && (
            <div className="text-sm text-orange-600 mt-1">
              現在 {stats.currentlyBorrowed}本 使用中
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-warning-amber mb-2">
            {stats.totalReturns}
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-600">総返却回数</span>
            <InfoTooltip content="これまでに傘を返却した合計回数です。責任ある利用の証です。" />
          </div>
          <div className="text-sm text-gray-500 mt-1">
            返却率: {stats.totalBorrows > 0 ? Math.round((stats.totalReturns / stats.totalBorrows) * 100) : 0}%
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats.streak}
          </div>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-600">連続返却回数</span>
            <InfoTooltip content="最近の取引で連続して傘を返却した回数です。高い数値は信頼性の証です。" />
          </div>
          {stats.streak >= 5 && (
            <div className="text-sm text-purple-600 mt-1">
              🏆 素晴らしい！
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">最近の利用履歴 (直近5件)</h3>
        
        {transactions.length === 0 ? (
          <NoTransactionsEmpty onStartUsing={() => window.location.href = '/scan'} />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {transaction.action === 'borrow' ? '📤' : '📥'}
                  </span>
                  <div>
                    <p className="font-medium">
                      {transaction.action === 'borrow' ? '傘を借りました' : '傘を返却しました'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDateJa(transaction.timestamp)} | 傘ID: {transaction.umbrellaId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {transaction.pointsEarned && (
                    <span className="text-return-green font-medium">
                      +{transaction.pointsEarned}pt
                    </span>
                  )}
                  <div className="text-xs text-gray-500">
                    {transaction.weather && `天気: ${transaction.weather}`}
                  </div>
                </div>
              </div>
            ))}
            
            {LocalDB.getUserTransactions(currentUser?.id || '').length > 5 && (
              <div className="text-center pt-4">
                <button className="text-umbrella-blue hover:text-blue-600 font-medium">
                  さらに表示 ({LocalDB.getUserTransactions(currentUser?.id || '').length - 5}件)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">🏆 実績・バッジ</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg border-2 ${
            stats.totalBorrows >= 1 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-medium">初回利用</div>
              <div className="text-sm text-gray-600">最初の傘を借りる</div>
              {stats.totalBorrows >= 1 && (
                <div className="text-green-600 text-sm mt-1">✅ 達成済み</div>
              )}
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            stats.totalReturns >= 5 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">🌟</div>
              <div className="font-medium">コミュニティサポーター</div>
              <div className="text-sm text-gray-600">5回返却する</div>
              {stats.totalReturns >= 5 ? (
                <div className="text-green-600 text-sm mt-1">✅ 達成済み</div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">
                  {stats.totalReturns}/5
                </div>
              )}
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${
            stats.points >= 100 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">💎</div>
              <div className="font-medium">ポイントコレクター</div>
              <div className="text-sm text-gray-600">100ポイント獲得</div>
              {stats.points >= 100 ? (
                <div className="text-green-600 text-sm mt-1">✅ 達成済み</div>
              ) : (
                <div className="text-gray-500 text-sm mt-1">
                  {stats.points}/100
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}