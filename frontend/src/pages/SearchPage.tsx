import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, Star, MapPin, Filter } from 'lucide-react'
import { searchService, SearchFilters, CaretakerSearchResult } from '../services/search.service'

const SKILLS = [
  'elderly-care', 'medical', 'post-surgery', 'companionship',
  'physical-therapy', 'dementia-care', 'palliative', 'child-care'
]

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    skills: '',
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    sortBy: 'rating'
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchService.searchCaretakers(filters)
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search caretakers by name..."
                className="input pl-10"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center gap-2"
            >
              <Filter size={18} />
              Filters
            </button>
          </form>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <select
                  className="input"
                  value={filters.skills}
                  onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                >
                  <option value="">All Skills</option>
                  {SKILLS.map(skill => (
                    <option key={skill} value={skill}>{skill.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Min $/hr"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || undefined })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Max $/hr"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || undefined })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  className="input"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SearchFilters['sortBy'] })}
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching caretakers...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading caretakers. Please try again.</p>
          </div>
        )}

        {data && (
          <>
            <p className="text-gray-600 mb-4">{data.caretakers.length} caretakers found</p>
            
            {data.caretakers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No caretakers match your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.caretakers.map((caretaker: CaretakerSearchResult) => (
                  <CaretakerCard key={caretaker.id} caretaker={caretaker} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CaretakerCard({ caretaker }: { caretaker: CaretakerSearchResult }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold">
          {caretaker.profilePhoto ? (
            <img src={caretaker.profilePhoto} alt={caretaker.fullName} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            caretaker.fullName.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-navy">{caretaker.fullName}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span>{caretaker.rating.toFixed(1)}</span>
            <span className="text-gray-400">({caretaker.reviewCount} reviews)</span>
          </div>
          {caretaker.distance && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin size={14} />
              <span>{caretaker.distance} miles away</span>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mt-4 line-clamp-2">{caretaker.bio}</p>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {caretaker.skills.slice(0, 3).map(skill => (
          <span key={skill} className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
            {skill.replace('-', ' ')}
          </span>
        ))}
        {caretaker.skills.length > 3 && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            +{caretaker.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div>
          <span className="text-xl font-bold text-primary">${caretaker.hourlyRate}</span>
          <span className="text-gray-500 text-sm">/hour</span>
        </div>
        <Link
          to={`/caretaker/${caretaker.id}`}
          className="btn-primary text-sm py-2"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
