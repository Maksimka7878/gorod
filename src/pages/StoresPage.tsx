import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Phone, Clock, Search } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { stores } from '@/data/books';

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-white">
        <div className="container-cg py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#E31E24]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Магазины</span>
          </nav>

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Адреса магазинов</h1>
            <p className="text-gray-600">Найдите ближайший магазин Читай-город</p>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или адресу"
              className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stores List */}
            <div className="lg:col-span-1 space-y-4">
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store.id)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedStore === store.id
                      ? 'border-[#E31E24] bg-red-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <h3 className="font-bold text-gray-900 mb-2">{store.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredStores.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Магазины не найдены
                </div>
              )}
            </div>

            {/* Map Placeholder */}
            <div className="lg:col-span-2">
              <div className="h-[500px] lg:h-[600px] bg-gray-100 rounded-2xl overflow-hidden relative">
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="absolute inset-0 opacity-30">
                    {/* Grid pattern */}
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #ccc 1px, transparent 1px),
                          linear-gradient(to bottom, #ccc 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                      }}
                    />
                  </div>
                </div>

                {/* Map Markers */}
                {stores.map((store, index) => (
                  <div
                    key={store.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      selectedStore === store.id ? 'scale-125 z-10' : 'hover:scale-110'
                    }`}
                    style={{
                      left: `${30 + index * 25}%`,
                      top: `${40 + (index % 2) * 20}%`,
                    }}
                    onClick={() => setSelectedStore(store.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        selectedStore === store.id
                          ? 'bg-[#E31E24] text-white'
                          : 'bg-white text-[#E31E24]'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-white rounded-lg shadow-lg whitespace-nowrap text-sm font-medium ${
                        selectedStore === store.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {store.name}
                    </div>
                  </div>
                ))}

                {/* Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <span className="text-xl font-bold text-gray-600">+</span>
                  </button>
                  <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <span className="text-xl font-bold text-gray-600">−</span>
                  </button>
                </div>

                {/* Legend */}
                <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Легенда</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-[#E31E24] rounded-full" />
                    <span>Магазин Читай-город</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#26D4D4]/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#26D4D4]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Часы работы</h3>
              <p className="text-sm text-gray-600">
                Большинство наших магазинов работают ежедневно с 10:00 до 22:00.
                Точное расписание уточняйте на странице конкретного магазина.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#E31E24]/10 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#E31E24]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Единый телефон</h3>
              <p className="text-sm text-gray-600">
                По всем вопросам звоните на единую горячую линию:{' '}
                <a href="tel:84954248444" className="text-[#E31E24] font-medium">
                  8 495 424-84-44
                </a>
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#FFC107]/10 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#FFC107]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Самовывоз</h3>
              <p className="text-sm text-gray-600">
                Заказывайте онлайн и забирайте в ближайшем магазине бесплатно.
                Срок хранения заказа — 3 дня.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
