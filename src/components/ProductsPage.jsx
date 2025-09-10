// SimpleProductsPage.jsx - Basic version without filters
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

const SimpleProductsPage = ({ category, title }) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://backend-production-7f80.up.railway.app/api/store/updates/products');
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                let filtered = data;

                if (category === "featured") {
                    filtered = filtered.filter(product => product.featured);
                } else if (category === "latestaddition") {
                    filtered = filtered.sort((a, b) =>
                        new Date(b.created_at || b.date_added) - new Date(a.created_at || a.date_added)
                    );
                } else if (category === "bestsellers") {
                    filtered = filtered.filter(product => product.rating >= 4)
                        .sort((a, b) => b.rating - a.rating);
                } else if (category === "bestselling") {
                    filtered = filtered.filter(product => product.popular || product.sales_count > 10);
                }

                setProducts(filtered);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>

                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">😢</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No products found
                        </h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleProductsPage;