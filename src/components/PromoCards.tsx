import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { promoCards } from '@/data/books';
import OptimizedImage from './OptimizedImage';

export default function PromoCards() {
  return (
    <section className="py-6">
      <div className="container-cg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {promoCards.map((card) => (
            <Link
              key={card.id}
              to={card.link}
              className={`group relative h-[200px] md:h-[240px] rounded-2xl overflow-hidden ${card.bgColor} p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/30" />
                <div className="absolute bottom-8 right-12 w-16 h-16 rounded-full bg-white/20" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight max-w-[200px]">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {card.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <div className="relative z-10 flex items-center gap-2 text-[#E31E24] font-medium group-hover:gap-3 transition-all">
                <span>Перейти</span>
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Decorative Image */}
              <div className="absolute right-0 bottom-0 w-32 h-32 md:w-40 md:h-40">
                <OptimizedImage
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover rounded-tl-3xl opacity-80 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
