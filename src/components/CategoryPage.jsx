import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";

// Category-specific hero banners
const heroBanners = {
    "food-processing": "/banners/agro.jpg",
    "medicals": "/banners/cosmetics.jpg",
    "engineering-fabrication": "/banners/fabrication.jpg",
    "automobile": "/banners/autospare.jpg",
    "controls-and-computers": "/banners/tech.jpg",
    "leather-and-crafts": "/banners/leather.jpg",
    "essential-oils": "/banners/food.jpg",
    "metallurgy": "/banners/food.jpg",
    "building-materials": "/banners/food.jpg",
    "waste-recycling": "/banners/food.jpg",
    "energy": "/banners/food.jpg",
    "chemical-processes": "/banners/food.jpg",
};

const CategoryPage = () => {
    const { category } = useParams();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    function OptimizedImage({ src, width = 600, quality = 75, alt, className }) {
        const optimizedSrc = `/_vercel/image ? url = ${encodeURIComponent(src)
            }& w=${width}& q=${quality}`;
        return <img src={optimizedSrc} alt={alt} className={className} loading="lazy" />;
    }


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

                // Filter products by category if category exists
                const filteredProducts = category
                    ? data.filter(product =>
                        product.category &&
                        product.category.toLowerCase() === category.toLowerCase()
                    )
                    : data;

                setProducts(filteredProducts);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]); // Add category to dependency array

    // Filter products by category
    const filteredProducts = category
        ? products.filter(product =>
            product.category &&
            product.category.toLowerCase() === category.toLowerCase()
        )
        : products;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Banner */}
            {heroBanners[category] && (
                <div className="w-full h-64 mb-8">
                    <OptimizedImage
                        src={heroBanners[category]}
                        alt={`${category} banner`}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                </div>
            )}

            {/* Page Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                    {category ? category.replace(/-/g, ' ') : 'All Products'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {filteredProducts.length} products found
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex justify-center items-center py-10 text-red-500 text-lg">
                    <span className="text-red-500 font-bold">Error:</span> {error}
                </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 && !loading ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        : filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
            )}
        </div>
    );
};

export default CategoryPage;