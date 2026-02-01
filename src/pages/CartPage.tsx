import { Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, X, ShoppingBag, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const deliveryCost = totalPrice >= 1000 ? 0 : 299;
  const finalTotal = totalPrice + deliveryCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <div className="container-cg py-12">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link to="/" className="hover:text-[#26C6DA]">Главная</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Корзина</span>
            </nav>

            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Корзина пуста</h1>
              <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
              <Link
                to="/catalog"
                className="px-6 py-2.5 rounded-lg font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
              >
                Перейти в каталог
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container-cg py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#26C6DA]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Корзина</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Корзина ({totalItems})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-600">Выбрать все</span>
                </label>
                <button
                  onClick={clearCart}
                  className="text-sm text-[#26C6DA] hover:underline"
                >
                  Очистить корзину
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-2 rounded border-gray-300"
                      defaultChecked
                    />

                    <Link to={`/product/${item.id}`} className="w-20 h-28 flex-shrink-0">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-medium text-gray-900 hover:text-[#26C6DA] transition-colors line-clamp-2 text-sm">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-0.5">{item.author}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.coverType === 'hard' ? 'Твердая обложка' : 'Мягкая обложка'}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">
                            {item.price * item.quantity} ₽
                          </span>
                          {item.oldPrice && (
                            <p className="text-sm text-gray-400 line-through">
                              {item.oldPrice * item.quantity} ₽
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#E91E63] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-5 sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Ваш заказ</h2>

                {/* Promo Code */}
                <div className="mb-5">
                  <label className="text-sm text-gray-600 mb-2 block">Промокод</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Введите промокод"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#26C6DA]"
                    />
                    <button className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                      Применить
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товары ({totalItems})</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Скидка</span>
                    <span style={{ color: '#4CAF50' }}>
                      -{items.reduce((sum, item) => sum + ((item.oldPrice || item.price) - item.price) * item.quantity, 0)} ₽
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span>{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                  </div>
                  {deliveryCost > 0 && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#26C6DA' }}>
                      <Truck className="w-4 h-4" />
                      <span>Бесплатная доставка от 1000 ₽</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-5">
                  <span className="font-medium">Итого</span>
                  <span className="text-2xl font-bold text-gray-900">{finalTotal} ₽</span>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
                >
                  Оформить заказ
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь с условиями
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
