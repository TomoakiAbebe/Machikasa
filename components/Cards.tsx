'use client';

import React from 'react';
import { Station, Umbrella, Transaction } from '@/types';
import { MapPin, Umbrella as UmbrellaIcon, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { getStatusTextJa, getConditionTextJa, formatDateJa } from '@/lib/utils';

// Base Card Component
interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: BaseCardProps) {
  const baseClasses = 'bg-white rounded-card shadow-card border border-gray-100 transition-all duration-200';
  const hoverClasses = hoverable ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : '';
  const clickClasses = onClick ? 'active:scale-98' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Station Card Component
interface StationCardProps {
  station: Station;
  onClick?: () => void;
  showStats?: boolean;
}

export function StationCard({ station, onClick, showStats = true }: StationCardProps) {
  const availableCount = station.currentCount || 0;
  const totalCount = station.capacity;
  const occupancyRate = totalCount > 0 ? (availableCount / totalCount) * 100 : 0;

  const getOccupancyColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600 bg-green-100';
    if (rate >= 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card hoverable={!!onClick} onClick={onClick} className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-5 w-5 text-machikasa-blue" />
            <h3 className="font-semibold text-gray-900 text-base">
              {station.nameJa}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {station.address}
          </p>
          
          {showStats && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">{availableCount}</span>
                  <span className="text-gray-500">/{totalCount} 利用可能</span>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getOccupancyColor(occupancyRate)}`}>
                  {Math.round(occupancyRate)}%
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-2xl ml-3">
          🏛️
        </div>
      </div>
    </Card>
  );
}

// Umbrella Card Component
interface UmbrellaCardProps {
  umbrella: Umbrella;
  onClick?: () => void;
  showDetails?: boolean;
}

export function UmbrellaCard({ umbrella, onClick, showDetails = true }: UmbrellaCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'in_use':
        return 'text-blue-600 bg-blue-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      case 'lost':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'poor':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card hoverable={!!onClick} onClick={onClick} className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <UmbrellaIcon className="h-5 w-5 text-machikasa-blue" />
            <h3 className="font-semibold text-gray-900 text-base">
              傘 #{umbrella.id.slice(-6)}
            </h3>
          </div>
          
          <div className="flex items-center space-x-3 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(umbrella.status)}`}>
              {getStatusTextJa(umbrella.status)}
            </span>
            
            {showDetails && (
              <span className={`text-sm font-medium ${getConditionColor(umbrella.condition)}`}>
                {getConditionTextJa(umbrella.condition)}
              </span>
            )}
          </div>
          
          {showDetails && umbrella.borrowedBy && (
            <p className="text-sm text-gray-600">
              使用中のユーザー: {umbrella.borrowedBy.slice(-6)}
            </p>
          )}
          
          {showDetails && umbrella.lastUpdated && (
            <p className="text-xs text-gray-500 mt-2">
              最終更新: {formatDateJa(umbrella.lastUpdated)}
            </p>
          )}
        </div>
        
        <div className="text-2xl ml-3">
          ☂️
        </div>
      </div>
    </Card>
  );
}

// Transaction Card Component
interface TransactionCardProps {
  transaction: Transaction;
  showUser?: boolean;
  onClick?: () => void;
}

export function TransactionCard({ transaction, showUser = false, onClick }: TransactionCardProps) {
  const isBorrow = transaction.action === 'borrow';
  const Icon = isBorrow ? TrendingDown : TrendingUp;
  const iconColor = isBorrow ? 'text-blue-600' : 'text-green-600';
  const bgColor = isBorrow ? 'bg-blue-50' : 'bg-green-50';

  return (
    <Card hoverable={!!onClick} onClick={onClick} className="p-4">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${bgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {isBorrow ? '傘を借りました' : '傘を返却しました'}
          </p>
          
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs text-gray-500">
              {formatDateJa(transaction.timestamp)}
            </p>
            
            {!isBorrow && transaction.pointsEarned && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                +{transaction.pointsEarned}pt
              </span>
            )}
          </div>
          
          {showUser && (
            <p className="text-xs text-gray-600 mt-1">
              ユーザー: {transaction.userId.slice(-6)}
            </p>
          )}
        </div>
        
        <div className="text-lg">
          {isBorrow ? '📤' : '📥'}
        </div>
      </div>
    </Card>
  );
}

// Info Card Component (for displaying stats, notices, etc.)
interface InfoCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  trend?: {
    value: number;
    label: string;
  };
}

export function InfoCard({ title, value, subtitle, icon, color = 'blue', trend }: InfoCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
    gray: 'text-gray-600 bg-gray-50',
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {value}
          </p>
          
          {subtitle && (
            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-2 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// Loading Card Component
export function LoadingCard({ lines = 3 }: { lines?: number }) {
  return (
    <Card className="p-4 animate-pulse">
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
    </Card>
  );
}