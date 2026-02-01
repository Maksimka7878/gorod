import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ChevronDown,
  Search,
  User,
  Package,
  Heart,
  ShoppingCart,
  Menu,
  X,
  BookOpen,
  PenTool,
  Gift,
  Gamepad2,
  Palette,
  Coffee,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/books';

const topLinks = [
  { name: 'Магазины', href: '/stores' },
  { name: 'Акции', href: '/promotions' },
  { name: 'Распродажа', href: '/sale' },
  { name: 'Комиксы и манга', href: '/comics', hasIcon: true },
  { name: 'Сертификаты', href: '/certificates' },
  { name: 'Программа лояльности', href: '/loyalty' },
  { name: 'Блог', href: '/blog' },
];

const moreLinks = [
  { name: 'Доставка и оплата', href: '/delivery' },
  { name: 'Вопросы и ответы', href: '/faq' },
  { name: 'О компании', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'Книги': <BookOpen className="w-5 h-5" />,
  'Канцтовары': <PenTool className="w-5 h-5" />,
  'Подарки и сувениры': <Gift className="w-5 h-5" />,
  'Игры и игрушки': <Gamepad2 className="w-5 h-5" />,
  'Творчество и хобби': <Palette className="w-5 h-5" />,
  'Товары для художников': <Palette className="w-5 h-5" />,
  'Еда и напитки': <Coffee className="w-5 h-5" />,
};

export default function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="w-full bg-white">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-cg">
          <div className="flex items-center justify-between h-10 text-sm">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="cursor-pointer hover:text-[#26C6DA] transition-colors">
                Россия, Москва
              </span>
              <ChevronDown className="w-3 h-3" />
            </div>

            {/* Top Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {topLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-gray-600 hover:text-[#26C6DA] transition-colors whitespace-nowrap ${link.hasIcon ? 'flex items-center gap-1.5' : ''
                    }`}
                >
                  {link.hasIcon && <span className="text-[#26C6DA]">✦</span>}
                  {link.name}
                </Link>
              ))}

              {/* More Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-[#26C6DA] transition-colors"
                  onMouseEnter={() => setIsMoreOpen(true)}
                  onMouseLeave={() => setIsMoreOpen(false)}
                >
                  Ещё
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isMoreOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                    onMouseEnter={() => setIsMoreOpen(true)}
                    onMouseLeave={() => setIsMoreOpen(false)}
                  >
                    {moreLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#26C6DA] transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-cg">
          <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="flex flex-col leading-none">
                <span className="text-2xl lg:text-[28px] font-black tracking-tight" style={{ color: '#1A1A1A' }}>
                  ЧИТАЙ
                </span>
                <span className="text-2xl lg:text-[28px] font-black tracking-tight" style={{ color: '#4A90D9' }}>
                  ГОРОД
                </span>
              </div>
            </Link>

            {/* Catalog Button */}
            <div className="relative hidden lg:block">
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
                onMouseEnter={() => setIsCatalogOpen(true)}
                onMouseLeave={() => setIsCatalogOpen(false)}
                onClick={() => navigate('/catalog')}
              >
                <Menu className="w-5 h-5" />
                Каталог
              </button>

              {/* Catalog Dropdown */}
              {isCatalogOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                  onMouseEnter={() => setIsCatalogOpen(true)}
                  onMouseLeave={() => setIsCatalogOpen(false)}
                >
                  <div className="flex">
                    {/* Left Column - Main Categories */}
                    <div className="w-1/2 py-3">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer group"
                        >
                          <span className="text-gray-400 group-hover:text-[#26C6DA] transition-colors">
                            {categoryIcons[category.name]}
                          </span>
                          <span className="text-gray-700 group-hover:text-[#26C6DA] transition-colors font-medium text-sm">
                            {category.name}
                          </span>
                          <ChevronDown className="w-4 h-4 ml-auto text-gray-300 -rotate-90" />
                        </div>
                      ))}
                    </div>

                    {/* Right Column - Subcategories */}
                    <div className="w-1/2 bg-gray-50 py-4 px-4">
                      <Link
                        to="/catalog"
                        className="text-[#26C6DA] font-medium hover:underline mb-4 block text-sm"
                      >
                        Смотреть все товары
                      </Link>
                      <div className="space-y-2">
                        {categories[0].subcategories?.slice(0, 8).map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/catalog?category=${sub.id}`}
                            className="block text-sm text-gray-600 hover:text-[#26C6DA] transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
              <div className="relative flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Найти..."
                  className="flex-1 h-11 pl-4 pr-4 bg-gray-50 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B2EBF2] focus:bg-white transition-all border border-gray-200 border-r-0"
                />
                <button
                  type="submit"
                  className="w-12 h-11 rounded-r-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: '#E0F7FA' }}
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center gap-5 lg:gap-6">
              <Link
                to="/login"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#26C6DA] transition-colors"
              >
                <User className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs hidden lg:block">Войти</span>
              </Link>
              <Link
                to="/orders"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#26C6DA] transition-colors"
              >
                <Package className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs hidden lg:block">Заказы</span>
              </Link>
              <Link
                to="/my-books"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#26C6DA] transition-colors"
              >
                <Heart className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs hidden lg:block">Мои книги</span>
              </Link>
              <Link
                to="/cart"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#26C6DA] transition-colors relative"
              >
                <ShoppingCart className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-xs hidden lg:block">Корзина</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E91E63] text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="container-cg py-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Найти..."
                  className="flex-1 h-11 pl-4 pr-4 bg-gray-50 rounded-l-lg text-sm focus:outline-none border border-gray-200 border-r-0"
                />
                <button
                  type="submit"
                  className="w-12 h-11 rounded-r-lg flex items-center justify-center"
                  style={{ backgroundColor: '#E0F7FA' }}
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </form>
            <nav className="space-y-2">
              {topLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block py-2 text-gray-700 hover:text-[#26C6DA]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500">Ещё</span>
                {moreLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block py-2 text-gray-700 hover:text-[#26C6DA]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
