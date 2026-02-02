import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { banners } from '@/data/books';
import OptimizedImage from './OptimizedImage';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section
      className="relative w-full py-4"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container-cg">
        <div className="flex gap-4">
          {/* Main Slider - Left */}
          <div className="flex-1 relative h-[300px] md:h-[360px] lg:h-[400px] rounded-xl overflow-hidden">
            {/* Slides */}
            <div
              className="flex transition-transform duration-500 ease-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="min-w-full h-full relative"
                >
                  <OptimizedImage
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    priority={parseInt(banner.id) === 1} // Prioritize first banner
                  />
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 max-w-sm leading-tight">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-sm md:text-base text-gray-700 mb-4 max-w-xs">
                        {banner.subtitle}
                      </p>
                    )}
                    <Link
                      to={banner.link}
                      className="w-fit px-5 py-2 rounded-lg font-medium text-sm transition-colors hover:opacity-90 inline-block"
                      style={{ backgroundColor: '#E0F7FA', color: '#1A1A1A' }}
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-all z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${index === currentSlide
                    ? 'w-5 bg-[#26C6DA]'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Side Cards - Right */}
          <div className="hidden lg:flex flex-col gap-3 w-[280px]">
            {/* Card 1 - Hits 2025 */}
            <Link
              to="/catalog?section=new"
              className="flex-1 rounded-xl overflow-hidden relative cursor-pointer group p-4"
              style={{ backgroundColor: '#FFF8E1' }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    100 главных хитов 2025 года
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Не проходите мимо</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium mt-2" style={{ color: '#26C6DA' }}>
                  <span>Перейти</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              <div className="absolute right-3 bottom-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C62828' }}>
                <span className="text-white text-lg">📚</span>
              </div>
            </Link>

            {/* Card 2 - Gifts */}
            <Link
              to="/catalog?category=3"
              className="flex-1 rounded-xl overflow-hidden relative cursor-pointer group p-4"
              style={{ backgroundColor: '#FCE4EC' }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    Гид по подаркам
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Останется только упаковать</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium mt-2" style={{ color: '#26C6DA' }}>
                  <span>Перейти</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              <div className="absolute right-3 bottom-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C62828' }}>
                <span className="text-white text-lg">🎁</span>
              </div>
            </Link>

            {/* Card 3 - Board Games */}
            <Link
              to="/catalog?category=4"
              className="flex-1 rounded-xl overflow-hidden relative cursor-pointer group p-4"
              style={{ backgroundColor: '#E0F7FA' }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    Настольный клуб
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">От «Имаджинариума» до «Мафии»</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium mt-2" style={{ color: '#26C6DA' }}>
                  <span>Перейти</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
              <div className="absolute right-3 bottom-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00838F' }}>
                <span className="text-white text-lg">🎲</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
