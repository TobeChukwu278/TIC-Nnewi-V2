import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Trash2,
    ShoppingCart,
    Plus,
    Minus,
    ChevronRight
} from 'lucide-react';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    // Load all products and cart items
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load cart from localStorage
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
                }

                // Fetch all products from API
                const response = await fetch('http://localhost:3001/api/store/updates/products');
                if (response.ok) {
                    const products = await response.json();
                    setAllProducts(products);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        const handleCartUpdate = () => {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
            }
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // Generate suggestions based on cart items
    useEffect(() => {
        if (allProducts.length === 0 || cartItems.length === 0) {
            setSuggestedProducts([]);
            return;
        }

        const generateSuggestions = () => {
            // Get categories from items in cart
            const cartCategories = [...new Set(cartItems.map(item => item.category))];

            // Get brands from items in cart
            const cartBrands = [...new Set(cartItems.map(item => item.brand).filter(Boolean))];

            // Get price range from cart items
            const cartPrices = cartItems.map(item => item.price);
            const minPrice = Math.min(...cartPrices) * 0.7; // 30% lower than cheapest
            const maxPrice = Math.max(...cartPrices) * 1.3; // 30% higher than most expensive

            // Filter products that are relevant to the cart
            const relevantProducts = allProducts.filter(product =>
                product.id && // Ensure product has ID
                !cartItems.some(item => item.id === product.id) && // Not already in cart
                (
                    // Match by category
                    cartCategories.includes(product.category) ||
                    // Match by brand (if available)
                    (product.brand && cartBrands.includes(product.brand)) ||
                    // Match by price range
                    (product.price >= minPrice && product.price <= maxPrice)
                )
            );

            // Sort by relevance (category match first, then price similarity)
            const sortedProducts = relevantProducts.sort((a, b) => {
                const aCategoryMatch = cartCategories.includes(a.category) ? 1 : 0;
                const bCategoryMatch = cartCategories.includes(b.category) ? 1 : 0;

                if (aCategoryMatch !== bCategoryMatch) {
                    return bCategoryMatch - aCategoryMatch;
                }

                // Calculate price similarity to average cart price
                const avgCartPrice = cartPrices.reduce((sum, price) => sum + price, 0) / cartPrices.length;
                const aPriceDiff = Math.abs(a.price - avgCartPrice);
                const bPriceDiff = Math.abs(b.price - avgCartPrice);

                return aPriceDiff - bPriceDiff;
            });

            // Take top 6 suggestions
            return sortedProducts.slice(0, 6);
        };

        const suggestions = generateSuggestions();
        setSuggestedProducts(suggestions);
    }, [cartItems, allProducts]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(id);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const continueShopping = () => {
        navigate('/');
    };

    const proceedToCheckout = () => {
        navigate('/checkout');
    };

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        let updatedCart;

        if (existingItem) {
            updatedCart = cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...cartItems, {
                ...product,
                quantity: 1,
                image: product.main_image_url || product.image
            }];
        }

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const savings = Math.round(subtotal * 0.1); // 10% savings for example
    const storePickup = subtotal > 0 ? 99 : 0;
    const tax = Math.round(subtotal * 0.08); // 8% tax
    const total = subtotal - savings + storePickup + tax;

    const CartItem = ({ item }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                {/* Product Image */}
                <div className="shrink-0 md:order-1">
                    <img
                        src={item.image || item.main_image_url || 'https://via.placeholder.com/80x80?text=No+Image'}
                        alt={item.name}
                        className="h-20 w-20 object-contain rounded-lg"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                    />
                </div>

                {/* Product Info and Actions */}
                <div className="flex-1 min-w-0 md:order-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {item.name}
                    </h3>

                    {item.category && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 capitalize">
                            {item.category}
                        </p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                        <button className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Heart className="w-4 h-4 mr-1.5" />
                            Add to Favorites
                        </button>

                        <button
                            onClick={() => removeItem(item.id)}
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-1.5" />
                            Remove
                        </button>
                    </div>
                </div>

                {/* Quantity and Price */}
                <div className="flex items-center justify-between md:order-3 md:flex-col md:items-end md:gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-3 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="text-end">
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                            ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ₦{item.price.toLocaleString()} each
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const SuggestedProductCard = ({ product }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
            <img
                src={product.main_image_url || product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                alt={product.name}
                className="w-full h-32 object-contain mb-4 rounded-lg"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                }}
            />

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {product.name}
            </h4>

            {product.category && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 capitalize">
                    {product.category}
                </p>
            )}

            <div className="mb-4">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₦{product.price?.toLocaleString()}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Heart className="w-4 h-4" />
                </button>
                <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <section className="bg-white dark:bg-gray-900 py-8 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading cart...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="bg-white dark:bg-gray-900 py-8 md:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center py-16">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Start shopping to add items to your cart
                        </p>
                        <button
                            onClick={continueShopping}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white dark:bg-gray-900 py-8 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                    </h2>
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 dark:text-red-500 text-sm font-medium"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="lg:flex lg:items-start lg:gap-8 xl:gap-12">
                    {/* Cart Items */}
                    <div className="lg:flex-1 lg:max-w-2xl xl:max-w-4xl">
                        <div className="space-y-4 md:space-y-6">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Suggested Products - Desktop */}
                        {suggestedProducts.length > 0 && (
                            <div className="hidden xl:block mt-12">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    Frequently bought together
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {suggestedProducts.map(product => (
                                        <SuggestedProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 lg:mt-0 lg:w-96">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Savings</span>
                                    <span className="font-medium text-green-600">-₦{savings.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="font-medium">₦{storePickup.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="font-medium">₦{tax.toLocaleString()}</span>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-600 my-4" />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>₦{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={proceedToCheckout}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium mt-6 transition-colors"
                            >
                                Proceed to Checkout
                            </button>

                            <div className="text-center mt-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">or</span>
                                <button
                                    onClick={continueShopping}
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 font-medium"
                                >
                                    Continue Shopping
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggested Products - Mobile */}
                {suggestedProducts.length > 0 && (
                    <div className="xl:hidden mt-12">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                            Frequently bought together
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suggestedProducts.map(product => (
                                <SuggestedProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CartPage;