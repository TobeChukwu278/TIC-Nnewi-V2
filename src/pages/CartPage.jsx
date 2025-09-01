import React, { useState } from 'react';
import {
    Heart,
    Trash2,
    ShoppingCart,
    ArrowRight,
    Plus,
    Minus,
    ChevronRight
} from 'lucide-react';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3, 24\" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, Keyboard layout INT",
            price: 1499,
            quantity: 2,
            image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
            darkImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
        },
        {
            id: 2,
            name: "Restored Apple Watch Series 8 (GPS) 41mm Midnight Aluminum Case with Midnight Sport Band",
            price: 598,
            quantity: 1,
            image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg",
            darkImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg"
        },
        {
            id: 3,
            name: "Apple - MacBook Pro 16\" Laptop, M3 Pro chip, 36GB Memory, 18-core GPU, 512GB SSD, Space Black",
            price: 1799,
            quantity: 1,
            image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-light.svg",
            darkImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-dark.svg"
        }
    ]);

    const suggestedProducts = [
        {
            id: 4,
            name: "iMac 27”",
            price: 299,
            originalPrice: 399.99,
            image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
            darkImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg",
            description: "This generation has some improvements, including a longer continuous battery life."
        },
        {
            id: 5,
            name: "Playstation 5",
            price: 499,
            originalPrice: 799.99,
            image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg",
            darkImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg",
            description: "Next-gen gaming console with immersive gameplay experience."
        },
        {
            id: 6,
            name: "Apple Watch Series 8",
            price: 1199,
            originalPrice: 1799.99,
            image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg",
            darkImage: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg",
            description: "Advanced health features and always-on Retina display."
        }
    ];

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(id);
            return;
        }
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const savings = 299;
    const storePickup = 99;
    const tax = 799;
    const total = subtotal - savings + storePickup + tax;

    const CartItem = ({ item }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                {/* Product Image */}
                <div className="shrink-0 md:order-1">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 object-contain dark:hidden"
                    />
                    <img
                        src={item.darkImage}
                        alt={item.name}
                        className="h-20 w-20 object-contain hidden dark:block"
                    />
                </div>

                {/* Product Info and Actions */}
                <div className="flex-1 min-w-0 md:order-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                        {item.name}
                    </h3>

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
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ${item.price} each
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const SuggestedProductCard = ({ product }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-contain dark:hidden mb-4"
            />
            <img
                src={product.darkImage}
                alt={product.name}
                className="w-full h-32 object-contain hidden dark:block mb-4"
            />

            <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                {product.name}
            </h4>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                {product.description}
            </p>

            <div className="mb-4">
                {product.originalPrice && (
                    <p className="text-lg font-bold text-gray-900 dark:text-white line-through">
                        ${product.originalPrice}
                    </p>
                )}
                <p className="text-lg font-bold text-red-600 dark:text-red-500">
                    ${product.price}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Heart className="w-4 h-4" />
                </button>
                <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                </button>
            </div>
        </div>
    );

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
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
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
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 md:mb-8">
                    Shopping Cart
                </h2>

                <div className="lg:flex lg:items-start lg:gap-8 xl:gap-12">
                    {/* Cart Items */}
                    <div className="lg:flex-1 lg:max-w-2xl xl:max-w-4xl">
                        <div className="space-y-4 md:space-y-6">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Suggested Products - Desktop */}
                        <div className="hidden xl:block mt-8">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                People also bought
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {suggestedProducts.map(product => (
                                    <SuggestedProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 lg:mt-0 lg:w-96">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                Order Summary
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Savings</span>
                                    <span className="font-medium text-green-600">-${savings.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Store Pickup</span>
                                    <span className="font-medium">${storePickup.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-600 my-4" />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium mt-6 transition-colors">
                                Proceed to Checkout
                            </button>

                            <div className="text-center mt-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">or</span>
                                <button className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 font-medium">
                                    Continue Shopping
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>

                            {/* Voucher Form */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                                <form className="space-y-3">
                                    <label htmlFor="voucher" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Gift card or discount code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="voucher"
                                            placeholder="Enter code"
                                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggested Products - Mobile */}
                <div className="xl:hidden mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        You might also like
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestedProducts.map(product => (
                            <SuggestedProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartPage;