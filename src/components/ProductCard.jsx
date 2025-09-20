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
    AlertTriangle,
} from "lucide-react";
import FavouriteButton from "./favourite/FavouriteButton";
import Toast, { useToast } from "./favourite/Toast"; // Import Toast components

// ✅ Product Card Component with responsive layouts, Toast notifications, and Stock Badge
const ProductCard = ({ product }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Add toast functionality
    const { toast, showToast, hideToast } = useToast();

    // Stock logic
    const stock = product.stock || 0;
    const isInStock = stock > 0;
    const isLowStock = stock > 0 && stock <= 10;
    const isOutOfStock = stock === 0;


    const addToCart = () => {
        // Check if product is out of stock
        if (isOutOfStock) {
            showToast('Product is out of stock', 'error');
            return;
        }

        setIsAdding(true);

        try {
            // Get current cart from localStorage
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');

            // Check if product already exists in cart
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                // Check if adding one more would exceed stock
                if (existingItem.quantity >= stock) {
                    showToast(`Only ${stock} units available`, 'warning');
                    setIsAdding(false);
                    return;
                }

                // Increase quantity if product exists
                existingItem.quantity += 1;
                showToast(`${product.name} quantity updated in cart`, 'info');
            } else {
                // Add new product to cart with only necessary data (no React objects)
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.main_image_url || product.image,
                    discount_price: product.discount_price,
                    rating: product.rating,
                    stock: product.stock
                });
                showToast(`${product.name} added to cart!`, 'success');
            }

            // Save updated cart back to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Dispatch event to notify navbar (and other components) about the update
            window.dispatchEvent(new Event('cartUpdated'));

        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Failed to add product to cart', 'error');
        }

        // Reset loading state after a short delay
        setTimeout(() => setIsAdding(false), 500);
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

    // Stock Badge Component
    const StockBadge = ({ className = "" }) => {
        if (isOutOfStock) {
            return (
                <span className={`inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300 ${className}`}>
                    <AlertTriangle className="w-3 h-3" />
                    Out of Stock
                </span>
            );
        }

        if (isLowStock) {
            return (
                <span className={`inline-flex items-center gap-1 rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300 ${className}`}>
                    <AlertTriangle className="w-3 h-3" />
                    <span className="hidden xs:inline">Only</span> {stock} left
                </span>
            );
        }

        // Show "In Stock" when stock > 10
        if (stock > 10) {
            return (
                <span className={`inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300 ${className}`}>
                    <BadgeCheck className="w-3 h-3" />
                    In Stock
                </span>
            );
        }

        return null;
    };

    return (
        <>
            {/* Desktop Layout (hidden on mobile) */}
            <div className="hidden sm:block rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative">
                {/* Stock Badge - Desktop (Top Right) */}
                {(isLowStock || isOutOfStock || (stock > 10)) && (
                    <div className="absolute top-2 left-2 z-10">
                        <StockBadge />
                    </div>
                )}

                {/* Image Section */}
                <Link to={`/products/${product.id}`} className="block h-48 w-full mb-3">
                    <div className={`relative h-full ${isOutOfStock ? 'opacity-60' : ''}`}>
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
                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center">
                                <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Product Details */}
                <div className="pt-2">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        {discountPercentage > 0 && (
                            <span className="me-2 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                {discountPercentage}% off
                            </span>
                        )}
                        <div className="flex items-center justify-end gap-1">
                            <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Quick look</span>
                                <Eye className="h-4 w-4" />
                            </button>
                            <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Add to Favorites</span>
                                <FavouriteButton productId={product.id} />
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <Link
                        to={`/products/${product.id}`}
                        className="text-sm font-semibold leading-tight text-gray-900 hover:underline dark:text-white line-clamp-2 mb-2"
                    >
                        {product.name || 'Product Name'}
                    </Link>

                    {/* Rating */}
                    <div className="mb-2 flex items-center gap-1">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    className={`h-3 w-3 ${index < Math.floor(product.rating || 0)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white ml-1">
                            {(product.rating || 0).toFixed(1)}
                        </p>
                    </div>

                    {/* Pricing and Action */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                            {product.discount_price ? (
                                <>
                                    <p className="text-lg font-extrabold leading-tight text-gray-900 dark:text-white">
                                        ₦{product.discount_price.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                        ₦{product.price.toLocaleString()}
                                    </p>
                                </>
                            ) : (
                                <p className="text-lg font-extrabold leading-tight text-gray-900 dark:text-white">
                                    ₦{(product.price || 0).toLocaleString()}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={addToCart}
                            disabled={isAdding || isOutOfStock}
                            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed ${isOutOfStock
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700'
                                }`}
                        >
                            {isAdding ? (
                                'Adding...'
                            ) : isOutOfStock ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <ShoppingCart className="mr-1 h-3 w-3" />
                                    Add
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Layout (shown on mobile only) */}
            <div className="sm:hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 relative">
                <div className="flex gap-3 flex-col w-fit">
                    {/* Image Section */}
                    <div className="relative">
                        <Link to={`/products/${product.id}`} className="flex-shrink-0 w-20 h-20 block">
                            <div className={`relative w-full h-full ${isOutOfStock ? 'opacity-60' : ''}`}>
                                <img
                                    className="w-full h-full object-contain rounded-md"
                                    src={imageError
                                        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjODg4ODg4Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
                                        : product.main_image_url || product.image
                                    }
                                    alt={product.name || 'Product image'}
                                    onError={handleImageError}
                                />
                                {isOutOfStock && (
                                    <div className="absolute inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center rounded-md">
                                        <span className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            Out
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>

                        {/* Stock Badge - Mobile (Top Right of Image) */}
                        {(isLowStock || isOutOfStock || (stock > 10)) && (
                            <div className="absolute -top-1 -right-1">
                                <StockBadge className="text-xs px-1.5 py-0.5" />
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            {/* Title */}
                            <Link
                                to={`/products/${product.id}`}
                                className="text-sm font-semibold text-gray-900 hover:underline dark:text-white line-clamp-2 flex-1 mr-2"
                            >
                                {product.name || 'Product Name'}
                            </Link>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`h-3 w-3 ${index < Math.floor(product.rating || 0)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-xs font-medium text-gray-900 dark:text-white ml-1">
                                {(product.rating || 0).toFixed(1)}
                            </p>

                            {/* Favourite Button */}
                            <button className="flex-shrink-0 rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <FavouriteButton productId={product.id} size={16} />
                            </button>
                        </div>

                        {/* Pricing and Action */}
                        <div className="flex items-center flex-col justify-between">
                            <div className="flex flex-col">
                                {product.discount_price ? (
                                    <>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            ₦{product.discount_price.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                                            ₦{product.price.toLocaleString()}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        ₦{(product.price || 0).toLocaleString()}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={addToCart}
                                disabled={isAdding || isOutOfStock}
                                className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed ${isOutOfStock
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700'
                                    }`}
                            >
                                {isAdding ? (
                                    '...'
                                ) : isOutOfStock ? (
                                    'Out'
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-1 h-3 w-3" />
                                        Add
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Discount Badge */}
                        {discountPercentage > 0 && (
                            <span className="inline-block mt-1 rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                {discountPercentage}% off
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast component - positioned at component level */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={hideToast}
                duration={toast.duration || 3000}
                position="top-right"
            />
        </>
    );
};

// ✅ Skeleton Loader Component (responsive)
export const ProductCardSkeleton = () => {
    return (
        <>
            {/* Desktop Skeleton */}
            <div className="hidden sm:block rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 animate-pulse">
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-md mb-3" />
                <div className="space-y-3">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Mobile Skeleton */}
            <div className="sm:hidden rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 animate-pulse">
                <div className="flex gap-3">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCard;