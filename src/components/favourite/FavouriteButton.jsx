import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';


const FavouriteButton = ({ productId, size = 'medium' }) => {

    const [isFavourited, setIsFavourited] = useState(false)
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-10 h-10',
        large: 'w-12 h-12'
    };

    useEffect(() => {
        if (user) {
            checkFavouriteStatus();
        }
    }, [user, productId]);

    const checkFavouriteStatus = async () => {
        try {
            const response = await fetch(`/api/user/auth/favourites/check/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json();
            setIsFavourited(data.isFavourited);
        } catch (error) {
            console.error('Error checking favourite status:', error)
        }
    }

    const toggleFavourite = async () => {
        if (!user) {
            alert('Please login to add to favourite');
            return;
        }

        setLoading(true)

        try {
            if (isFavourited) {
                await fetch(`/api/user/auth/favourites/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setIsFavourited(false)
            } else {
                await fetch(`/api/user/auth/favourites/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setIsFavourited(true)
            }
        } catch (error) {
            console.error('Error adding to favourite:', error);
        }
        setLoading(false);
    }

    return (
        <button
            onClick={toggleFavourite}
            disabled={loading}
            className={`
    ${sizeClasses[size]}
    flex items-center jsutify-center rounded-full border transition-all duration-200 ${isFavourited ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-300 text-gary-400 hover:border-red-300 hover:text-red-400'}
    ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} `} >
            <Heart className={isFavourited ? 'fill-current' : ''} size={size === 'small' ? 16 : 20} />
        </button>
    )
}

export default FavouriteButton