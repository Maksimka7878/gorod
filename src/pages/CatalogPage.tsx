import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { newBooks, bestBooks, exclusiveBooks, comingSoonBooks, categories } from '@/data/books';

const allBooks = [...newBooks, ...bestBooks, ...exclusiveBooks, ...comingSoonBooks];

const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Цена по возрастанию' },
  { value: 'price-desc', label: 'Цена по убыванию' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'rating', label: 'По рейтингу' },
];

const coverTypes = [
  { value: 'hard', label: 'Твердая обложка' },
  { value: 'soft', label: 'Мягкая обложка' },
];

const priceRanges = [
  { min: 0, max: 300, label: 'До 300 ₽' },
  { min: 300, max: 500, label: '300 - 500 ₽' },
  { min: 500, max: 1000, label: '500 - 1000 ₽' },
  { min: 1000, max: Infinity, label: 'Более 1000 ₽' },
];

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCoverTypes, setSelectedCoverTypes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{min: number; max: number} | null>(null);
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const sectionParam = searchParams.get('section') || '';

  const filteredBooks = useMemo(() => {
    let books = [...allBooks];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }
    
    if (sectionParam) {
      switch (sectionParam) {
        case 'new':
          books = newBooks;
          break;
        case 'best':
          books = bestBooks;
          break;
        case 'exclusive':
          books = exclusiveBooks;
          break;
        case 'coming-soon':
          books = comingSoonBooks;
          break;
      }
    }
    
    if (selectedCategories.length > 0) {
      books = books.filter((book) =>
        selectedCategories.includes(book.category || '')
      );
    }
    
    if (selectedCoverTypes.length > 0) {
      books = books.filter((book) =>
        selectedCoverTypes.includes(book.coverType)
      );
    }
    
    if (selectedPriceRange) {
      books = books.filter(
        (book) =>
          book.price >= selectedPriceRange.min &&
          book.price <= selectedPriceRange.max
      );
    }
    
    if (showDiscountOnly) {
      books = books.filter((book) => book.discount);
    }
    
    switch (sortBy) {
      case 'price-asc':
        books.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        books.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        books.sort((a) => (a.badge === 'new' ? -1 : 1));
        break;
      case 'rating':
        books.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    return books;
  }, [searchQuery, sectionParam, selectedCategories, selectedCoverTypes, selectedPriceRange, showDiscountOnly, sortBy]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleCoverType = (type: string) => {
    setSelectedCoverTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCoverTypes([]);
    setSelectedPriceRange(null);
    setShowDiscountOnly(false);
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedCoverTypes.length +
    (selectedPriceRange ? 1 : 0) +
    (showDiscountOnly ? 1 : 0);

  const getPageTitle = () => {
    if (searchQuery) return `Результаты поиска: "${searchQuery}"`;
    if (sectionParam) {
      const titles: Record<string, string> = {
        new: 'Новинки литературы',
        best: 'Лучшие из лучших',
        exclusive: 'Эксклюзивно в Читай-городе',
        'coming-soon': 'Скоро в продаже',
      };
      return titles[sectionParam] || 'Каталог';
    }
    return 'Каталог';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="container-cg py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#26C6DA]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Каталог</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {getPageTitle()}
          </h1>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-[#26C6DA] transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Фильтры</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-[#26C6DA] text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#26C6DA] text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#E0F7FA]' : 'hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#E0F7FA]' : 'hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Filters */}
            {isSidebarOpen && (
              <aside className="w-64 flex-shrink-0">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Фильтры</h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-[#26C6DA] hover:underline"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Категории</h4>
                    <div className="space-y-2">
                      {categories[0].subcategories?.slice(0, 6).map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.name)}
                            onChange={() => toggleCategory(cat.name)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Тип обложки</h4>
                    <div className="space-y-2">
                      {coverTypes.map((type) => (
                        <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCoverTypes.includes(type.value)}
                            onChange={() => toggleCoverType(type.value)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-600">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Цена</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={selectedPriceRange?.min === range.min}
                            onChange={() => setSelectedPriceRange(range)}
                            className="w-4 h-4 border-gray-300"
                          />
                          <span className="text-sm text-gray-600">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showDiscountOnly}
                        onChange={(e) => setShowDiscountOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Только со скидкой</span>
                    </label>
                  </div>
                </div>
              </aside>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {filteredBooks.length > 0 ? (
                <div className={`grid gap-4 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid-cols-1'
                }`}>
                  {filteredBooks.map((book) => (
                    <ProductCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Книги не найдены</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
