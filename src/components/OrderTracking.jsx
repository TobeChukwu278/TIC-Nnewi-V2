import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Truck, Package, CheckCircle, Clock, MapPin } from 'lucide-react';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userOrders, setUserOrders] = useState([]);
    const navigate = useNavigate();

    // Load order data from localStorage
    useEffect(() => {
        const loadOrderData = () => {
            try {
                // In a real app, this would be an API call to your backend
                const savedOrder = localStorage.getItem('orderData');
                const allOrders = localStorage.getItem('userOrders');

                if (savedOrder) {
                    const orderData = JSON.parse(savedOrder);

                    // If we're looking at a specific order and it matches
                    if (orderId && orderData.id === orderId) {
                        setOrder(orderData);
                    } else if (!orderId) {
                        // If no order ID specified, show the latest order
                        setOrder(orderData);
                    }
                }

                if (allOrders) {
                    setUserOrders(JSON.parse(allOrders));
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading order data:', error);
                setLoading(false);
            }
        };

        loadOrderData();
    }, [orderId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleCancelOrder = () => {
        if (!order) return;

        // Update order status to cancelled
        const updatedOrder = {
            ...order,
            status: 'cancelled',
            history: [
                ...order.history,
                {
                    status: "Order Cancelled",
                    description: "You've cancelled this order",
                    date: new Date().toLocaleString(),
                    icon: "cancel",
                    active: true
                }
            ]
        };

        // Update localStorage
        localStorage.setItem('orderData', JSON.stringify(updatedOrder));

        // Update in orders list
        const updatedOrders = userOrders.map(ord =>
            ord.id === order.id ? updatedOrder : ord
        );
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
        setUserOrders(updatedOrders);

        setOrder(updatedOrder);
        alert('Your order has been cancelled successfully.');
    };

    if (loading) {
        return (
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    {/* Header with navigation buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleGoBack}
                                className="flex items-center text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                            >
                                <ArrowLeft className="h-5 w-5 mr-1" />
                                Go Back
                            </button>
                            <span className="text-gray-400 mx-2">|</span>
                            <button
                                onClick={handleGoHome}
                                className="flex items-center text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                            >
                                <Home className="h-5 w-5 mr-1" />
                                Home
                            </button>
                        </div>
                    </div>

                    <div className="text-center py-16">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                            Order Not Found
                        </h2>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Sorry, we couldn't find the order you're looking for.
                        </p>
                        <Link
                            to="/orders"
                            className="mt-6 inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                {/* Header with navigation buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            Go Back
                        </button>
                        <span className="text-gray-400 mx-2">|</span>
                        <button
                            onClick={handleGoHome}
                            className="flex items-center text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                        >
                            <Home className="h-5 w-5 mr-1" />
                            Home
                        </button>
                    </div>

                    <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex items-center text-primary-700 dark:text-primary-500">
                            <span className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Order Placed
                            </span>
                        </div>

                        <div className="mx-2 text-gray-300">➤</div>

                        <div className={`flex items-center ${order.status !== 'pending' ? 'text-primary-700 dark:text-primary-500' : ''}`}>
                            <span className="flex items-center">
                                <Package className="mr-2 h-4 w-4" />
                                Processing
                            </span>
                        </div>

                        <div className="mx-2 text-gray-300">➤</div>

                        <div className={`flex items-center ${order.status === 'shipped' || order.status === 'delivered' ? 'text-primary-700 dark:text-primary-500' : ''}`}>
                            <span className="flex items-center">
                                <Truck className="mr-2 h-4 w-4" />
                                Shipped
                            </span>
                        </div>

                        <div className="mx-2 text-gray-300">➤</div>

                        <div className={`flex items-center ${order.status === 'delivered' ? 'text-primary-700 dark:text-primary-500' : ''}`}>
                            <span className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4" />
                                Delivered
                            </span>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    Track the delivery of order {order.id}
                </h2>

                <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
                    <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
                        {order.items.map((item, index) => (
                            <div key={index} className="space-y-4 p-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 shrink-0 bg-gray-200 rounded-lg flex items-center justify-center dark:bg-gray-700">
                                        {item.image ? (
                                            <>
                                                <img
                                                    className="h-full w-full dark:hidden"
                                                    src={item.image}
                                                    alt={item.name}
                                                />
                                                <img
                                                    className="hidden h-full w-full dark:block"
                                                    src={item.imageDark || item.image}
                                                    alt={item.name}
                                                />
                                            </>
                                        ) : (
                                            <Package className="h-6 w-6 text-gray-500" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            Product ID:
                                        </span>{" "}
                                        {item.id || `BJ${Math.floor(1000000 + Math.random() * 9000000)}`}
                                    </p>

                                    <div className="flex items-center justify-end gap-4">
                                        <p className="text-base font-normal text-gray-900 dark:text-white">
                                            x{item.quantity}
                                        </p>

                                        <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="space-y-4 bg-gray-50 p-6 dark:bg-gray-800">
                            <div className="space-y-2">
                                <dl className="flex items-center justify-between gap-4">
                                    <dt className="font-normal text-gray-500 dark:text-gray-400">
                                        Subtotal
                                    </dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">
                                        ₦{order.subtotal.toLocaleString()}
                                    </dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4">
                                    <dt className="font-normal text-gray-500 dark:text-gray-400">
                                        VAT (7.5%)
                                    </dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">
                                        ₦{order.tax.toLocaleString()}
                                    </dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4">
                                    <dt className="font-normal text-gray-500 dark:text-gray-400">
                                        Delivery Fee
                                    </dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">
                                        ₦{order.deliveryFee.toLocaleString()}
                                    </dd>
                                </dl>
                            </div>

                            <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                <dt className="text-lg font-bold text-gray-900 dark:text-white">
                                    Total
                                </dt>
                                <dd className="text-lg font-bold text-gray-900 dark:text-white">
                                    ₦{order.total.toLocaleString()}
                                </dd>
                            </dl>
                        </div>
                    </div>

                    <div className="mt-6 grow sm:mt-8 lg:mt-0">
                        <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Order history
                            </h3>

                            <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                                {order.history && order.history.map((event, index) => (
                                    <li key={index} className={`mb-10 ms-6 ${event.active ? "text-primary-700 dark:text-primary-500" : ""}`}>
                                        <span
                                            className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-800 ${event.active
                                                ? "bg-primary-100 dark:bg-primary-900"
                                                : "bg-gray-100 dark:bg-gray-700"
                                                }`}
                                        >
                                            {event.icon === "delivery" ? (
                                                <svg
                                                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                                                    />
                                                </svg>
                                            ) : event.icon === "truck" ? (
                                                <Truck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            ) : event.icon === "cancel" ? (
                                                <svg
                                                    className="h-4 w-4 text-red-500"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            ) : (
                                                <CheckCircle className="h-4 w-4" />
                                            )}
                                        </span>
                                        <div>
                                            <h4 className="mb-0.5 font-semibold">
                                                {event.status}
                                            </h4>
                                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                                {event.description}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {event.date}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>

                            <div className="gap-4 sm:flex sm:items-center">
                                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <button
                                        type="button"
                                        onClick={handleCancelOrder}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                                    >
                                        Cancel the order
                                    </button>
                                )}

                                <Link
                                    to="/orders"
                                    className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0"
                                >
                                    View all orders
                                </Link>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mt-6 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Delivery Address
                            </h3>

                            <div className="space-y-2">
                                <p className="text-gray-900 dark:text-white font-medium">{order.name}</p>
                                <p className="text-gray-700 dark:text-gray-300">{order.address}</p>
                                <p className="text-gray-700 dark:text-gray-300">{order.city}, {order.state}</p>
                                <p className="text-gray-700 dark:text-gray-300">Phone: {order.phone}</p>
                                {order.company && (
                                    <p className="text-gray-700 dark:text-gray-300">Company: {order.company}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderTracking;