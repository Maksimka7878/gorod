import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import type { Book } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  book: Book;
}

// Star rating component
function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5 mt-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-gray-800' : 'text-gray-300'
              }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-400">({reviewCount})</span>
    </div>
  );
}

export default function ProductCard({ book }: ProductCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { addToCart } = useCart();

  const coverTypeText = book.coverType === 'hard' ? 'Твердая обложка' : 'Мягкая обложка';

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Badge - Новинка (light green like original) */}
      {book.badge === 'new' && (
        <div
          className="absolute top-2 left-2 z-10 px-2 py-0.5 text-xs font-medium rounded"
          style={{ backgroundColor: '#C8E6C9', color: '#2E7D32' }}
        >
          Новинка
        </div>
      )}

      {/* Badge - Эксклюзив */}
      {book.badge === 'exclusive' && (
        <div
          className="absolute top-2 left-2 z-10 px-2 py-0.5 text-xs font-medium rounded"
          style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}
        >
          Эксклюзив
        </div>
      )}

      {/* Image */}
      <Link to={`/product/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-100">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-2.5">
        {/* Cover Type */}
        <span className="text-xs text-gray-500">{coverTypeText}</span>

        {/* Price */}
        <div className="flex items-center gap-1.5 mt-0.5 mb-0.5 flex-wrap">
          {book.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{book.oldPrice} ₽</span>
          )}
          <span className="text-base font-bold text-gray-900">{book.price} ₽</span>
          {book.discount && (
            <span
              className="px-1.5 py-0.5 text-xs font-medium rounded"
              style={{ backgroundColor: '#FCE4EC', color: '#E91E63' }}
            >
              -{book.discount}%
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/product/${book.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#26C6DA] transition-colors min-h-[40px] leading-tight">
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{book.author}</p>

        {/* Rating */}
        {book.rating > 0 && <StarRating rating={book.rating} reviewCount={book.reviewCount} />}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2.5">
          {/* Buy Button */}
          <button
            onClick={() => addToCart(book)}
            className="flex-1 py-1.5 px-3 rounded-lg font-medium text-sm transition-colors hover:opacity-90"
            style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
          >
            Купить
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-[#26C6DA] transition-colors"
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-[#26C6DA] text-[#26C6DA]' : 'text-gray-400'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
