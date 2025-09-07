import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingCart, User, Menu, X, ChevronDown, Home, Grid3X3,
    Trophy, Gift, Zap, Store, Sprout, HeartPulse, Wrench,
    Cpu, BookOpen, ChefHat, Heart, Car, CpuIcon, Leaf,
    HardHat, Recycle, Battery, FlaskConical, Hammer,
    Scissors, Construction
} from "lucide-react";
import { useUser } from '../../UserContext';

// Categories data
const categories = [
    {
        title: 'Food Processing',
        href: '/category/food-processing',
        icon: ChefHat,
        description: 'Food processing equipment and machinery for industrial food production',
    },
    {
        title: 'Medicals',
        href: '/category/medicals',
        icon: HeartPulse,
        description: 'Medical equipment, devices, and healthcare supplies',
    },
    {
        title: 'Engineering Fabrication',
        href: '/category/engineering-fabrication',
        icon: Construction,
        description: 'Custom metal fabrication and engineering solutions',
    },
    {
        title: 'Automobile',
        href: '/category/automobile',
        icon: Car,
        description: 'Automotive parts, accessories, and vehicle systems',
    },
    {
        title: 'Controls and Computers',
        href: '/category/controls-and-computers',
        icon: Cpu,
        description: 'Industrial control systems and computing equipment',
    },
    {
        title: 'Leather and Craft',
        href: '/category/leather-and-crafts',
        icon: Scissors,
        description: 'Leather goods, crafts, and artisanal products',
    },
    {
        title: 'Essential Oils',
        href: '/category/essential-oils',
        icon: Leaf,
        description: 'Pure essential oils and aromatherapy products',
    },
    {
        title: 'Metallurgy',
        href: '/category/metallurgy',
        icon: Hammer,
        description: 'Metallurgical equipment and metal processing technology',
    },
    {
        title: 'Solid Mineral/Building Materials',
        href: '/category/solid-mineral/building-materials',
        icon: HardHat,
        description: 'Building materials, minerals, and construction supplies',
    },
    {
        title: 'Waste Recycling',
        href: '/category/waste-recycling',
        icon: Recycle,
        description: 'Waste management and recycling equipment solutions',
    },
    {
        title: 'Energy',
        href: '/category/energy',
        icon: Battery,
        description: 'Energy systems, power solutions, and renewable energy',
    },
    {
        title: 'Chemical Processes',
        href: '/category/chemical-processes',
        icon: FlaskConical,
        description: 'Chemical processing equipment and industrial chemistry',
    },
];
// Best sellers data
const bestSellers = [
    {
        title: 'Top Rated Products',
        href: '/best-sellers/top-rated',
        description: 'Highest rated and most loved products',
    },
    {
        title: 'Bestselling Items',
        href: '/best-sellers/bestselling',
        description: 'What other customers are buying',
    },
];

// Gift ideas data
const giftIdeas = [
    {
        title: 'Birthday Gifts',
        href: '/gifts/birthday',
        description: 'Perfect gifts for birthdays',
    },
    {
        title: 'Anniversary Gifts',
        href: '/gifts/anniversary',
        description: 'Special gifts for anniversaries',
    },
];

function NavigationMenuItem({ title, icon: Icon, children, isMobile = false }) {
    const [isOpen, setIsOpen] = useState(false);

    if (isMobile) {
        return (
            <li className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full py-2 text-gray-900 dark:text-white hover:text-primary-700 dark:hover:text-primary-500 transition-colors duration-200"
                >
                    <span className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        {title}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                        {children}
                    </div>
                )}
            </li>
        );
    }

    return (
        <li className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                {Icon && <Icon className="w-4 h-4" />}
                {title}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50 min-w-[300px]">
                {children}
            </div>
        </li>
    );
}

function ListItem({ title, href, icon: Icon, children, isMobile = false }) {
    if (isMobile) {
        return (
            <li>
                <Link
                    to={href}
                    className="block py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                        <div>
                            <div className="font-medium">{title}</div>
                            {children && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{children}</p>}
                        </div>
                    </div>
                </Link>
            </li>
        );
    }

    return (
        <Link
            to={href}
            className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
                    {children && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{children}</p>}
                </div>
            </div>
        </Link>
    );
}

// Cart item component - Fixed to have a single parent element
const CartItem = ({ item, updateQuantity, removeFromCart }) => {
    const Plus = () => (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    );

    const Minus = () => (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" />
        </svg>
    );

    return (
        <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
            <img
                src={item.image || 'https://via.placeholder.com/50'}
                alt={item.name}
                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
            // onError={(e) => {
            //     e.target.src = 'https://via.placeholder.com/50';
            // }}
            />
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    ₦{item.price?.toLocaleString()} × {item.quantity}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity - 1);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                    >
                        <Minus />
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity + 1);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                    >
                        <Plus />
                    </button>
                </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(item.id);
                }}
                className="text-red-600 hover:text-red-700 dark:text-red-500 transition-colors duration-200 flex-shrink-0 p-1"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function NavbarComp() {
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use UserContext to get authentication state and user info
    const { isLoggedIn, userEmail, logout } = useUser();

    const dropdownRef = useRef(null);

    // Fetch cart items from localStorage
    useEffect(() => {
        const fetchCartItems = () => {
            try {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
                } else {
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();

        const handleCartUpdate = () => {
            fetchCartItems();
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Remove item from cart
    const removeFromCart = (productId) => {
        try {
            const updatedCart = cartItems.filter(item => item.id !== productId);
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Update item quantity
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        try {
            const updatedCart = cartItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Navigate to cart page
    const goToCart = () => {
        setIsCartOpen(false);
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            navigate('/cart');
        }
    };

    // Navigate to checkout
    const goToCheckout = () => {
        setIsCartOpen(false);
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    // Handle logout using UserContext
    const handleLogout = () => {
        logout();
        setIsUserOpen(false);
        navigate('/');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCartOpen(false);
                setIsUserOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isMobileOpen) {
            setIsCartOpen(false);
            setIsUserOpen(false);
        }
    }, [isMobileOpen]);

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
        setIsCartOpen(false);
        setIsUserOpen(false);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
        setIsUserOpen(false);
    };

    const toggleUser = () => {
        setIsUserOpen(!isUserOpen);
        setIsCartOpen(false);
    };

    // Profile items for desktop
    const desktopProfileItems = isLoggedIn
        ? ["My Account", "My Orders", "Settings"]
        : ["Login/Register"];

    // Profile items for mobile - includes Wishlist
    const mobileProfileItems = isLoggedIn
        ? ["My Account", "My Orders", "Settings", "Wishlist", "Wishlist"]
        : ["Login/Register"];

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm font-sans">
            <div className="max-w-screen-xl px-4 mx-auto py-4 flex items-center justify-between">
                {/* Left: Logo + Navigation Menu */}
                <div className="flex items-center space-x-8">
                    {/* <Link to="/" className="shrink-0 text-2xl font-bold text-primary-700 dark:text-white">
                        TIC
                    </Link> */}
                    <Link to="/" className="shrink-0 text-2xl font-bold text-primary-700 dark:text-white">
                        <img src='/image.png' alt='TIC' className="w-9 h-9" />
                    </Link>

                    {/* Desktop Navigation Menu */}
                    <ul className="hidden lg:flex items-center gap-1">
                        <NavigationMenuItem title="Home" icon={Home}>
                            <div className="space-y-2">
                                <ListItem href="/new-arrivals" title="New Arrivals" icon={Zap}>
                                    Check out our latest products
                                </ListItem>
                                <ListItem href="/featured" title="Featured Products" icon={Trophy}>
                                    Curated selection of popular items
                                </ListItem>
                                <ListItem href="/about" title="About Us" icon={Store}>
                                    Learn more about our store
                                </ListItem>
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem title="Categories" icon={Grid3X3}>
                            <div className="grid gap-2">
                                {categories.map((category) => (
                                    <ListItem
                                        key={category.title}
                                        href={category.href}
                                        title={category.title}
                                        icon={category.icon}
                                    >
                                        {category.description}
                                    </ListItem>
                                ))}
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem title="Best Sellers" icon={Trophy}>
                            <div className="space-y-2">
                                {bestSellers.map((item) => (
                                    <ListItem
                                        key={item.title}
                                        href={item.href}
                                        title={item.title}
                                    >
                                        {item.description}
                                    </ListItem>
                                ))}
                            </div>
                        </NavigationMenuItem>

                        <NavigationMenuItem title="Gift Ideas" icon={Gift}>
                            <div className="space-y-2">
                                {giftIdeas.map((item) => (
                                    <ListItem
                                        key={item.title}
                                        href={item.href}
                                        title={item.title}
                                    >
                                        {item.description}
                                    </ListItem>
                                ))}
                            </div>
                        </NavigationMenuItem>

                        <li>
                            <Link
                                to="/today-deals"
                                className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                <Zap className="w-4 h-4" />
                                Today's Deals
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/sell"
                                className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                                <Store className="w-4 h-4" />
                                Sell
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Right: Cart + Account + Mobile Menu */}
                <div className="flex items-center lg:space-x-2 relative" ref={dropdownRef}>
                    {/* Cart Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleCart}
                            className="relative inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200"
                            disabled={loading}
                        >
                            <ShoppingCart className="w-5 h-5 lg:me-1" />
                            <span className="hidden sm:flex">My Cart</span>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.25rem]">
                                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            )}
                        </button>

                        {isCartOpen && (
                            <div className="absolute top-12 right-0 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading cart...</p>
                                    </div>
                                ) : cartItems.length === 0 ? (
                                    <div className="text-center py-6">
                                        <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Your cart is empty</p>
                                        <button
                                            onClick={goToCart}
                                            className="mt-4 w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white text-center hover:bg-primary-800 transition-colors duration-200"
                                        >
                                            View Cart
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                                <CartItem
                                                    key={item.id}
                                                    item={item}
                                                    updateQuantity={updateQuantity}
                                                    removeFromCart={removeFromCart}
                                                />
                                            ))}
                                        </div>

                                        <div className="mt-4 border-t pt-4 space-y-3">
                                            <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                                                <span>Subtotal</span>
                                                <span>₦{subtotal.toLocaleString()}</span>
                                            </div>

                                            <button
                                                onClick={goToCart}
                                                className="w-full rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-white text-center transition-colors duration-200"
                                            >
                                                View Cart
                                            </button>

                                            <button
                                                onClick={goToCheckout}
                                                className="w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white text-center hover:bg-primary-800 transition-colors duration-200"
                                            >
                                                Proceed to Checkout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleUser}
                            className="inline-flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200"
                        >
                            <User className="w-5 h-5 me-1" />
                            <span className="hidden md:flex">
                                {isLoggedIn ? (userEmail || 'Account') : 'Login'}
                            </span>
                        </button>

                        {isUserOpen && (
                            <div className="absolute top-12 right-0 w-56 divide-y divide-gray-100 rounded-lg bg-white shadow-xl dark:divide-gray-600 dark:bg-gray-700 z-50">
                                {isLoggedIn && userEmail && (
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Hello, {userEmail.split('@')[0]}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userEmail}</p>
                                    </div>
                                )}
                                <ul className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    {desktopProfileItems.map((item) => (
                                        <li key={item}>
                                            {item === "Login/Register" ? (
                                                <Link
                                                    to="/login"
                                                    className="block rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                                    onClick={() => setIsUserOpen(false)}
                                                >
                                                    {item}
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                                                    className="block rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                                    onClick={() => setIsUserOpen(false)}
                                                >
                                                    {item}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {isLoggedIn && (
                                    <div className="p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-200"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileOpen && (
                <div className="lg:hidden border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                    <ul className="space-y-1 p-4">
                        <NavigationMenuItem title="Home" icon={Home} isMobile>
                            <ListItem href="/new-arrivals" title="New Arrivals" isMobile />
                            <ListItem href="/featured" title="Featured Products" isMobile />
                            <ListItem href="/about" title="About Us" isMobile />
                        </NavigationMenuItem>

                        <NavigationMenuItem title="Categories" icon={Grid3X3} isMobile>
                            {categories.map((category) => (
                                <ListItem
                                    key={category.title}
                                    href={category.href}
                                    title={category.title}
                                    icon={category.icon}
                                    isMobile
                                >
                                    {category.description}
                                </ListItem>
                            ))}
                        </NavigationMenuItem>

                        <NavigationMenuItem title="Best Sellers" icon={Trophy} isMobile>
                            {bestSellers.map((item) => (
                                <ListItem
                                    key={item.title}
                                    href={item.href}
                                    title={item.title}
                                    isMobile
                                />
                            ))}
                        </NavigationMenuItem>

                        <NavigationMenuItem title="Gift Ideas" icon={Gift} isMobile>
                            {giftIdeas.map((item) => (
                                <ListItem
                                    key={item.title}
                                    href={item.href}
                                    title={item.title}
                                    isMobile
                                />
                            ))}
                        </NavigationMenuItem>

                        <li>
                            <Link
                                to="/today-deals"
                                className="flex items-center gap-2 py-2 px-4 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors duration-200"
                            >
                                <Zap className="w-4 h-4" />
                                Today's Deals
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/sell"
                                className="flex items-center gap-2 py-2 px-4 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors duration-200"
                            >
                                <Store className="w-4 h-4" />
                                Sell
                            </Link>
                        </li>

                        {/* Mobile Profile Menu */}
                        <li className="pt-4 border-t border-gray-200 dark:border-gray-600 mt-4">
                            <h3 className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">Account</h3>
                            {isLoggedIn && userEmail && (
                                <div className="px-4 py-2">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">Hello, {userEmail.split('@')[0]}</p>
                                </div>
                            )}
                            <ul className="mt-2 space-y-1">
                                {mobileProfileItems.map((item) => (
                                    <li key={item}>
                                        {item === "Wishlist" ? (
                                            <Link
                                                to="/wishlist"
                                                className="flex items-center gap-2 py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <Heart className="w-4 h-4" />
                                                {item}
                                            </Link>
                                        ) : item === "Login/Register" ? (
                                            <Link
                                                to="/login"
                                                className="flex items-center gap-2 py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                {item}
                                            </Link>
                                        ) : (
                                            <Link
                                                to={`/${item.toLowerCase().replace(' ', '-')}`}
                                                className="flex items-center gap-2 py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                {item}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                                {isLoggedIn && (
                                    <li>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileOpen(false);
                                            }}
                                            className="flex items-center gap-2 w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                                        >
                                            <User className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}