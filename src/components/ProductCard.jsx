import { Link } from "react-router-dom";
import { useState } from "react";
import {
    Eye,
    Heart,
    Truck,
    Star,
    Award,
    BadgeCheck,
    ShoppingCart,
} from "lucide-react";
import FavouriteButton from "./favourite/FavouriteButton";

// ✅ Product Card Component
const ProductCard = ({ product }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);

    console.log('ProductCard product:', product);
    console.log('Product ID:', product?.id);

    const addToCart = () => {
        setIsAdding(true);

        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // Increase quantity if product exists
            existingItem.quantity += 1;
        } else {
            // Add new product to cart with only necessary data (no React objects)
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.main_image_url || product.image,
                discount_price: product.discount_price,
                rating: product.rating
            });
        }

        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Dispatch event to notify navbar (and other components) about the update
        window.dispatchEvent(new Event('cartUpdated'));

        // Reset loading state after a short delay
        setTimeout(() => setIsAdding(false), 500);

        console.log('Product added to cart:', product.name);
    };

    // Handle image error
    const handleImageError = (e) => {
        if (!imageError) {
            setImageError(true);
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4ODg4Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
        }
    };

    // Calculate discount percentage safely
    const discountPercentage = product.discount_price && product.price
        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
        : 0;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Image Section */}
            <Link to={`/products/${product.id}`} className="block h-56 w-full">
                <img
                    className="mx-auto h-full w-full object-contain dark:hidden"
                    src={imageError
                        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4ODg4Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
                        : product.main_image_url || product.image
                    }
                    alt={product.name || 'Product image'}
                    onError={handleImageError}
                />
                <img
                    className="mx-auto hidden h-full w-full object-contain dark:block"
                    src={imageError
                        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNzc3Nzc3Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
                        : product.main_image_url || product.image
                    }
                    alt={product.name || 'Product image'}
                    onError={handleImageError}
                />
            </Link>

            {/* Product Details */}
            <div className="pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    {discountPercentage > 0 && (
                        <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            {discountPercentage}% off
                        </span>
                    )}
                    <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span className="sr-only">Quick look</span>
                            <Eye className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span className="sr-only">Add to Favorites</span>
                            < FavouriteButton productId={product.id} />
                        </button>
                    </div>
                </div>

                {/* Title */}
                <Link
                    to={`/products/${product.id}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white line-clamp-2"
                >
                    {product.name || 'Product Name'}
                </Link>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                className={`h-4 w-4 ${index < Math.floor(product.rating || 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {(product.rating || 0).toFixed(1)}
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        ({product.reviewCount || 0} reviews)
                    </p>
                </div>

                {/* Badges */}
                <ul className="mt-2 flex items-center gap-4">
                    {product.badge && (
                        <li className="flex items-center gap-2">
                            {product.badge === "Fast Delivery" && (
                                <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                            {product.badge === "Best Seller" && (
                                <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                            {product.badge === "Verified" && (
                                <BadgeCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {product.badge}
                            </p>
                        </li>
                    )}
                    <li className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Best Price
                        </p>
                    </li>
                </ul>

                {/* Pricing and Action */}
                <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        {product.discount_price ? (
                            <>
                                <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                                    ₦{product.discount_price.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                    ₦{product.price.toLocaleString()}
                                </p>
                            </>
                        ) : (
                            <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                                ₦{(product.price || 0).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={addToCart}
                        disabled={isAdding}
                        className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isAdding ? (
                            'Adding...'
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ✅ Skeleton Loader Component
export const ProductCardSkeleton = () => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 animate-pulse">
            {/* Image Skeleton */}
            <div className="h-56 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />

            <div className="pt-6 space-y-4">
                {/* Title Skeleton */}
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />

                {/* Rating Skeleton */}
                <div className="flex items-center gap-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>

                {/* Badge Skeleton */}
                <div className="flex gap-4">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>

                {/* Price & Button Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default ProductCard;