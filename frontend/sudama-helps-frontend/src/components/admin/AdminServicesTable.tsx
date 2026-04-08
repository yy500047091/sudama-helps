import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminServicesTableProps {
  services: any;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export default function AdminServicesTable({
  services,
  loading,
  page,
  onPageChange,
}: AdminServicesTableProps) {
  if (loading) {
    return <div className="text-center py-10">Loading services...</div>;
  }

  const content = services.content || [];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      CLEANING: 'bg-blue-100 text-blue-800',
      PLUMBING: 'bg-purple-100 text-purple-800',
      ELECTRICAL: 'bg-amber-100 text-amber-800',
      CARPENTRY: 'bg-orange-100 text-orange-800',
      PAINTING: 'bg-pink-100 text-pink-800',
      APPLIANCE_REPAIR: 'bg-indigo-100 text-indigo-800',
      PEST_CONTROL: 'bg-red-100 text-red-800',
      HOME_MAINTENANCE: 'bg-green-100 text-green-800',
      GARDENING: 'bg-lime-100 text-lime-800',
      AC_REPAIR: 'bg-cyan-100 text-cyan-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Base Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Popular
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {content.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No services found
                </td>
              </tr>
            ) : (
              content.map((service: any) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {service.description?.substring(0, 50)}
                        {service.description?.length > 50 ? '...' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{service.basePrice?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {service.durationMinutes} mins
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        service.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {service.isPopular ? (
                      <span className="text-yellow-500 font-semibold">★ Popular</span>
                    ) : (
                      <span className="text-gray-400">Not popular</span>
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
          Page {page + 1} of {Math.ceil((services.totalElements || 0) / (services.size || 10))}
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
            disabled={services.last}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
