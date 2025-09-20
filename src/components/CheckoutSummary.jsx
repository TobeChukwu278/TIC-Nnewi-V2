import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePaystackPayment } from 'react-paystack';
import {
    CreditCard,
    Truck,
    Gift,
    MapPin,
    User,
    Mail,
    Phone,
    Building,
    FileText,
    CheckCircle,
    ArrowRight,
    Plus,
    Lock,
    Shield,
    AlertCircle,
    ArrowLeft,
    Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutSummary = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('bank-transfer');
    const [deliveryMethod, setDeliveryMethod] = useState('standard');
    const [voucherCode, setVoucherCode] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(1500);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentReference, setPaymentReference] = useState(null);
    const initializePaymentRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        state: 'Lagos',
        city: 'Ikeja',
        address: '',
        phone: '',
        additionalInfo: ''
    });

    // Nigerian states and their cities
    const nigerianStates = {
        'Lagos': ['Ikeja', 'Victoria Island', 'Lekki', 'Surulere', 'Apapa', 'Agege'],
        'Abuja': ['Garki', 'Wuse', 'Maitama', 'Asokoro', 'Kubwa', 'Gwarinpa'],
        'Rivers': ['Port Harcourt', 'Bonny', 'Eleme', 'Okrika', 'Oyigbo'],
        'Kano': ['Kano Municipal', 'Fagge', 'Dala', 'Tarauni', 'Nassarawa'],
        'Oyo': ['Ibadan', 'Ogbomoso', 'Oyo', 'Iseyin', 'Saki'],
        'Delta': ['Asaba', 'Warri', 'Sapele', 'Agbor', 'Ughelli']
    };

    // Create a fixed reference when component mounts
    useEffect(() => {
        const sessionRef = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setPaymentReference(sessionRef);
    }, []);

    // Paystack configuration - only create when we have a reference
    const paystackConfig = useMemo(() => {
        return paymentReference ? {
            reference: paymentReference,
            email: formData.email || 'customer@example.com',
            amount: Math.round(total * 100),
            publicKey: 'pk_test_c1120dda031348b3fed40c24e2f7c7bb3490ce2b',
            currency: 'NGN',
            channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money'],
            metadata: {
                custom_fields: [
                    {
                        display_name: "Customer Name",
                        variable_name: "customer_name",
                        value: formData.name || 'Customer'
                    },
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: formData.phone || ''
                    },
                    {
                        display_name: "Delivery Address",
                        variable_name: "delivery_address",
                        value: `${formData.address}, ${formData.city}, ${formData.state}`
                    }
                ]
            }
        } : null;
    }, [
        paymentReference,
        formData.email,
        formData.name,
        formData.phone,
        formData.address,
        formData.city,
        formData.state,
        total
    ]);

    // Initialize Paystack hook at component level
    const initializePayment = usePaystackPayment(paystackConfig || {});

    // Store the initialize function when it's ready
    useEffect(() => {
        if (paystackConfig && initializePayment) {
            initializePaymentRef.current = initializePayment;
        }
    }, [paystackConfig, initializePayment]);

    // Handle Paystack success
    const onPaystackSuccess = async (reference) => {
        console.log('Payment successful!', reference);
        setIsProcessing(true);

        try {
            await verifyPayment(reference.reference);
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Payment was successful but there was an issue updating your order. Please contact support.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Verify payment with backend
    const verifyPayment = async (paymentRef) => {
        try {
            console.log('Verifying payment with reference:', paymentRef);
            const token = localStorage.getItem('authToken');

            const response = await fetch(`http://st:3001/api/user/auth/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentReference: paymentRef
                })
            });

            console.log('Verification response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Verification failed:', errorData);
                throw new Error('Payment verification failed: ' + (errorData.message || 'Unknown error'));
            }

            const result = await response.json();
            console.log('Payment verified successfully:', result);

            // Clear cart and navigate to confirmation
            localStorage.removeItem('cart');
            localStorage.removeItem('checkoutFormData');
            setCartItems([]);
            window.dispatchEvent(new Event('cartUpdated'));

            navigate('/order-confirmation', {
                state: {
                    orderId: result.orderId,
                    orderNumber: result.orderNumber
                }
            });

        } catch (error) {
            console.error('Payment verification error:', error);
            throw error;
        }
    };

    // Handle Paystack close
    const onPaystackClose = () => {
        console.log('Payment closed');
        setIsProcessing(false);
    };

    // Load cart items from localStorage and check for saved form data
    useEffect(() => {
        const loadCartItems = () => {
            try {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(Array.isArray(parsedCart) ? parsedCart : []);

                    // Calculate totals
                    const calculatedSubtotal = parsedCart.reduce((acc, item) =>
                        acc + (item.price * item.quantity), 0);

                    setSubtotal(calculatedSubtotal);
                    setTax(calculatedSubtotal * 0.075); // 7.5% VAT
                    setTotal(calculatedSubtotal + (calculatedSubtotal * 0.075) + deliveryFee);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };

        // Load saved form data if available
        const savedFormData = localStorage.getItem('checkoutFormData');
        if (savedFormData) {
            try {
                const parsedData = JSON.parse(savedFormData);
                setFormData(parsedData);
            } catch (error) {
                console.error('Error parsing saved form data:', error);
            }
        }

        loadCartItems();
        window.addEventListener('cartUpdated', loadCartItems);

        return () => {
            window.removeEventListener('cartUpdated', loadCartItems);
        };
    }, [deliveryFee]);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }, [formData]);

    // Update delivery fee based on method
    useEffect(() => {
        switch (deliveryMethod) {
            case 'standard':
                setDeliveryFee(1500);
                break;
            case 'express':
                setDeliveryFee(3500);
                break;
            case 'same-day':
                setDeliveryFee(6000);
                break;
            default:
                setDeliveryFee(1500);
        }
    }, [deliveryMethod]);

    // Update total when delivery fee changes
    useEffect(() => {
        setTotal(subtotal + tax + deliveryFee);
    }, [subtotal, tax, deliveryFee]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        console.log('Form Data Updated:', { ...formData, [name]: value });
    };

    const handleVoucherApply = () => {
        console.log('Applying voucher:', voucherCode);
        // You would typically make an API call to validate the voucher
    };

    // Complete order for non-Paystack methods
    const completeOrder = async (paymentMethodUsed, paymentRef = null) => {
        // Validate form
        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            throw new Error('Please fill in all required fields');
        }

        try {
            // Get authentication token
            const token = localStorage.getItem('authToken');

            // Send order to backend API
            const response = await fetch(`https://backend-production-7f80.up.railway.app/api/user/auth/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image || ''
                    })),
                    total: total,
                    shippingAddress: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                        city: formData.city,
                        state: formData.state,
                        country: 'Nigeria',
                        additionalInfo: formData.additionalInfo
                    },
                    paymentMethod: paymentMethodUsed,
                    paymentReference: paymentRef
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create order');
            }

            const result = await response.json();

            // Clear the cart after successful order
            localStorage.removeItem('cart');
            localStorage.removeItem('checkoutFormData');
            setCartItems([]);
            window.dispatchEvent(new Event('cartUpdated'));

            // Navigate to confirmation page
            navigate('/order-confirmation', {
                state: {
                    orderId: result.orderId,
                    orderNumber: result.orderNumber || result.order_number
                }
            });

        } catch (error) {
            console.error('Order creation error:', error);
            throw error;
        }
    };

    // Create order for Paystack (with the same reference)
    const createOrderOnly = async () => {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`https://backend-production-7f80.up.railway.app/api/user/auth/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image || ''
                })),
                total: total,
                shippingAddress: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: 'Nigeria',
                    additionalInfo: formData.additionalInfo
                },
                paymentMethod: 'paystack',
                paymentReference: paymentReference // Send the same reference we're using
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create order');
        }

        return await response.json();
    };

    // Handle payment submission
    const handlePayment = async (e) => {
        e.preventDefault();
        if (isProcessing) return;

        if (!formData.name || !formData.email || !formData.phone || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        setIsProcessing(true);

        try {
            if (paymentMethod === 'paystack') {
                if (!initializePaymentRef.current) {
                    throw new Error('Payment system not ready. Please try again.');
                }

                // Create order first
                await createOrderOnly();

                // Launch Paystack payment modal using the ref
                initializePaymentRef.current(onPaystackSuccess, onPaystackClose);
                return; // Don't set isProcessing to false here
            }

            // For other payment methods
            await completeOrder(paymentMethod, null);
        } catch (error) {
            console.error('Payment error:', error);
            alert('Error processing payment: ' + error.message);
            setIsProcessing(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate('/');
    };

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

                    {/* Progress Steps */}
                    <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        <div className="flex items-center text-primary-700 dark:text-primary-500">
                            <span className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Cart
                            </span>
                        </div>

                        <div className="mx-2 text-gray-300">➤</div>

                        <div className="flex items-center text-primary-700 dark:text-primary-500">
                            <span className="flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Checkout
                            </span>
                        </div>

                        <div className="mx-2 text-gray-300">➤</div>

                        <div className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirmation
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePayment} className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
                    <div className="min-w-0 flex-1 space-y-8">
                        {/* Delivery Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                <MapPin className="inline-block h-5 w-5 mr-2" />
                                Delivery Details
                            </h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        <MapPin className="inline-block h-4 w-4 mr-1" />
                                        Delivery Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        placeholder="House number, street name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        State *
                                    </label>
                                    <select
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        required
                                    >
                                        {Object.keys(nigerianStates).map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        City *
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        required
                                    >
                                        {nigerianStates[formData.state]?.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        <User className="inline-block h-4 w-4 mr-1" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        <Mail className="inline-block h-4 w-4 mr-1" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        placeholder="john.doe@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        <Phone className="inline-block h-4 w-4 mr-1" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        placeholder="08012345678"
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="additionalInfo" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Additional Delivery Information
                                    </label>
                                    <textarea
                                        id="additionalInfo"
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                        placeholder="Landmarks, delivery instructions, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                <CreditCard className="inline-block h-5 w-5 mr-2" />
                                Payment Method
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Paystack Option */}
                                <div className={`rounded-lg border p-4 ps-4 ${paymentMethod === 'paystack' ? 'border-primary-500 bg-primary-50 dark:bg-gray-800' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}`}>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="paystack"
                                                aria-describedby="paystack-text"
                                                type="radio"
                                                name="payment-method"
                                                value="paystack"
                                                checked={paymentMethod === 'paystack'}
                                                onChange={() => setPaymentMethod('paystack')}
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="paystack" className="font-medium leading-none text-gray-900 dark:text-white">
                                                Pay with Card
                                            </label>
                                            <p id="paystack-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">
                                                Visa, Mastercard, Verve (Paystack)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`rounded-lg border p-4 ps-4 ${paymentMethod === 'bank-transfer' ? 'border-primary-500 bg-primary-50 dark:bg-gray-800' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}`}>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="bank-transfer"
                                                aria-describedby="bank-transfer-text"
                                                type="radio"
                                                name="payment-method"
                                                value="bank-transfer"
                                                checked={paymentMethod === 'bank-transfer'}
                                                onChange={() => setPaymentMethod('bank-transfer')}
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="bank-transfer" className="font-medium leading-none text-gray-900 dark:text-white"> Bank Transfer </label>
                                            <p id="bank-transfer-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay directly from your bank account</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`rounded-lg border p-4 ps-4 ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50 dark:bg-gray-800' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}`}>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="cash"
                                                aria-describedby="cash-text"
                                                type="radio"
                                                name="payment-method"
                                                value="cash"
                                                checked={paymentMethod === 'cash'}
                                                onChange={() => setPaymentMethod('cash')}
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="cash" className="font-medium leading-none text-gray-900 dark:text-white"> Cash on Delivery </label>
                                            <p id="cash-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Methods */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                <Truck className="inline-block h-5 w-5 mr-2" />
                                Delivery Options
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className={`rounded-lg border p-4 ps-4 ${deliveryMethod === 'standard' ? 'border-primary-500 bg-primary-50 dark:bg-gray-800' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}`}>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="standard"
                                                aria-describedby="standard-text"
                                                type="radio"
                                                name="delivery-method"
                                                value="standard"
                                                checked={deliveryMethod === 'standard'}
                                                onChange={() => setDeliveryMethod('standard')}
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="express" className="font-medium leading-none text-gray-900 dark:text-white"> Express Delivery </label>
                                            <p id="express-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">₦3,500 • 1-2 business days</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`rounded-lg border p-4 ps-4 ${deliveryMethod === 'same-day' ? 'border-primary-500 bg-primary-50 dark:bg-gray-800' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}`}>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                id="same-day"
                                                aria-describedby="same-day-text"
                                                type="radio"
                                                name="delivery-method"
                                                value="same-day"
                                                checked={deliveryMethod === 'same-day'}
                                                onChange={() => setDeliveryMethod('same-day')}
                                                className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                                            />
                                        </div>

                                        <div className="ms-4 text-sm">
                                            <label htmlFor="same-day" className="font-medium leading-none text-gray-900 dark:text-white"> Same Day Delivery </label>
                                            <p id="same-day-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">₦6,000 • Order before 12pm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Voucher Code */}
                        <div>
                            <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                <Gift className="inline-block h-4 w-4 mr-1" />
                                Discount Code
                            </label>
                            <div className="flex max-w-md items-center gap-4">
                                <input
                                    type="text"
                                    id="voucher"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                    placeholder="Enter discount code"
                                />
                                <button
                                    type="button"
                                    onClick={handleVoucherApply}
                                    className="flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
                        <div className="flow-root">
                            <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                                <div className="py-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h3>
                                </div>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
                                    <dd className="text-base font-medium text-gray-900 dark:text-white">₦{subtotal.toLocaleString()}</dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">VAT (7.5%)</dt>
                                    <dd className="textBase font-medium text-gray-900 dark:text-white">₦{tax.toLocaleString()}</dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Delivery</dt>
                                    <dd className="text-base font-medium text-gray-900 dark:text-white">₦{deliveryFee.toLocaleString()}</dd>
                                </dl>

                                <dl className="flex items-center justify-between gap-4 py-3">
                                    <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                    <dd className="text-base font-bold text-gray-900 dark:text-white">₦{total.toLocaleString()}</dd>
                                </dl>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={isProcessing || cartItems.length === 0}
                                className="flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        {paymentMethod === 'paystack' ? 'Pay with Card' : 'Confirm Order & Pay'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Shield className="mr-1 h-3 w-3" />
                                Your payment information is secure and encrypted
                            </div>

                            {cartItems.length === 0 && (
                                <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                                    <AlertCircle className="mr-1 h-4 w-4" />
                                    Your cart is empty. Add items to proceed.
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default CheckoutSummary;