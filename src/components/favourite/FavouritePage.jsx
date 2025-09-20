import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, userEmail } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && userEmail) {
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, userEmail]);

    const fetchFavorites = async () => {

        const token = localStorage.getItem('authToken');
        console.log('Token:', token ? 'exists' : 'missing');
        console.log('trying to fetch favorites....');
        try {
            const response = await fetch('https://backend-production-7f80.up.railway.app/api/user/auth/favorites', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            console.log('response:', response);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('data:', data);
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId) => {
        try {
            const response = await fetch(`https://backend-production-7f80.up.railway.app/api/user/auth/favorites/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                setFavorites(favorites.filter(item => item.id !== productId));
            } else {
                console.error('Failed to remove favorite');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    // const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // const showToast = (message, type = 'success') => {
    //     setToast({ show: true, message, type });
    // };

    // const hideToast = () => {
    //     setToast({ show: false, message: '', type: 'success' });
    // };

    const addToCart = (product) => {
        // Your existing add to cart logic
        console.log('Add to cart:', product);

        // Example implementation:
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image_url
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        <Toast message="Added to cart!" type="success" isVisible={true} onClose={() => { }} duration={2000} />
    };

    if (!isLoggedIn) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
                <p className="text-gray-600 mb-4">You need to be logged in to view your favorites.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading favorites...</p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
                <p className="text-gray-600 mb-4">Start adding products to your wishlist!</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg cursor-pointer"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Favorites</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                            <img
                                src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <button
                                onClick={() => removeFavorite(product.id)}
                                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{product.category}</p>
                            <p className="text-green-600 font-bold text-lg mb-4">₦{product.price}</p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => addToCart(product)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;