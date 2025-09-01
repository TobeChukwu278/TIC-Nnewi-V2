import { Link } from "react-router-dom";
import {
    Eye,
    Heart,
    Truck,
    Star,
    Award,
    BadgeCheck,
    ShoppingCart,
} from "lucide-react";

// ✅ Product Card Component
const ProductCard = ({ product }) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Image Section (wrapped in link) */}
            <Link to={`/products/${product.id}`} className="block h-56 w-full">
                <img
                    className="mx-auto h-full dark:hidden"
                    src={product.main_image_url ? product.main_image_url : 'No image yet'}
                    alt={product.title ? product.title : 'No title yet'}
                />
                <img
                    className="mx-auto hidden h-full dark:block"
                    src={product.main_image_url ? product.main_image_url : 'No image yet'}
                    alt={product.title ? product.title : 'No title yet'}
                />
            </Link>

            {/* Product Details */}
            <div className="pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    {product.discount_price ? product.discount_price && (
                        <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            Up to {((product.price - product.discount_price) / product.price) * 100}% off
                        </span>
                    ) : 'No discount yet'}
                    <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span className="sr-only">Quick look</span>
                            <Eye className="h-5 w-5" />
                        </button>
                        <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span className="sr-only">Add to Favorites</span>
                            <Heart className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Title (wrapped in link) */}
                <a
                    href={`/products/${product.id}`}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                >
                    {product.name ? product.name : 'name'}
                </a>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={index}
                                className="h-4 w-4 text-yellow-400 fill-yellow-400"
                            />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.rating ? product.rating.toFixed(2) : "0.00"}
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        ({product.reviewCount ? product.reviewCount : 'No reviews yet'})
                    </p>
                </div>

                {/* Badges */}
                <ul className="mt-2 flex items-center gap-4">
                    {product.badge && (
                        <li className="flex items-center gap-2">
                            {product.badge ? product.badge === "Fast Delivery" && (
                                <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            ) : 'no badge yet'}
                            {product.badge ? product.badge === "Best Seller" && (
                                <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            ) : 'no badge yet'}
                            {product.badge ? product.badge === "Verified" && (
                                <BadgeCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            ) : 'no badge yet'}
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                {product.badge ? product.badge : 'no badge yet'}
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
                    <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                        ₦{product.price ? product.price : 'No set price yet'}
                    </p>
                    <button className="inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-700">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to cart
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
