import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import FooterSection from './components/FooterSection'
import { Nav } from './components/nav/Nav'
import HeroSlider from './components/HeroSlider'
import Home from './pages/Home'
import ProductOverview from './components/product-overview/ProductOverview';
import CategoryPage from './components/CategoryPage';
import CartPage from './pages/CartPage';
import ProductsPage from './pages/ProductsPage';
import LoginSignup from './LoginSignup';
import { UserProvider } from './UserContext'
import FavoritesPage from './components/favourite/FavouritePage'
import CheckoutSummary from './components/CheckoutSummary';
import OrderConfirmation from './components/OrderConfirmation';

const Layout = () => {
  const location = useLocation();

  return (
    <UserProvider>
      <>
        <Nav />
        {/* Only show HeroSlider on homepage */}
        {location.pathname === "/" && <HeroSlider />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/products/:id" element={<ProductOverview />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/wishlist" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutSummary />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
        <FooterSection />
      </>
    </UserProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
