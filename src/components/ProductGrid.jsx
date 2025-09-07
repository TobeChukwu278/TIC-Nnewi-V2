import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { ChevronRight, Star, Zap, Clock, Award } from "lucide-react";

export default function ProductsGrid() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

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
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Categorize products
    const featuredProducts = products
        .filter(product => product.featured)
        .slice(0, 8);

    const newArrivals = products
        .sort((a, b) => new Date(b.created_at || b.date_added) - new Date(a.created_at || a.date_added))
        .slice(0, 8);

    const bestSellers = products
        .filter(product => product.rating >= 4)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);

    const trendingProducts = products
        .filter(product => product.popular || product.sales_count > 10)
        .slice(0, 8);

    const SectionHeader = ({ title, icon: Icon, viewAllLink, description }) => (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {viewAllLink && (
                <Link
                    to={viewAllLink}
                    className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium"
                >
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            )}
        </div>
    );

    const ProductGrid = ({ products, loading, skeletonCount = 4 }) => (
        <div className=" flex flex-col sm:grid sm:grid-cols-2 md:grid  md:grid-cols-3 lg:grid lg:grid-cols-4 gap-4 sm:gap-6">
            {loading
                ? Array.from({ length: skeletonCount }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))
                : products.map((product) => (
                    <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="block transition-transform hover:scale-105 duration-200"
                    >
                        <ProductCard product={product} />
                    </Link>
                ))
            }
        </div>
    );

    if (loading) {
        return (
            <section className="px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="px-4 sm:px-6 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <span className="text-red-600 dark:text-red-400 font-bold">Error:</span>
                        <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
                {/* Featured Products */}
                <div>
                    <SectionHeader
                        title="Featured Products"
                        icon={Star}
                        viewAllLink="/featured"
                        description="Handpicked selection of our best products"
                    />
                    <ProductGrid
                        products={featuredProducts}
                        loading={loading}
                        skeletonCount={4}
                    />
                </div>

                {/* New Arrivals */}
                <div>
                    <SectionHeader
                        title="New Arrivals"
                        icon={Clock}
                        viewAllLink="/new-arrivals"
                        description="Discover our latest additions"
                    />
                    <ProductGrid
                        products={newArrivals}
                        loading={loading}
                        skeletonCount={4}
                    />
                </div>

                {/* Best Sellers */}
                <div>
                    <SectionHeader
                        title="Best Sellers"
                        icon={Award}
                        viewAllLink="/best-sellers"
                        description="Customer favorites with top ratings"
                    />
                    <ProductGrid
                        products={bestSellers}
                        loading={loading}
                        skeletonCount={4}
                    />
                </div>

                {/* Trending Now */}
                <div>
                    <SectionHeader
                        title="Trending Now"
                        icon={Zap}
                        viewAllLink="/trending"
                        description="What everyone is buying right now"
                    />
                    <ProductGrid
                        products={trendingProducts}
                        loading={loading}
                        skeletonCount={4}
                    />
                </div>

                {/* All Products */}
                <div>
                    <SectionHeader
                        title="All Products"
                        viewAllLink="/products"
                        description="Browse our complete collection"
                    />
                    <ProductGrid
                        products={products.slice(0, 8)}
                        loading={loading}
                        skeletonCount={8}
                    />

                    {products.length > 8 && (
                        <div className="text-center mt-8">
                            <Link
                                to="/products"
                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                View All Products
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
