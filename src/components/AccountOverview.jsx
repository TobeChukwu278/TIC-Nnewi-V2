import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Edit, Phone, MapPin, Building, CreditCard } from 'lucide-react';

const AccountOverview = () => {
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load user data and orders from localStorage
    useEffect(() => {
        const loadData = () => {
            try {
                const savedUserData = localStorage.getItem('userData');
                const savedOrders = localStorage.getItem('userOrders');

                if (savedUserData) {
                    setUserData(JSON.parse(savedUserData));
                }

                if (savedOrders) {
                    const parsedOrders = JSON.parse(savedOrders);
                    setOrders(parsedOrders);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pre-order':
                return {
                    class: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
                        </svg>
                    ),
                    text: 'Pre-order'
                };
            case 'transit':
                return {
                    class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                        </svg>
                    ),
                    text: 'In transit'
                };
            case 'confirmed':
            case 'completed':
                return {
                    class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                    icon: (
                        <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
                        </svg>
                    ),
                    text: status === 'completed' ? 'Completed' : 'Confirmed'
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

    if (loading) {
        return (
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
                <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
            <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
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

                <nav className="mb-4 flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
                                <svg className="me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                                </svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="mx-1 h-4 w-4 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                </svg>
                                <Link to="/account" className="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white md:ms-2">My account</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="mx-1 h-4 w-4 text-gray-400 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                                </svg>
                                <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ms-2">Account</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl md:mb-6">General overview</h2>

                <div className="grid grid-cols-2 gap-6 border-b border-t border-gray-200 py-4 dark:border-gray-700 md:py-8 lg:grid-cols-4 xl:gap-16">
                    <div>
                        <svg className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                        </svg>
                        <h3 className="mb-2 text-gray-500 dark:text-gray-400">Orders made</h3>
                        <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
                        >{orders.length}
                            <span className="ms-2 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                <svg className="-ms-1 me-1 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4"></path>
                                </svg>
                                10.3%
                            </span>
                        </span>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                            <svg className="me-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            vs {Math.max(0, orders.length - 3)} last 3 months
                        </p>
                    </div>

                    <div>
                        <svg className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z" />
                        </svg>
                        <h3 className="mb-2 text-gray-500 dark:text-gray-400">Reviews added</h3>
                        <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
                        >{Math.floor(orders.length * 0.7)}
                            <span className="ms-2 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                <svg className="-ms-1 me-1 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4"></path>
                                </svg>
                                8.6%
                            </span>
                        </span>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                            <svg className="me-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            vs {Math.max(0, Math.floor(orders.length * 0.7) - 2)} last 3 months
                        </p>
                    </div>

                    <div>
                        <svg className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                        </svg>
                        <h3 className="mb-2 text-gray-500 dark:text-gray-400">Favorite products added</h3>
                        <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
                        >{Math.floor(orders.length * 0.3)}
                            <span className="ms-2 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                                <svg className="-ms-1 me-1 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4"></path>
                                </svg>
                                12%
                            </span>
                        </span>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                            <svg className="me-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            vs {Math.max(0, Math.floor(orders.length * 0.3) - 1)} last 3 months
                        </p>
                    </div>

                    <div>
                        <svg className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4" />
                        </svg>
                        <h3 className="mb-2 text-gray-500 dark:text-gray-400">Product returns</h3>
                        <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white"
                        >{Math.floor(orders.length * 0.1)}
                            <span className="ms-2 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                <svg className="-ms-1 me-1 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v13m0-13 4 4m-4-4-4 4"></path>
                                </svg>
                                50%
                            </span>
                        </span>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                            <svg className="me-1.5 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            vs {Math.max(0, Math.floor(orders.length * 0.1) - 1)} last 3 months
                        </p>
                    </div>
                </div>

                <div className="py-4 md:py-8">
                    <div className="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                                        {userData?.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}
                                    </span>
                                </div>
                                <div>
                                    <span className="mb-2 inline-block rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300"> PRO Account </span>
                                    <h2 className="flex items-center text-xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">
                                        {userData?.name || 'User Name'}
                                    </h2>
                                </div>
                            </div>
                            <dl className="">
                                <dt className="font-semibold text-gray-900 dark:text-white">Email Address</dt>
                                <dd className="text-gray-500 dark:text-gray-400">{userData?.email || 'user@example.com'}</dd>
                            </dl>
                            <dl>
                                <dt className="font-semibold text-gray-900 dark:text-white">Home Address</dt>
                                <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <MapPin className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" />
                                    {userData?.address || 'No address provided'}
                                </dd>
                            </dl>
                            <dl>
                                <dt className="font-semibold text-gray-900 dark:text-white">Delivery Address</dt>
                                <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <MapPin className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" />
                                    {userData?.address || 'No delivery address provided'}
                                </dd>
                            </dl>
                        </div>

                        <div className="space-y-4">
                            <dl>
                                <dt className="font-semibold text-gray-900 dark:text-white">Phone Number</dt>
                                <dd className="text-gray-500 dark:text-gray-400">
                                    <Phone className="inline h-4 w-4 mr-1" />
                                    {userData?.phone || 'No phone number provided'}
                                </dd>
                            </dl>
                            <dl>
                                <dt className="font-semibold text-gray-900 dark:text-white">Favorite pick-up point</dt>
                                <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <MapPin className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" />
                                    {userData?.city ? `${userData.city}, ${userData.state}` : 'No pick-up point set'}
                                </dd>
                            </dl>
                            <dl>
                                <dt className="font-semibold text-gray-900 dark:text-white">My Companies</dt>
                                <dd className="text-gray-500 dark:text-gray-400">
                                    <Building className="inline h-4 w-4 mr-1" />
                                    {userData?.company || 'No company information'}
                                </dd>
                            </dl>
                            <dl>
                                <dt className="mb-1 font-semibold text-gray-900 dark:text-white">Payment Methods</dt>
                                <dd className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <CreditCard className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm">
                                            <p className="mb-0.5 font-medium text-gray-900 dark:text-white">Bank Transfer</p>
                                            <p className="font-normal text-gray-500 dark:text-gray-400">Primary payment method</p>
                                        </div>
                                    </div>
                                </dd>
                            </dl>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
                    >
                        <Edit className="-ms-0.5 me-1.5 h-4 w-4" />
                        Edit your data
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 md:p-8">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Latest orders</h3>

                    {orders.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
                            <Link
                                to="/"
                                className="mt-4 inline-flex items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        orders.slice(0, 4).map((order) => {
                            const statusBadge = getStatusBadge(order.status);
                            return (
                                <div key={order.id} className="flex flex-wrap items-center gap-y-4 border-b border-gray-200 py-4 dark:border-gray-700 md:py-5">
                                    <dl className="w-1/2 sm:w-48">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Order ID:</dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                            <Link to={`/order-tracking/${order.id}`} className="hover:underline">
                                                {order.id}
                                            </Link>
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 md:flex-1 lg:w-auto">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Date:</dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                            {new Date(order.date).toLocaleDateString()}
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/5 md:flex-1 lg:w-auto">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Price:</dt>
                                        <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                            ₦{order.total.toLocaleString()}
                                        </dd>
                                    </dl>

                                    <dl className="w-1/2 sm:w-1/4 sm:flex-1 lg:w-auto">
                                        <dt className="text-base font-medium text-gray-500 dark:text-gray-400">Status:</dt>
                                        <dd className="me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${statusBadge.class}">
                                            {statusBadge.icon}
                                            {statusBadge.text}
                                        </dd>
                                    </dl>

                                    <div className="w-full sm:flex sm:w-32 sm:items-center sm:justify-end sm:gap-4">
                                        <Link
                                            to={`/order-tracking/${order.id}`}
                                            className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 md:w-auto"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {orders.length > 4 && (
                        <div className="pt-4 text-center">
                            <Link
                                to="/orders"
                                className="text-primary-700 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-400"
                            >
                                View all orders →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AccountOverview;