import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface AdminProvidersTableProps {
  providers: any;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export default function AdminProvidersTable({
  providers,
  loading,
  page,
  onPageChange,
}: AdminProvidersTableProps) {
  if (loading) {
    return <div className="text-center py-10">Loading providers...</div>;
  }

  const content = providers.content || [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Completed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {content.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No providers found
                </td>
              </tr>
            ) : (
              content.map((provider: any) => (
                <tr key={provider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold mr-3">
                        {provider.fullName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{provider.fullName}</div>
                        <div className="text-xs text-gray-500">ID: {provider.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{provider.email}</div>
                    <div className="text-xs text-gray-500">{provider.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      {provider.rating ? (
                        <>
                          <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          <span className="font-medium text-gray-900">
                            {provider.rating.toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">No rating</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-emerald-600">
                    {provider.totalCompletedBookings || 0}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        provider.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : provider.status === 'INACTIVE'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(provider.createdAt).toLocaleDateString()}
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
          Page {page + 1} of {Math.ceil((providers.totalElements || 0) / (providers.size || 10))}
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
            disabled={providers.last}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
