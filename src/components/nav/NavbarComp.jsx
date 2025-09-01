import { useState, useRef, useEffect } from "react";
import { ShoppingCart, User, Menu, X, ChevronDown, Home, Grid3X3, Trophy, Gift, Zap, Store, Sprout, HeartPulse, Wrench, Cpu, BookOpen, ChefHat } from "lucide-react";

// Categories data
const categories = [
    {
        title: 'Agro-Allied',
        href: '/category/agro-allied',
        icon: Sprout,
        description: 'Agricultural products and farming equipment',
    },
    {
        title: 'Cosmetics',
        href: '/category/cosmetics',
        icon: HeartPulse,
        description: 'Beauty products and personal care',
    },
    {
        title: 'Fabrication',
        href: '/category/fabrication',
        icon: Wrench,
        description: 'Metal works and construction materials',
    },
    {
        title: 'Auto Spare Parts',
        href: '/category/autospare-parts',
        icon: Cpu,
        description: 'Automotive parts and accessories',
    },
    {
        title: 'Technology Gadgets',
        href: '/category/technology-gadgets',
        icon: BookOpen,
        description: 'Electronics and tech accessories',
    },
    {
        title: 'Leather Works',
        href: '/category/leather-works',
        icon: BookOpen,
        description: 'Leather goods and accessories',
    },
    {
        title: 'Food Processing',
        href: '/category/food-processing',
        icon: ChefHat,
        description: 'Food items and kitchen supplies',
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
                <a
                    href={href}
                    className="block py-2 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                        <div>
                            <div className="font-medium">{title}</div>
                            {children && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{children}</p>}
                        </div>
                    </div>
                </a>
            </li>
        );
    }

    return (
        <a
            href={href}
            className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4 text-primary-600 flex-shrink-0" />}
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
                    {children && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{children}</p>}
                </div>
            </div>
        </a>
    );
}

export default function NavbarComp() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef(null);

    // Fetch cart items from localStorage or API
    useEffect(() => {
        const fetchCartItems = () => {
            try {
                // Try to get cart from localStorage first
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
                } else {
                    // If no localStorage, try API (you can implement this)
                    // fetchCartFromAPI();
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

        // Listen for cart updates from other components
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

            // Dispatch event to notify other components
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

            // Dispatch event to notify other components
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Clear cart (optional)
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
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

    // Cart item component
    const CartItem = ({ item }) => (
        <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
            <img
                src={item.image || item.main_image_url || 'https://via.placeholder.com/50'}
                alt={item.name}
                className="w-12 h-12 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${item.price.toFixed(2)} × {item.quantity}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
            </div>
            <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-500 transition-colors duration-200 flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );

    // Plus and Minus icons component (add these imports at the top)
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
        <nav className="bg-white dark:bg-gray-800 shadow-sm font-sans">
            <div className="max-w-screen-xl px-4 mx-auto py-4 flex items-center justify-between">
                {/* Left: Logo + Navigation Menu */}
                <div className="flex items-center space-x-8">
                    <a href="/" className="shrink-0 text-2xl font-bold text-primary-700 dark:text-white">
                        TIC
                    </a>

                    {/* Desktop Navigation Menu */}
                    <ul className="hidden lg:flex items-center gap-1">
                        {/* ... (rest of the navigation menu remains the same) */}
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
                            <a
                                href="/today-deals"
                                className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            >
                                <Zap className="w-4 h-4" />
                                Today's Deals
                            </a>
                        </li>

                        <li>
                            <a
                                href="/sell"
                                className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                                <Store className="w-4 h-4" />
                                Sell
                            </a>
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
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                                <CartItem key={item.id} item={item} />
                                            ))}
                                        </div>

                                        <div className="mt-4 border-t pt-4">
                                            <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                <span>Subtotal</span>
                                                <span>${subtotal.toFixed(2)}</span>
                                            </div>
                                            <a
                                                href="/cart"
                                                className="block w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white text-center hover:bg-primary-800 transition-colors duration-200"
                                            >
                                                View Cart & Checkout
                                            </a>
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
                            <span className="hidden md:flex">Account</span>
                        </button>

                        {isUserOpen && (
                            <div className="absolute top-12 right-0 w-56 divide-y divide-gray-100 rounded-lg bg-white shadow-xl dark:divide-gray-600 dark:bg-gray-700 z-50">
                                <ul className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                                    {["My Account", "My Orders", "Settings", "Favourites"].map((item) => (
                                        <li key={item}>
                                            <a
                                                href="#"
                                                className="block rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                            >
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-2">
                                    <a
                                        href="#"
                                        className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-200"
                                    >
                                        Sign Out
                                    </a>
                                </div>
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
                        {/* ... (mobile menu remains the same) */}
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
                            <a
                                href="/today-deals"
                                className="flex items-center gap-2 py-2 px-4 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors duration-200"
                            >
                                <Zap className="w-4 h-4" />
                                Today's Deals
                            </a>
                        </li>

                        <li>
                            <a
                                href="/sell"
                                className="flex items-center gap-2 py-2 px-4 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors duration-200"
                            >
                                <Store className="w-4 h-4" />
                                Sell
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}