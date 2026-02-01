import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import ProductSection from '@/components/ProductSection';
import { newBooks, bestBooks, exclusiveBooks, comingSoonBooks } from '@/data/books';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Slider with Side Cards */}
        <HeroSlider />

        {/* New Books Section */}
        <ProductSection
          title="НОВИНКИ ЛИТЕРАТУРЫ"
          books={newBooks}
          viewAllLink="/catalog?section=new"
        />

        {/* Best Books Section */}
        <ProductSection
          title="ЛУЧШИЕ ИЗ ЛУЧШИХ"
          books={bestBooks}
          viewAllLink="/catalog?section=best"
        />

        {/* Exclusive Books Section */}
        <ProductSection
          title="ЭКСКЛЮЗИВНО В ЧИТАЙ-ГОРОДЕ"
          books={exclusiveBooks}
          viewAllLink="/catalog?section=exclusive"
        />

        {/* Coming Soon Section */}
        <ProductSection
          title="СКОРО В ПРОДАЖЕ"
          books={comingSoonBooks}
          viewAllLink="/catalog?section=coming-soon"
        />
      </main>

      <Footer />
    </div>
  );
}
