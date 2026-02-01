import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Bookmark, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { newBooks, bestBooks, exclusiveBooks } from '@/data/books';

const allBooksList = [...newBooks, ...bestBooks, ...exclusiveBooks];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const book = allBooksList.find((b) => b.id === id);
  const relatedBooks = allBooksList.filter((b) => b.category === book?.category && b.id !== id).slice(0, 4);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Книга не найдена</h1>
            <Link to="/catalog" className="text-[#26C6DA] hover:underline">
              Вернуться в каталог
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const coverTypeText = book.coverType === 'hard' ? 'Твердая обложка' : 'Мягкая обложка';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="container-cg py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-[#26C6DA]">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/catalog" className="hover:text-[#26C6DA]">Каталог</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 line-clamp-1">{book.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="relative">
              {book.badge === 'new' && (
                <div
                  className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-medium rounded"
                  style={{ backgroundColor: '#C8E6C9', color: '#2E7D32' }}
                >
                  Новинка
                </div>
              )}
              <div className="aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden max-w-md mx-auto">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <span className="text-sm text-gray-500">{coverTypeText}</span>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-2">
                {book.title}
              </h1>

              <Link
                to={`/catalog?author=${encodeURIComponent(book.author)}`}
                className="text-lg hover:text-[#26C6DA] transition-colors"
                style={{ color: '#26C6DA' }}
              >
                {book.author}
              </Link>

              {/* Rating */}
              {book.rating > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'text-gray-800' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500">({book.reviewCount} отзывов)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mt-6">
                <span className="text-3xl font-bold text-gray-900">{book.price} ₽</span>
                {book.oldPrice && (
                  <span className="text-xl text-gray-400 line-through">{book.oldPrice} ₽</span>
                )}
                {book.discount && (
                  <span
                    className="px-2 py-1 text-sm font-medium rounded"
                    style={{ backgroundColor: '#FCE4EC', color: '#E91E63' }}
                  >
                    Экономия {book.oldPrice! - book.price} ₽
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-8">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart(book);
                    }
                  }}
                  className="flex-1 h-11 rounded-lg font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
                >
                  В корзину
                </button>

                {/* Bookmark */}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="w-11 h-11 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#26C6DA] transition-colors"
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? 'fill-[#26C6DA] text-[#26C6DA]' : 'text-gray-400'}`}
                  />
                </button>

                {/* Share */}
                <button className="w-11 h-11 border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#26C6DA] transition-colors">
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                  <Truck className="w-7 h-7 mb-2" style={{ color: '#26C6DA' }} />
                  <span className="text-xs text-gray-600">Бесплатная доставка от 1000 ₽</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-7 h-7 mb-2" style={{ color: '#26C6DA' }} />
                  <span className="text-xs text-gray-600">Гарантия качества</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-7 h-7 mb-2" style={{ color: '#26C6DA' }} />
                  <span className="text-xs text-gray-600">Возврат в течение 14 дней</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-3">Описание</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {book.title} — это захватывающее произведение от автора {book.author}.
                  Книга входит в категорию &quot;{book.category}&quot; и имеет {coverTypeText.toLowerCase()}.
                  Отличный выбор для любителей качественной литературы.
                </p>
              </div>

              {/* Specifications */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-3">Характеристики</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Автор</span>
                    <span className="font-medium">{book.author}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Тип обложки</span>
                    <span className="font-medium">{coverTypeText}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Категория</span>
                    <span className="font-medium">{book.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Рейтинг</span>
                    <span className="font-medium">{book.rating} / 5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedBooks.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Похожие книги</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedBooks.map((relatedBook) => (
                  <ProductCard key={relatedBook.id} book={relatedBook} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
