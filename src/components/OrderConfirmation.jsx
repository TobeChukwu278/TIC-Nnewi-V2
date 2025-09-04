import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Truck, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get order data from location state or localStorage
    const orderData = location.state || JSON.parse(localStorage.getItem('orderData') || '{}');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // Default data in case nothing is found
    const orderDetails = {
        id: orderData.id || `#${Math.floor(1000000 + Math.random() * 9000000)}`,
        date: orderData.date || new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        paymentMethod: orderData.paymentMethod || 'Credit Card',
        name: userData.name || 'Customer Name',
        address: userData.address || 'Delivery Address',
        phone: userData.phone || 'Phone Number',
        email: userData.email || 'email@example.com'
    };

    const handleTrackOrder = () => {
        // Navigate to order tracking page
        navigate('/order-tracking', { state: { orderId: orderDetails.id } });
    };

    const handleReturnToShopping = () => {
        // Navigate back to shopping
        navigate('/products');
    };

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-2xl px-4 2xl:px-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
                    Thanks for your order!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
                    Your order <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">
                        {orderDetails.id}
                    </a> will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.
                </p>

                <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Date</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.date}</dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Payment Method</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.paymentMethod}</dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Name</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.name}</dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Address</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.address}</dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Phone</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.phone}</dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Email</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.email}</dd>
                    </dl>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleTrackOrder}
                        className="flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                    >
                        <Truck className="mr-2 h-4 w-4" />
                        Track your order
                    </button>

                    <button
                        onClick={handleReturnToShopping}
                        className="flex items-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Return to shopping
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OrderConfirmation;