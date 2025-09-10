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
import OrderTracking from './components/OrderTracking';
import OrderList from './components/OrderList';
import AccountOverview from './components/AccountOverview'
import Land from './Land/Land';
import SimpleProductsPage from './components/ProductsPage'

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAboutPage = location.pathname === "/about";

  return (
    <UserProvider>
      <>
        {/* Hide Nav on About page */}
        {!isAboutPage && <Nav />}

        {/* Only show HeroSlider on homepage */}
        {isHomePage && <HeroSlider />}

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
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/my-orders" element={<OrderList />} />
          <Route path="/my-account" element={<AccountOverview />} />
          <Route path="/about" element={<Land />} />
          <Route path="/featured" element={<ProductsPage category="featured" title="Featured Products" />} />
          <Route path="/latest-additions" element={<ProductsPage category="latest" title="Latest Additions" />} />
          <Route path="/best-sellers" element={<ProductsPage category="bestsellers" title="Best Sellers" />} />
          <Route path="/best-selling" element={<ProductsPage category="bestselling" title="Best Selling Products" />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
        {/* <SimpleProductsPage /> */}
        {/* Hide Footer on About page */}
        {!isAboutPage && <FooterSection />}
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