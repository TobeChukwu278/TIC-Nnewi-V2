// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Truck, ShoppingBag } from 'lucide-react';

// const OrderConfirmation = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         state: 'Anambra',
//         city: 'Nnewi',
//         paymentMethod: '',
//         address: '',
//         phone: '',
//     });

//     // Get order data from location state or localStorage
//     // const orderData = location.state || JSON.parse(localStorage.getItem('orderData') || '{}');
//     // const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // Get authentication token if needed
//                 const token = localStorage.getItem('authToken');

//                 const response = await fetch('http://localhost:3001/api/user/auth/orders', {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         ...(token && { 'Authorization': `Bearer ${token}` })
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch orders: ${response.status}`);
//                 } else {
//                     console.log('------------------------------orders fetched-------------------')
//                 }

//                 const data = await response.json();
//                 setFormData(data);
//             } catch (error) {
//                 console.error('Error fetching orders:', error);
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);

//     // Default data in case nothing is found
//     // const orderDetails = {
//     //     id: orderData.id || `#${Math.floor(1000000 + Math.random() * 9000000)}`,
//     //     date: orderData.date || new Date().toLocaleDateString('en-US', {
//     //         year: 'numeric',
//     //         month: 'long',
//     //         day: 'numeric'
//     //     }),
//     //     paymentMethod: orderData.paymentMethod || 'Credit Card',
//     //     name: userData.name || 'Customer Name',
//     //     address: userData.address || 'Delivery Address',
//     //     phone: userData.phone || 'Phone Number',
//     //     email: userData.email || 'email@example.com'
//     // };

//     const handleTrackOrder = () => {
//         // Navigate to order tracking page
//         navigate('/order-tracking', { state: { orderId: orderDetails.id } });
//     };

//     const handleReturnToShopping = () => {
//         // Navigate back to shopping
//         navigate('/products');
//     };

//     return (
//         <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
//             <div className="mx-auto max-w-2xl px-4 2xl:px-0">
//                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
//                     Thanks for your order!
//                 </h2>
//                 <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
//                     Your order <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">
//                         {userData.orders.order_number}
//                     </a> will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.
//                 </p>

//                 <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
//                     <dl className="sm:flex items-center justify-between gap-4">
//                         <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Date</dt>
//                         <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{userData.orders.created_at}</dd>
//                     </dl>

//                     <dl className="sm:flex items-center justify-between gap-4">
//                         <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Payment Method</dt>
//                         <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{userData.orders.paymentMethod}</dd>
//                     </dl>

//                     <dl className="sm:flex items-center justify-between gap-4">
//                         <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Name</dt>
//                         <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{userData.orders.name}</dd>
//                     </dl>

//                     <dl className="sm:flex items-center justify-between gap-4">
//                         <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Address</dt>
//                         <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.address}</dd>
//                     </dl>

//                     <dl className="sm:flex items-center justify-between gap-4">
//                         <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Phone</dt>
//                         <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.phone}</dd>
//                     </dl>

//                     <dl className="sm:flex items-center justify-between gap-4">
//                         <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Email</dt>
//                         <dd className="font-medium text-gray-900 dark:text-white sm:text-end">{orderDetails.email}</dd>
//                     </dl>
//                 </div>

//                 <div className="flex items-center space-x-4">
//                     <button
//                         onClick={handleTrackOrder}
//                         className="flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
//                     >
//                         <Truck className="mr-2 h-4 w-4" />
//                         Track your order
//                     </button>

//                     <button
//                         onClick={handleReturnToShopping}
//                         className="flex items-center py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
//                     >
//                         <ShoppingBag className="mr-2 h-4 w-4" />
//                         Return to shopping
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default OrderConfirmation;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Truck, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderData, setOrderData] = useState(null);

    // Get order ID from location state, URL params, or localStorage
    const orderId = location.state?.orderId ||
        new URLSearchParams(location.search).get('orderId') ||
        localStorage.getItem('lastOrderId');

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setError('No order ID found');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('authToken');
                const response = await fetch(`https://backend-production-7f80.up.railway.app/api/user/auth/orders/${orderId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch order: ${response.status}`);
                }

                const data = await response.json();
                setOrderData(data);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleTrackOrder = () => {
        if (orderData) {
            navigate(`/order-tracking/${orderData.id}`);
        }
    };

    const handleReturnToShopping = () => {
        navigate('/products');
    };

    if (loading) {
        return (
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-2xl px-4 2xl:px-0">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !orderData) {
        return (
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-2xl px-4 2xl:px-0">
                    <div className="text-center py-16">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Not Found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">{error || 'Unable to load order details'}</p>
                        <button
                            onClick={handleReturnToShopping}
                            className="mt-4 inline-flex items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-2xl px-4 2xl:px-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
                    Thanks for your order!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
                    Your order <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">
                        #{orderData.order_number || orderData.id}
                    </a> will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.
                </p>

                <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Date</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                            {new Date(orderData.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Payment Method</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                            {orderData.payment_method || 'Card Payment'}
                        </dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Name</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                            {orderData.name || orderData.customer_name || 'N/A'}
                        </dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Address</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                            {orderData.address || orderData.shipping_address?.address || 'N/A'}
                        </dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">State</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                            {orderData.state || orderData.shipping_address?.state || 'N/A'}
                        </dd>
                    </dl>

                    <dl className="sm:flex items-center justify-between gap-4">
                        <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">Total</dt>
                        <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                            ₦{orderData.total?.toLocaleString() || '0'}
                        </dd>
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