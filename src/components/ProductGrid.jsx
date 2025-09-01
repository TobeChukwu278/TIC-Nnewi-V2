import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";


export default function ProductsGrid() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Dummy API endpoint for demonstration. Replace with your actual endpoint.
                const response = await fetch('http://localhost:3001/api/store/updates/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                console.log(data);
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // In a real application, you would call fetchProducts() here
        fetchProducts();

    }, []);

    return (
        <section className="px-6 py-10">
            <h1 className="text-2xl font-bold mb-6">Featured Products</h1>

            {!loading && error && (
                <div className="flex justify-center items-center py-10 text-red-500 text-lg">
                    <span className="text-red-500 font-bold">Error:</span> {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))
                    : products.map((product) => (
                        <Link key={product.id} to={`/products/${product.id}`}>
                            <ProductCard product={product} />
                        </Link>
                    ))}
            </div>
        </section>
    );
}
