import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const FavouriteButton = ({ productId, size = 'medium' }) => {
    const navigate = useNavigate();
    const [isFavourited, setIsFavourited] = useState(false)
    const [loading, setLoading] = useState(false);
    const { isLoggedIn, userEmail } = useUser();

    // Size classes for the button container
    const sizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-10 h-10'
    };

    // Icon sizes based on the button size
    const iconSizes = {
        small: 14,
        medium: 16,
        large: 18
    };

    useEffect(() => {
        // Only check favorite status if we have a valid productId and user is logged in
        if (productId && isLoggedIn && userEmail) {
            checkFavouriteStatus();
        }
    }, [isLoggedIn, userEmail, productId]);

    const checkFavouriteStatus = async () => {
        if (!productId) return;

        try {
            console.log('Checking favourite status for:', { productId, userEmail });
            const response = await fetch(`http://localhost:3001/api/user/auth/favorites/check/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            if (response.ok) {
                const data = await response.json();
                setIsFavourited(data.isFavourited);
                console.log('Favourite status response:', data);
            }
        } catch (error) {
            console.error('Error checking favourite status:', error)
        }
    }

    const toggleFavourite = async () => {
        if (!productId) {
            console.error('No productId provided for favorite toggle');
            return;
        }

        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            if (isFavourited) {
                console.log('Sending POST/DELETE request for favourite:', { productId, userEmail });
                await fetch(`http://localhost:3001/api/user/auth/favorites/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setIsFavourited(false);
            } else {
                await fetch(`http://localhost:3001/api/user/auth/favorites/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setIsFavourited(true);
            }
        } catch (error) {
            console.error('Error toggling favourite:', error);
        } finally {
            setLoading(false);
        }
    }

    // If productId is undefined, show a disabled button
    if (!productId) {
        return (
            <button
                disabled
                className={`
                    ${sizeClasses[size]}
                    flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed
                `}
            >
                <Heart size={iconSizes[size]} />
            </button>
        );
    }

    // If user is not logged in, show a button that redirects to login
    if (!isLoggedIn) {
        return (
            <button
                onClick={() => navigate('/login')}
                className={`
                    ${sizeClasses[size]}
                    flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-400 hover:border-red-300 hover:text-red-400 cursor-pointer transition-all duration-200
                `}
            >
                <Heart size={iconSizes[size]} />
            </button>
        );
    }

    return (
        <button
            onClick={toggleFavourite}
            disabled={loading}
            className={`
                ${sizeClasses[size]}
                flex items-center justify-center rounded-full border transition-all duration-200 
                ${isFavourited
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} 
            `}
        >
            <Heart
                className={isFavourited ? 'fill-current' : ''}
                size={iconSizes[size]}
            />
        </button>
    )
}

export default FavouriteButton