import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Book } from '@/types';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  books: Book[];
  viewAllLink?: string;
  showViewAll?: boolean;
}

export default function ProductSection({
  title,
  books,
  viewAllLink = '/catalog',
  showViewAll = true,
}: ProductSectionProps) {
  return (
    <section className="py-5">
      <div className="container-cg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-wide">{title}</h2>
          {showViewAll && (
            <Link
              to={viewAllLink}
              className="flex items-center gap-1 text-sm font-medium hover:gap-1.5 transition-all"
              style={{ color: '#26C6DA' }}
            >
              Смотреть все
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {books.map((book) => (
            <ProductCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
