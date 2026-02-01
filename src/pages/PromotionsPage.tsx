import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Percent, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { promotions } from '@/data/books';

export default function PromotionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-white">
        <div className="container-cg py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#E31E24]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Акции</span>
          </nav>

          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Акции и специальные предложения</h1>
            <p className="text-gray-600">Выгодные предложения на книги и сопутствующие товары</p>
          </div>

          {/* Hero Banner */}
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-10">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=400&fit=crop"
              alt="Акции"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#E31E24]/90 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
              <div className="flex items-center gap-2 text-white/80 mb-4">
                <Percent className="w-5 h-5" />
                <span className="text-sm font-medium">Скидки до 50%</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-lg">
                Большая распродажа зимы
              </h2>
              <p className="text-white/90 mb-6 max-w-md">
                Тысячи книг со скидками до 50%. Успейте купить любимые произведения по выгодным ценам!
              </p>
              <Link
                to="/catalog?discount=true"
                className="w-fit px-6 py-3 bg-white text-[#E31E24] font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Смотреть товары
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Active Promotions */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Активные акции</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#E31E24] text-white text-sm font-bold rounded-full">
                    -{promo.discount}%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E31E24] transition-colors">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      С {new Date(promo.startDate).toLocaleDateString('ru-RU')} по{' '}
                      {new Date(promo.endDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <Link
                    to="/catalog"
                    className="flex items-center gap-2 text-[#E31E24] font-medium group-hover:gap-3 transition-all"
                  >
                    Подробнее
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Loyalty Program Banner */}
          <div className="bg-gradient-to-r from-[#26D4D4] to-[#20B8B8] rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Программа лояльности Читай-город
                </h2>
                <p className="text-white/90 mb-6 max-w-lg">
                  Получайте бонусы за покупки и обменивайте их на скидки. 
                  Чем больше покупаете — тем больше экономите!
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Percent className="w-5 h-5" />
                    </div>
                    <span className="text-sm">До 15% кешбэка</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-sm">Бонусы не сгорают</span>
                  </div>
                </div>
              </div>
              <Link
                to="/loyalty"
                className="px-8 py-3 bg-white text-[#26D4D4] font-medium rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Узнать подробнее
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
