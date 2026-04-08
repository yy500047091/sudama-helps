import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminBookingsTableProps {
  bookings: any;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onAssignClick: (booking: any) => void;
}

export default function AdminBookingsTable({
  bookings,
  loading,
  page,
  onPageChange,
  onAssignClick,
}: AdminBookingsTableProps) {
  if (loading) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }

  const content = bookings.content || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {content.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              content.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{booking.customerName}</div>
                    <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.serviceName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : booking.status === 'ASSIGNED'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{booking.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {['PENDING', 'ASSIGNED'].includes(booking.status) ? (
                      <button
                        onClick={() => onAssignClick(booking)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        {booking.status === 'PENDING' ? 'Assign Provider' : 'Re-assign'}
                      </button>
                    ) : (
                      <span className="text-gray-400">
                        {booking.providerName || 'N/A'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Page {page + 1} of {Math.ceil((bookings.totalElements || 0) / (bookings.size || 10))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={bookings.last}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
