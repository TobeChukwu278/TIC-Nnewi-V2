import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import FooterSection from './components/FooterSection'
import { Nav } from './components/nav/Nav'
import HeroSlider from './components/HeroSlider'
import Home from './pages/Home'
import ProductOverview from './components/product-overview/ProductOverview';
import CategoryPage from './components/CategoryPage';
import CartPage from './pages/CartPage';

const Layout = () => {
  const location = useLocation();

  return (
    <>
      <Nav />
      {/* Only show HeroSlider on homepage */}
      {location.pathname === "/" && <HeroSlider />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/products/:id" element={<ProductOverview />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <FooterSection />
    </>
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
