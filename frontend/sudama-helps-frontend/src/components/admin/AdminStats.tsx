interface AdminStatsProps {
  stats: any;
  loading: boolean;
}

export default function AdminStats({ stats, loading }: AdminStatsProps) {
  if (loading) {
    return <div className="text-center py-10">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-center py-10 text-gray-500">No data available</div>;
  }

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      color: 'bg-blue-50 text-blue-700',
      icon: '📊',
    },
    {
      label: 'Pending Bookings',
      value: stats.pendingBookings,
      color: 'bg-yellow-50 text-yellow-700',
      icon: '⏳',
    },
    {
      label: 'Completed Bookings',
      value: stats.completedBookings,
      color: 'bg-green-50 text-green-700',
      icon: '✅',
    },
    {
      label: 'Cancelled Bookings',
      value: stats.cancelledBookings,
      color: 'bg-red-50 text-red-700',
      icon: '❌',
    },
    {
      label: 'Total Providers',
      value: stats.totalProviders,
      color: 'bg-purple-50 text-purple-700',
      icon: '👨‍🔧',
    },
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      color: 'bg-indigo-50 text-indigo-700',
      icon: '👥',
    },
    {
      label: 'Total Services',
      value: stats.totalServices,
      color: 'bg-pink-50 text-pink-700',
      icon: '🛠️',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-lg p-6 shadow-sm border border-opacity-20`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-75">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <span className="text-3xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
