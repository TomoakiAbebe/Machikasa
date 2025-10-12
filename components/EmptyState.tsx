'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ 
  icon = '📭', 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4 opacity-50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Specific empty states for different sections
export function NoTransactionsEmpty({ onStartUsing }: { onStartUsing?: () => void }) {
  return (
    <EmptyState
      icon="🌂"
      title="取引履歴がありません"
      description="まだ傘の借用・返却を行っていません。QRコードをスキャンして利用を開始しましょう。"
      action={onStartUsing ? {
        label: "QRスキャンを開始",
        onClick: onStartUsing
      } : undefined}
    />
  );
}

export function NoStatsEmpty() {
  return (
    <EmptyState
      icon="📊"
      title="統計データがありません"
      description="まだ十分なデータが蓄積されていません。サービスの利用が増えると統計が表示されます。"
    />
  );
}

export function NoSponsorsEmpty() {
  return (
    <EmptyState
      icon="🏢"
      title="協賛企業がありません"
      description="現在協賛企業の登録がありません。地域企業の皆様のご協力をお待ちしています。"
    />
  );
}