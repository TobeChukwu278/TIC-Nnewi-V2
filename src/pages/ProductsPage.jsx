import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import {
    ChevronLeft,
    Filter,
    Grid,
    List,
    Search,
    X,
    ChevronDown,
    ChevronUp
} from "lucide-react";

const ProductsPage = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [ratingFilter, setRatingFilter] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20); // Number of products to show per page

    const navigate = useNavigate();
    const location = useLocation();

    function OptimizedImage({ src, width = 600, quality = 75, alt, className }) {
        const optimizedSrc = `/_vercel/image ? url = ${encodeURIComponent(src)
            }& w=${width}& q=${quality}`;
        return <img src={optimizedSrc} alt={alt} className={className} loading="lazy" />;
    }

    // Function to normalize category names
    const normalizeCategory = (category) => {
        if (!category) return '';

        return category
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '');
    };

    // Extract category from URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://backend-production-7f80.up.railway.app/api/store/updates/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();

                // Add normalized category to each product
                const productsWithNormalizedCategory = data.map(product => ({
                    ...product,
                    normalizedCategory: normalizeCategory(product.category)
                }));

                setProducts(productsWithNormalizedCategory);
                setFilteredProducts(productsWithNormalizedCategory);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            const categoryMap = new Map();

            products.forEach(product => {
                if (product.category) {
                    const normalized = normalizeCategory(product.category);
                    if (!categoryMap.has(normalized)) {
                        categoryMap.set(normalized, {
                            original: product.category,
                            count: 0,
                            products: []
                        });
                    }
                    const categoryData = categoryMap.get(normalized);
                    categoryData.count++;
                    categoryData.products.push(product.name);
                }
            });

            // Log all categories with counts
            categoryMap.forEach((data, normalized) => {
                console.log(`Category: "${data.original}" → Normalized: "${normalized}" → Count: ${data.count}`);
                if (data.count <= 3) { // Show product names for small categories
                    console.log(`  Products: ${data.products.join(', ')}`);
                }
            });
        }
    }, [products]);

    // Get unique normalized categories with display names
    const categories = React.useMemo(() => {
        const categoryCounts = new Map();
        const categoryDisplayNames = new Map();

        // Count products per category and store display names
        products.forEach(product => {
            if (product.category) {
                // USE THE PRE-NORMALIZED CATEGORY, NOT RE-NORMALIZING
                const normalized = product.normalizedCategory; // This is the key fix!
                const displayName = product.category;

                // Store the most common display name for this normalized category
                if (!categoryDisplayNames.has(normalized)) {
                    categoryDisplayNames.set(normalized, displayName);
                }

                // Count products in this category
                categoryCounts.set(normalized, (categoryCounts.get(normalized) || 0) + 1);
            }
        });

        // Convert to array with counts
        return [
            {
                normalized: "all",
                display: "All Categories",
                count: products.length
            },
            ...Array.from(categoryCounts.entries()).map(([normalized, count]) => ({
                normalized,
                display: categoryDisplayNames.get(normalized) || normalized,
                count
            }))
        ];
    }, [products]);


    // Filter products based on selected criteria
    useEffect(() => {
        let filtered = products;

        // Filter by category using normalized comparison
        if (selectedCategory !== "all") {
            const normalizedSelected = normalizeCategory(selectedCategory);

            filtered = filtered.filter(product => {
                // USE THE PRE-NORMALIZED CATEGORY
                const productNormalized = product.normalizedCategory;
                return productNormalized === normalizedSelected;
            });
        }



        // Filter by search query
        if (searchQuery) {
            const normalizedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(normalizedQuery) ||
                product.description?.toLowerCase().includes(normalizedQuery) ||
                product.category?.toLowerCase().includes(normalizedQuery) ||
                product.normalizedCategory?.includes(normalizedQuery.replace(/\s+/g, '-'))
            );
        }

        // Filter by price range
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Filter by rating
        if (ratingFilter > 0) {
            filtered = filtered.filter(product =>
                product.rating >= ratingFilter
            );
        }

        // Sort products
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                break;
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [products, selectedCategory, sortBy, searchQuery, priceRange, ratingFilter]);



    // Update displayed products based on current page
    useEffect(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        setDisplayedProducts(filteredProducts.slice(0, endIndex));
    }, [filteredProducts, currentPage, productsPerPage]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        const params = new URLSearchParams();
        if (category !== "all") {
            params.set('category', category);
        }
        navigate({ search: params.toString() });
    };

    const clearFilters = () => {
        setSelectedCategory("all");
        setSearchQuery("");
        setPriceRange([0, 100000]);
        setRatingFilter(0);
        navigate({ search: '' });
    };

    const loadMoreProducts = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const ProductGridView = () => (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {displayedProducts.map((product) => (
                <div key={product.id} className="min-w-0">
                    <Link
                        to={`/products/${product.id}`}
                        className="block transition-transform hover:scale-105 duration-200"
                    >
                        <ProductCard product={product} />
                    </Link>
                </div>
            ))}
        </div>
    );

    const ProductListView = () => (
        <div className="space-y-4">
            {displayedProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                    <Link to={`/products/${product.id}`} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                            <OptimizedImage
                                src={product.main_image_url || 'https://via.placeholder.com/120x120?text=No+Image'}
                                alt={product.name}
                                className="w-full sm:w-24 h-24 object-contain rounded-lg"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
                            {product.category && (
                                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full mb-2 capitalize">
                                    {product.category}
                                </span>
                            )}
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                                {product.description}
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-green-600 font-bold text-lg">₦{product.price?.toLocaleString()}</span>
                                {product.rating && (
                                    <span className="flex items-center text-sm text-gray-500">
                                        ⭐ {product.rating}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );

    const FilterSection = ({ title, children, isOpen = true }) => {
        const [open, setOpen] = useState(isOpen);

        return (
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white py-2"
                >
                    {title}
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {open && <div className="mt-2 space-y-2">{children}</div>}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Sidebar Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                <div className="space-y-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Skeleton */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const hasMoreProducts = displayedProducts.length < filteredProducts.length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedCategory === "all"
                                ? "All Products"
                                : categories.find(cat => cat.normalized === selectedCategory)?.display || selectedCategory
                            }
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Showing {displayedProducts.length} of {filteredProducts.length} products
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>

                        {/* View Toggle */}
                        <div className="flex bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 ${viewMode === "grid" ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 ${viewMode === "list" ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="newest">Newest First</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Sidebar Filters - Desktop */}
                    <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-gray-900 dark:text-white">Categories</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Clear all
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Categories Filter */}
                                <FilterSection title="Categories">
                                    {categories.map((category) => (
                                        <label key={category.normalized} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category.normalized}
                                                checked={selectedCategory === category.normalized}
                                                onChange={() => handleCategoryChange(category.normalized)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                {category.display}
                                            </span>
                                            {/* <span className="text-xs text-gray-400">
                                                ({products.filter(p => p.normalizedCategory === category.normalized).length})
                                            </span> */}
                                            <span className="text-xs text-gray-400">
                                                ({categories.find(cat => cat.normalized === category.normalized)?.count || 0})
                                            </span>
                                        </label>
                                    ))}
                                </FilterSection>

                                {/* Price Filter */}
                                <FilterSection title="Price Range">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>₦{priceRange[0].toLocaleString()}</span>
                                            <span>₦{priceRange[1].toLocaleString()}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100000"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </FilterSection>

                                {/* Rating Filter */}
                                <FilterSection title="Rating">
                                    {[4, 3, 2, 1].map((rating) => (
                                        <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={rating}
                                                checked={ratingFilter === rating}
                                                onChange={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                                                        ⭐
                                                    </span>
                                                ))}
                                                {` & Up`}
                                            </span>
                                        </label>
                                    ))}
                                </FilterSection>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {displayedProducts.length === 0 ? (
                            <div className="text-center py-12 md:py-16">
                                <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">😢</div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Try adjusting your filters or search terms
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : viewMode === "grid" ? (
                            <ProductGridView />
                        ) : (
                            <ProductListView />
                        )}

                        {/* Load More Button */}
                        {hasMoreProducts && (
                            <div className="text-center mt-6 md:mt-8">
                                <button
                                    onClick={loadMoreProducts}
                                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm md:text-base transition-colors"
                                >
                                    Load More Products ({filteredProducts.length - displayedProducts.length} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;