import { useState } from 'react';
import { Send, CreditCard } from 'lucide-react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import PaymentScanner from './PaymentScanner';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onComplete: () => void;
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onComplete,
}: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'payment'>('details');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleStartService = async () => {
    try {
      setLoading(true);
      await api.provider.startService(task.id);
      toast.success('Service started! You are now working on this task.');
      onComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start service');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteService = async () => {
    try {
      setLoading(true);
      await api.provider.completeService(task.id);
      toast.success('Service marked as complete! Proceed to payment.');
      setActiveTab('payment');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete service');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    try {
      setLoading(true);
      const newComment = await api.provider.addComment(task.id, { text: comment });
      setComments([...comments, newComment]);
      setComment('');
      toast.success('Comment added!');
    } catch (error: any) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-4 border-blue-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-blue-500 bg-gradient-to-r from-blue-50 to-green-50">
          <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-lg transition text-2xl"
          >
            ❌
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-4 border-gray-300">
          {(['details', 'comments', 'payment'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 font-bold text-lg transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white border-b-4 border-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab === 'details' && '📋 Details'}
              {tab === 'comments' && '💬 Notes'}
              {tab === 'payment' && '💰 Payment'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Service Name */}
              <div className="bg-blue-100 border-4 border-blue-400 rounded-lg p-4">
                <div className="text-sm text-gray-600 font-semibold">Service</div>
                <div className="text-2xl font-bold text-blue-900">{task.serviceName}</div>
              </div>

              {/* Customer Details */}
              <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-4">
                <div className="text-sm text-gray-600 font-semibold mb-2">Customer Info</div>
                <div className="text-xl font-bold text-yellow-900">{task.customerName}</div>
                <div className="text-gray-700">{task.customerEmail}</div>
              </div>

              {/* Scheduled Time */}
              <div className="bg-purple-100 border-4 border-purple-400 rounded-lg p-4">
                <div className="text-sm text-gray-600 font-semibold mb-2">Scheduled Time</div>
                <div className="text-2xl font-bold text-purple-900">
                  {new Date(task.scheduledTime).toLocaleString()}
                </div>
              </div>

              {/* Amount */}
              <div className="bg-green-100 border-4 border-green-400 rounded-lg p-4">
                <div className="text-sm text-gray-600 font-semibold mb-2">Payment Amount</div>
                <div className="text-3xl font-bold text-green-900">₹{task.totalAmount?.toFixed(2)}</div>
                <div className="text-sm text-gray-700 mt-2">Tax: ₹{task.taxAmount?.toFixed(2)}</div>
              </div>

              {/* Status */}
              <div className="bg-gray-100 border-4 border-gray-400 rounded-lg p-4">
                <div className="text-sm text-gray-600 font-semibold mb-2">Current Status</div>
                <div className="text-2xl font-bold text-gray-900">
                  {task.status === 'ASSIGNED' ? '📋 Assigned' : task.status === 'IN_PROGRESS' ? '⏳ Working' : '✅ Completed'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {task.status === 'ASSIGNED' && (
                  <button
                    onClick={handleStartService}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-lg transition disabled:opacity-50"
                  >
                    ▶️ {loading ? 'Starting...' : 'START SERVICE'}
                  </button>
                )}
                {task.status === 'IN_PROGRESS' && (
                  <button
                    onClick={handleCompleteService}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-lg transition disabled:opacity-50"
                  >
                    ✅ {loading ? 'Completing...' : 'MARK COMPLETE'}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="bg-blue-50 border-4 border-blue-300 rounded-lg p-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Add a Note</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your note here..."
                  className="w-full p-3 border-2 border-blue-300 rounded-lg font-semibold text-lg focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={loading}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={20} /> {loading ? 'Adding...' : 'Add Note'}
                </button>
              </div>

              {/* Display Comments */}
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-lg">No notes yet</p>
                </div>
              ) : (
                comments.map((c, idx) => (
                  <div key={idx} className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
                    <div className="font-bold text-gray-900">{c.userName}</div>
                    <div className="text-gray-600">{c.text}</div>
                    <div className="text-xs text-gray-500 mt-2">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-4">
              {task.status === 'COMPLETED' ? (
                <>
                  <div className="bg-green-100 border-4 border-green-400 rounded-lg p-4">
                    <div className="text-xl font-bold text-green-900 mb-2">✅ Service Completed!</div>
                    <div className="text-gray-700 font-semibold">Now collect payment from customer</div>
                  </div>

                  <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-900">Amount to Collect:</div>
                    <div className="text-3xl font-bold text-green-600">₹{task.totalAmount?.toFixed(2)}</div>
                  </div>

                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl transition flex items-center justify-center gap-3"
                  >
                    <CreditCard size={24} /> SCAN PAYMENT
                  </button>

                  {showPayment && (
                    <PaymentScanner
                      bookingId={task.id}
                      amount={task.totalAmount}
                      onPaymentSuccess={() => {
                        setShowPayment(false);
                        toast.success('Payment collected! Task complete.');
                        onComplete();
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="bg-gray-100 border-4 border-gray-400 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <p className="text-xl text-gray-700 font-bold">Complete the service first before payment</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg text-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
