import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Calendar, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/books';

const categories = [
  { name: 'Все статьи', count: 156 },
  { name: 'Новинки', count: 42 },
  { name: 'Подборки', count: 38 },
  { name: 'Обзоры', count: 35 },
  { name: 'Интервью', count: 24 },
  { name: 'Новости', count: 17 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-white">
        <div className="container-cg py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#E31E24]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Блог</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Читай-журнал</h1>
            <p className="text-gray-600">Статьи о книгах, обзоры, подборки и новости</p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat, index) => (
              <button
                key={cat.name}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  index === 0
                    ? 'bg-[#E31E24] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
                <span className="ml-2 text-xs opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-10">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=500&fit=crop"
              alt="Featured post"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block px-3 py-1 bg-[#E31E24] text-white text-sm font-medium rounded-full mb-4">
                Подборка
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-2xl">
                Год начинается... с 10 главных новинок января!
              </h2>
              <p className="text-white/80 mb-6 max-w-xl">
                Подборка самых ожидаемых книг нового года, которые уже доступны для предзаказа
              </p>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  15 января 2025
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  5 мин чтения
                </span>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Последние статьи</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E31E24] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-1 text-[#E31E24] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Читать
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <button className="px-8 py-3 border-2 border-[#E31E24] text-[#E31E24] font-medium rounded-lg hover:bg-[#E31E24] hover:text-white transition-colors">
              Загрузить ещё
            </button>
          </div>

          {/* Newsletter */}
          <div className="mt-16 bg-gradient-to-r from-[#26D4D4] to-[#20B8B8] rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Подпишитесь на нашу рассылку
                </h2>
                <p className="text-white/90 max-w-lg">
                  Получайте уведомления о новых статьях, подборках и эксклюзивных предложениях
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-1 md:w-64 px-4 py-3 rounded-lg text-sm focus:outline-none"
                />
                <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Подписаться
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
