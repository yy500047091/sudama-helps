import { Clock, User, DollarSign } from 'lucide-react';

interface TaskCardProps {
  task: any;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', icon: '📋' };
      case 'IN_PROGRESS':
        return { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', icon: '⏳' };
      case 'COMPLETED':
        return { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', icon: '✅' };
      default:
        return { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', icon: '📌' };
    }
  };

  const status = getStatusColor(task.status);
  const scheduledTime = new Date(task.scheduledTime);
  const timeString = scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = scheduledTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transform transition hover:scale-105 ${status.bg} border-4 ${status.border} rounded-xl p-6 shadow-lg hover:shadow-xl`}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-3xl font-bold ${status.text}`}>{status.icon}</span>
        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${status.text} bg-white border-2 ${status.border}`}>
          {task.status === 'ASSIGNED' ? 'Assigned' : task.status === 'IN_PROGRESS' ? 'Working' : 'Done'}
        </span>
      </div>

      {/* Service Name - Large and Clear */}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{task.serviceName}</h3>

      {/* Customer Info */}
      <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3 border-2 border-white">
        <div className="flex items-center gap-2 text-gray-700">
          <User size={20} />
          <span className="font-semibold text-lg">{task.customerName}</span>
        </div>
      </div>

      {/* Time and Date */}
      <div className="flex items-center gap-3 mb-3 text-gray-700 font-semibold">
        <Clock size={24} />
        <div>
          <div className="text-xl">{timeString}</div>
          <div className="text-sm text-gray-600">{dateString}</div>
        </div>
      </div>

      {/* Amount */}
      <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3 border-2 border-white">
        <div className="flex items-center gap-2">
          <DollarSign size={24} className="text-green-600" />
          <div>
            <div className="text-xl font-bold text-green-700">₹ {task.totalAmount?.toFixed(2)}</div>
            <div className="text-xs text-gray-600">(Incl. taxes)</div>
          </div>
        </div>
      </div>

      {/* Click to view button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition mt-2">
        👉 View Details & Start
      </button>
    </div>
  );
}
