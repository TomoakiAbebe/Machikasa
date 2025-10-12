import { Station } from '@/types';
import { formatTime, getBatteryColor } from '@/lib/utils';

interface StationCardProps {
  station: Station;
  umbrellaCount?: number;
  onClick?: () => void;
  className?: string;
}

export default function StationCard({ 
  station, 
  umbrellaCount, 
  onClick, 
  className = '' 
}: StationCardProps) {
  const availableCount = umbrellaCount ?? station.currentCount;
  const isLowStock = availableCount <= 2;
  const isFull = availableCount >= station.capacity;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
        isLowStock ? 'border-l-red-500' : isFull ? 'border-l-green-500' : 'border-l-umbrella-blue'
      } ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Station header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{station.nameJa}</h3>
          <p className="text-sm text-gray-600">{station.name}</p>
        </div>
        <div className="flex items-center space-x-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            station.type === 'university' ? 'bg-blue-100 text-blue-800' :
            station.type === 'store' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {station.type === 'university' ? '大学' :
             station.type === 'store' ? '店舗' : '公共'}
          </span>
        </div>
      </div>

      {/* Address */}
      <p className="text-sm text-gray-600 mb-3">{station.addressJa}</p>

      {/* Umbrella availability */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">☂️</span>
          <div>
            <p className="text-sm font-medium text-gray-700">
              利用可能: {availableCount} / {station.capacity}
            </p>
            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full ${
                  isLowStock ? 'bg-red-500' : 
                  isFull ? 'bg-green-500' : 'bg-umbrella-blue'
                }`}
                style={{ width: `${(availableCount / station.capacity) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="text-right">
          {isLowStock && (
            <span className="text-xs text-red-600 font-medium">在庫少</span>
          )}
          {isFull && (
            <span className="text-xs text-green-600 font-medium">満杯</span>
          )}
          {!isLowStock && !isFull && (
            <span className="text-xs text-umbrella-blue font-medium">利用可</span>
          )}
        </div>
      </div>

      {/* Operating hours */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <span>🕒</span>
          <span>
            {formatTime(station.operatingHours.open)} - {formatTime(station.operatingHours.close)}
          </span>
        </div>
        
        {/* Active status */}
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            station.isActive ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-xs">
            {station.isActive ? '稼働中' : '停止中'}
          </span>
        </div>
      </div>

      {/* Contact info (if available) */}
      {station.contactInfo?.phone && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center space-x-1">
            <span>📞</span>
            <span>{station.contactInfo.phone}</span>
          </p>
        </div>
      )}
    </div>
  );
}