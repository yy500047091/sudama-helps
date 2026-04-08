import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import { TaskCard, TaskDetailModal } from '@/components/provider';

type TaskFilter = 'all' | 'pending' | 'progress' | 'completed';

export default function ProviderDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>('pending');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [page, filter]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.provider.getDashboard();
      setStats(data);
    } catch (error: any) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.provider.getAssignedBookings(page, 10);
      setTasks(data);
    } catch (error: any) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowDetail(true);
  };

  const handleRefresh = () => {
    loadDashboard();
    loadTasks();
  };

  if (!stats) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  const getFilteredTasks = () => {
    const content = tasks.content || [];
    if (filter === 'all') return content;
    if (filter === 'pending') return content.filter((t: any) => t.status === 'ASSIGNED');
    if (filter === 'progress') return content.filter((t: any) => t.status === 'IN_PROGRESS');
    if (filter === 'completed') return content.filter((t: any) => t.status === 'COMPLETED');
    return content;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-green-500 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">👨‍🔧</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Work Dashboard</h1>
                <p className="text-gray-600">Welcome, {stats.providerName}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-lg"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 rounded-lg p-4 text-center border-4 border-blue-400">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-blue-700">{stats.rating?.toFixed(1)}</div>
              <div className="text-gray-600 font-semibold">Rating</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4 text-center border-4 border-yellow-400">
              <div className="text-4xl mb-2">📋</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.assignedBookings}</div>
              <div className="text-gray-600 font-semibold">Assigned</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-4 text-center border-4 border-purple-400">
              <div className="text-4xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-purple-700">{stats.inProgressBookings}</div>
              <div className="text-gray-600 font-semibold">In Progress</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center border-4 border-green-400">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-700">{stats.completedToday}</div>
              <div className="text-gray-600 font-semibold">Done Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {(['all', 'pending', 'progress', 'completed'] as TaskFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(0);
              }}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition ${
                filter === f
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500'
              }`}
            >
              {f === 'all' && '📑 All'}
              {f === 'pending' && '📝 Pending'}
              {f === 'progress' && '⏳ In Progress'}
              {f === 'completed' && '✅ Completed'}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-xl">Loading tasks...</div>
        ) : getFilteredTasks().length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-2xl text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTasks().map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
          task={selectedTask}
          onComplete={() => {
            setShowDetail(false);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}
