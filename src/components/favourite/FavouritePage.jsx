import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const response = await fetch('/api/user/auth/favorites', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
        setLoading(false);
    };

    const removeFavorite = async (productId) => {
        try {
            await fetch(`/api/favorites/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFavorites(favorites.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const addToCart = (product) => {
        // Your existing add to cart logic
        console.log('Add to cart:', product);
    };

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
                <p className="text-gray-600">You need to be logged in to view your favorites.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center p-8">Loading favorites...</div>;
    }

    if (favorites.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
                <p className="text-gray-600">Start adding products to your wishlist!</p>
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
                                src={product.image_url}
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
                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{product.category}</p>
                            <p className="text-green-600 font-bold text-lg mb-4">${product.price}</p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => addToCart(product)}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
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