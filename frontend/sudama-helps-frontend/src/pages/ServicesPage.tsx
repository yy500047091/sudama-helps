import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Zap,
} from 'lucide-react';
import { ServiceCard } from '@/components/common/ServiceCard';
import { NoServicesState } from '@/components/common/EmptyState';
import { ServiceCardSkeleton } from '@/components/common/Skeleton';
import { Service, ServiceCategory } from '@/types';
import { motion } from 'framer-motion';

type SortBy = 'rating' | 'price-low' | 'price-high' | 'popular';

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Professional Home Cleaning',
    description: 'Thorough cleaning of your entire home with eco-friendly products',
    category: ServiceCategory.CLEANING,
    basePrice: 500,
    durationMinutes: 120,
    status: 'ACTIVE',
    totalBookings: 1250,
    averageRating: 4.8,
    isPopular: true,
    displayOrder: 1,
  },
  {
    id: 2,
    name: 'Emergency Plumbing',
    description: 'Fix leaks, unclog pipes, and repair bathroom fixtures',
    category: ServiceCategory.PLUMBING,
    basePrice: 800,
    durationMinutes: 60,
    status: 'ACTIVE',
    totalBookings: 890,
    averageRating: 4.6,
    isPopular: true,
    displayOrder: 2,
  },
  {
    id: 3,
    name: 'Electrical Repairs & Installation',
    description: 'Safe and certified electrical work for your home',
    category: ServiceCategory.ELECTRICAL,
    basePrice: 1000,
    durationMinutes: 90,
    status: 'ACTIVE',
    totalBookings: 650,
    averageRating: 4.9,
    isPopular: true,
    displayOrder: 3,
  },
  {
    id: 4,
    name: 'Carpentry & Furniture Repair',
    description: 'Built-in wardrobes, shelves, and furniture repairs',
    category: ServiceCategory.CARPENTRY,
    basePrice: 1200,
    durationMinutes: 180,
    status: 'ACTIVE',
    totalBookings: 420,
    averageRating: 4.7,
    isPopular: false,
    displayOrder: 4,
  },
  {
    id: 5,
    name: 'Wall Painting & Finishing',
    description: 'Interior and exterior painting with premium paints',
    category: ServiceCategory.PAINTING,
    basePrice: 750,
    durationMinutes: 240,
    status: 'ACTIVE',
    totalBookings: 580,
    averageRating: 4.5,
    isPopular: false,
    displayOrder: 5,
  },
  {
    id: 6,
    name: 'AC Repair & Maintenance',
    description: 'Professional AC repair, cleaning, and AMC services',
    category: ServiceCategory.AC_REPAIR,
    basePrice: 600,
    durationMinutes: 90,
    status: 'ACTIVE',
    totalBookings: 920,
    averageRating: 4.8,
    isPopular: true,
    displayOrder: 6,
  },
  {
    id: 7,
    name: 'Appliance Repair Service',
    description: 'Repair for washing machines, refrigerators, and more',
    category: ServiceCategory.APPLIANCE_REPAIR,
    basePrice: 700,
    durationMinutes: 60,
    status: 'ACTIVE',
    totalBookings: 750,
    averageRating: 4.6,
    isPopular: false,
    displayOrder: 7,
  },
  {
    id: 8,
    name: 'Garden & Landscaping',
    description: 'Garden maintenance, planting, and landscaping',
    category: ServiceCategory.GARDENING,
    basePrice: 400,
    durationMinutes: 120,
    status: 'ACTIVE',
    totalBookings: 310,
    averageRating: 4.4,
    isPopular: false,
    displayOrder: 8,
  },
];

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  [ServiceCategory.CLEANING]: '🧹',
  [ServiceCategory.PLUMBING]: '🔧',
  [ServiceCategory.ELECTRICAL]: '⚡',
  [ServiceCategory.CARPENTRY]: '🪵',
  [ServiceCategory.PAINTING]: '🎨',
  [ServiceCategory.APPLIANCE_REPAIR]: '🔌',
  [ServiceCategory.PEST_CONTROL]: '🦟',
  [ServiceCategory.HOME_MAINTENANCE]: '🏠',
  [ServiceCategory.GARDENING]: '🌱',
  [ServiceCategory.AC_REPAIR]: '❄️',
  [ServiceCategory.OTHER]: '✨',
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const [loading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = Object.values(ServiceCategory);

  const filteredAndSortedServices = useMemo(() => {
    let services = [...MOCK_SERVICES];

    // Filter by search term
    if (searchTerm) {
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      services = services.filter((s) => s.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        services.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'price-low':
        services.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        services.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'popular':
        services.sort((a, b) => b.totalBookings - a.totalBookings);
        break;
    }

    return services;
  }, [searchTerm, selectedCategory, sortBy]);

  const handleBookService = (serviceId: number) => {
    navigate(`/booking/${serviceId}`);
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Browse Services
        </h1>
        <p className="text-gray-600">Find and book the perfect service for your home</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block w-full lg:w-64 flex-shrink-0"
        >
          <div className="bg-white rounded-lg shadow p-6">
            {/* Sort */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Zap size={18} />
                Sort By
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'rating' as SortBy, label: '⭐ Highest Rated' },
                  { value: 'price-low' as SortBy, label: '💰 Price: Low to High' },
                  { value: 'price-high' as SortBy, label: '💸 Price: High to Low' },
                  { value: 'popular' as SortBy, label: '🔥 Most Popular' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="my-6" />

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter size={18} />
                Categories
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-gray-700 text-sm">All Services</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700 text-sm">
                      {categoryIcons[cat]} {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4 flex gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Filter size={18} />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
            >
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden bg-white rounded-lg shadow p-4 mb-4"
            >
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all truncate ${
                      selectedCategory === cat
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                    title={cat}
                  >
                    {categoryIcons[cat]} {cat.slice(0, 8)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Info */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Found <strong>{filteredAndSortedServices.length}</strong> service
              {filteredAndSortedServices.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={handleBookService}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <NoServicesState onRetry={() => setSearchTerm('')} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
