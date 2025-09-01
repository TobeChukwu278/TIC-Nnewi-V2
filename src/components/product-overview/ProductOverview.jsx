import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, ArrowRight, ArrowLeft, X } from "lucide-react";
import { useState, useEffect } from "react";
import ProductOverviewSkeleton from "./ProductOverviewSkeleton";

const ProductOverview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // Handle back navigation
    const handleGoBack = () => {
        navigate(-1);
    };

    // Handle add to cart - FIXED VERSION
    const addToCart = () => {
        if (!product) return;

        setIsAdding(true);

        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // Increase quantity if product exists
            existingItem.quantity += 1;
        } else {
            // Add new product to cart with only simple data
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.main_image_url,
                category: product.category,
                // Only include simple data types, no React objects
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

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all products
                const response = await fetch('http://localhost:3001/api/store/updates/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const allProducts = await response.json();

                // Find the current product
                const foundProduct = allProducts.find((p) => p.id === Number(id));
                if (!foundProduct) {
                    throw new Error('Product not found');
                }
                setProduct(foundProduct);

                // Find similar products (same category)
                const similar = allProducts
                    .filter(p => p.id !== foundProduct.id && p.category === foundProduct.category)
                    .slice(0, 4);
                setSimilarProducts(similar);

                // Find suggested products (different category or popular items)
                const suggested = allProducts
                    .filter(p => p.id !== foundProduct.id && p.category !== foundProduct.category)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 4);
                setSuggestedProducts(suggested);

            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    if (loading) return <ProductOverviewSkeleton />;

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500 text-lg px-4">
                <span className="text-red-500 font-bold">Error:</span> {error}
            </div>
        );
    }

    if (!product) return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <p className="text-center text-lg">Product not found</p>
        </div>
    );

    const ProductCard = ({ product }) => {
        const [isAddingCard, setIsAddingCard] = useState(false);

        const handleAddToCart = () => {
            setIsAddingCard(true);

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
                    image: product.main_image_url,
                    category: product.category,
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));

            setTimeout(() => setIsAddingCard(false), 500);
        };

        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <Link to={`/product/${product.id}`} className="block flex-shrink-0">
                    <div className="relative pt-[75%]">
                        <img
                            src={product.main_image_url || 'https://via.placeholder.com/300x225?text=No+Image'}
                            alt={product.name}
                            className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/300x225?text=No+Image';
                            }}
                        />
                    </div>
                </Link>
                <div className="p-4 flex flex-col flex-grow">
                    <Link to={`/product/${product.id}`} className="block">
                        <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.round(product.rating || 0)
                                    ? "text-yellow-300 fill-yellow-300"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-gray-500">
                            ({product.rating ? product.rating.toFixed(1) : 'N/A'})
                        </span>
                    </div>
                    <p className="text-green-600 font-bold text-lg mb-3 mt-auto">₦{product.price?.toLocaleString()}</p>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAddingCard}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition-colors flex items-center justify-center disabled:opacity-50"
                        >
                            {isAddingCard ? (
                                'Adding...'
                            ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                    <span className="hidden xs:inline">Add to Cart</span>
                                    <span className="xs:hidden">Add</span>
                                </>
                            )}
                        </button>
                        <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center justify-center">
                            <Heart className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-4 md:py-8 lg:py-16 bg-white dark:bg-gray-900 antialiased relative">
            {/* Top Navigation Back Button */}
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 mb-4 md:mb-6">
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm md:text-base">Back to Previous</span>
                </button>
            </div>

            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                {/* Product Details */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16 mb-8 md:mb-16">
                    {/* Image - Mobile first design */}
                    <div className="mb-6 md:mb-0 relative">
                        {/* Mobile Close Button (Floating) */}
                        <button
                            onClick={handleGoBack}
                            className="md:hidden absolute -top-2 -left-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="max-w-md mx-auto lg:max-w-lg">
                            <div className="relative pt-[100%] md:pt-[75%]">
                                <img
                                    className="absolute top-0 left-0 w-full h-full object-contain rounded-lg shadow-md"
                                    src={product.main_image_url || 'https://via.placeholder.com/500x500?text=No+Image'}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <h1 className="text-xl font-semibold sm:text-2xl lg:text-3xl dark:text-white leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1">
                                {product.category || 'Uncategorized'}
                            </p>
                        </div>

                        <p className="text-2xl font-extrabold sm:text-3xl lg:text-4xl dark:text-white">
                            ₦{product.price?.toLocaleString()}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 md:w-6 md:h-6 ${i < Math.round(product.rating || 0)
                                        ? "text-yellow-300 fill-yellow-300"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                            <span className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                                ({product.rating ? product.rating.toFixed(1) : 'No ratings yet'})
                            </span>
                        </div>

                        {/* Actions - Stack on mobile, row on larger screens */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button className="flex items-center justify-center px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors flex-1">
                                <Heart className="w-5 h-5 mr-2" />
                                <span className="whitespace-nowrap">Add to favorites</span>
                            </button>
                            <button
                                onClick={addToCart}
                                disabled={isAdding}
                                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAdding ? (
                                    'Adding...'
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        <span className="whitespace-nowrap">Add to cart</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Description */}
                        <hr className="my-4 md:my-6 border-gray-200 dark:border-gray-800" />
                        <div>
                            <h3 className="font-semibold text-lg mb-2 dark:text-white">Description</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                                {product.description || 'No description available for this product.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                {similarProducts.length > 0 && (
                    <div className="mb-8 md:mb-16">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
                            <h2 className="text-xl md:text-2xl font-bold dark:text-white">Similar Products</h2>
                            <Link
                                to={`/category/${product.category}`}
                                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm md:text-base"
                            >
                                View all in {product.category}
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {similarProducts.map((similarProduct) => (
                                <ProductCard key={similarProduct.id} product={similarProduct} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggested Products Section */}
                {suggestedProducts.length > 0 && (
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 dark:text-white">You Might Also Like</h2>
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {suggestedProducts.map((suggestedProduct) => (
                                <ProductCard key={suggestedProduct.id} product={suggestedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Back Button for Mobile */}
            <button
                onClick={handleGoBack}
                className="fixed md:hidden bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-full p-3 shadow-2xl hover:shadow-3xl transition-all border border-gray-200 dark:border-gray-700"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
        </section>
    );
};

export default ProductOverview;