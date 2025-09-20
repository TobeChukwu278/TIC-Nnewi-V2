import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [orderTypeFilter, setOrderTypeFilter] = useState('all');
    const [durationFilter, setDurationFilter] = useState('this week');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const ordersPerPage = 5;

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get authentication token if needed
                const token = localStorage.getItem('authToken');

                const response = await fetch('https://backend-production-7f80.up.railway.app/api/user/auth/orders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` })
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data);
                setFilteredOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        let result = [...orders];

        // Apply order type filter
        if (orderTypeFilter !== 'all') {
            result = result.filter(order => order.status === orderTypeFilter);
        }

        // Apply duration filter
        const now = new Date();
        result = result.filter(order => {
            const orderDate = new Date(order.created_at);
            switch (durationFilter) {
                case 'this week':
                    {
                        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return orderDate >= oneWeekAgo;
                    }
                case 'this month':
                    return orderDate.getMonth() === now.getMonth() &&
                        orderDate.getFullYear() === now.getFullYear();
                case 'last 3 months':
                    {
                        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        return orderDate >= threeMonthsAgo;
                    }
                case 'last 6 months':
                    {
                        const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
                        return orderDate >= sixMonthsAgo;
                    }
                case 'this year':
                    return orderDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });

        setFilteredOrders(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [orderTypeFilter, durationFilter, orders]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleCancelOrder = async (orderId) => {
        try {
            // Get authentication token if needed
            const token = localStorage.getItem('authToken');

            const response = await fetch(`https://backend-production-7f80.up.railway.app/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to cancel order: ${response.status}`);
            }

            // Update the local state with the cancelled order
            const updatedOrders = orders.map(order => {
                if (order.id === orderId) {
                    return {
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
                }
                return order;
            });

            setOrders(updatedOrders);
            alert('Order has been cancelled successfully.');
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        }
    };

    const handleOrderAgain = (order) => {
        // This would typically add all items from the order to the cart
        console.log('Order again:', order);
        alert('Items from this order have been added to your cart.');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return {
                    class: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                        </svg>
                    ),
                    text: 'Pending'
                };
            case 'delivered':
                return {
                    class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    ),
                    text: 'Delivered'
                };
            case 'shipped':
                return {
                    class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                        </svg>
                    ),
                    text: 'Shipped'
                };
            case 'confirmed':
                return {
                    class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                        </svg>
                    ),
                    text: 'Confirmed'
                };
            case 'cancelled':
                return {
                    class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                        </svg>
                    ),
                    text: 'Cancelled'
                };
            default:
                return {
                    class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
                    icon: null,
                    text: status
                };
        }
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    if (error) {
        return (
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <div className="text-center py-16">
                            <div className="text-red-500 dark:text-red-400 mb-4">
                                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Error Loading Orders</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 inline-flex items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-5xl">
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

                    <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My orders</h2>

                        <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
                            <div>
                                <label htmlFor="order-type" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select order type</label>
                                <select
                                    id="order-type"
                                    value={orderTypeFilter}
                                    onChange={(e) => setOrderTypeFilter(e.target.value)}
                                    className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                >
                                    <option value="all">All orders</option>
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>

                            <span className="inline-block text-gray-500 dark:text-gray-400"> from </span>

                            <div>
                                <label htmlFor="duration" className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select duration</label>
                                <select
                                    id="duration"
                                    value={durationFilter}
                                    onChange={(e) => setDurationFilter(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                >
                                    <option value="this week">this week</option>
                                    <option value="this month">this month</option>
                                    <option value="last 3 months">the last 3 months</option>
                                    <option value="last 6 months">the last 6 months</option>
                                    <option value="this year">this year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="mt-8 text-center py-16">
                            <div className="text-gray-400 dark:text-gray-500 mb-4">
                                <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No orders found</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
                            <Link
                                to="/"
                                className="mt-4 inline-flex items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 flow-root sm:mt-8">
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {currentOrders.map((order) => {
                                        const statusBadge = getStatusBadge(order.status);
                                        return (
                                            <div key={order.id} className="flex flex-wrap items-center gap-y-4 py-6">
                                                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Order ID:</dt>
                                                    <dd className="mt-1.5 text-base font-semibold text-gray-909 dark:text-white">
                                                        <Link to={`/order-tracking/${order.id}`} className="hover:underline">
                                                            {order.order_number}
                                                        </Link>
                                                    </dd>
                                                </dl>

                                                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date:</dt>
                                                    <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                        {new Date(order.created_at
                                                        ).toLocaleDateString()}
                                                    </dd>
                                                </dl>

                                                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Price:</dt>
                                                    <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                        ₦{order.total.toLocaleString()}
                                                    </dd>
                                                </dl>

                                                <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                                    <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
                                                    <dd className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${statusBadge.class}`}>
                                                        {statusBadge.icon}
                                                        {statusBadge.text}
                                                    </dd>
                                                </dl>

                                                <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                                                    {order.status !== 'cancelled' && order.status !== 'confirmed' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                                                        >
                                                            Cancel order
                                                        </button>
                                                    )}
                                                    {order.status === 'confirmed' || order.status === 'cancelled' ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOrderAgain(order)}
                                                            className="w-full rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:w-auto"
                                                        >
                                                            Order again
                                                        </button>
                                                    ) : null}
                                                    <Link
                                                        to={`/order-tracking/${order.id}`}
                                                        className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                                                    >
                                                        View details
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {totalPages > 1 && (
                                <nav className="mt-6 flex items-center justify-center sm:mt-8" aria-label="Page navigation example">
                                    <ul className="flex h-8 items-center -space-x-px text-sm">
                                        <li>
                                            <button
                                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                                disabled={currentPage === 1}
                                                className="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                                </svg>
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i}>
                                                <button
                                                    onClick={() => paginate(i + 1)}
                                                    className={`flex h-8 items-center justify-center border border-gray-300 px-3 leading-tight ${currentPage === i + 1
                                                        ? 'z-10 border-primary-300 bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                                        : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                                disabled={currentPage === totalPages}
                                                className="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg className="h-4 w-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                                </svg>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OrderList;