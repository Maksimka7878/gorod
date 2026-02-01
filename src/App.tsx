import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import PromotionsPage from '@/pages/PromotionsPage';
import StoresPage from '@/pages/StoresPage';
import BlogPage from '@/pages/BlogPage';
import LoginPage from '@/pages/LoginPage';
import AdminPage from '@/pages/AdminPage';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sale" element={<CatalogPage />} />
          <Route path="/comics" element={<CatalogPage />} />
          <Route path="/certificates" element={<PromotionsPage />} />
          <Route path="/loyalty" element={<PromotionsPage />} />
          <Route path="/orders" element={<LoginPage />} />
          <Route path="/my-books" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
