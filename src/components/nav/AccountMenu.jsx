import { ShoppingCart, Heart, User, Scale } from "lucide-react";

const defaultMenuItems = [
    { id: "compare", label: "Compare", icon: Scale },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    // { id: "cart", label: "Cart", icon: ShoppingCart, badge: 2 },
    // { id: "account", label: "Account", icon: User },
];

export default function AccountMenu({
    menuItems = defaultMenuItems,
    onMenuClick = () => { }, // callback for item clicks
    vendorOptions = ["Become a Vendor", "Register", "Login"], // vendor dropdown options
    onVendorChange = () => { } // callback for vendor change
}) {
    return (
        <div className="flex items-center justify-end gap-2 w-fit px-4 py-2 bg-white shadow-sm">
            {/* Vendor Dropdown */}
            <div className="min-w-[150px]">
                <label htmlFor="vendor_select" className="sr-only">
                    Vendor
                </label>
                <select
                    id="vendor_select"
                    className="block w-full text-sm text-gray-600 bg-transparent border-0 border-b-2 border-gray-300 focus:border-green-500 focus:ring-0"
                    onChange={(e) => onVendorChange(e.target.value)}
                    defaultValue={vendorOptions[0]}
                >
                    {vendorOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dynamic Menu Items */}
            <div className="flex items-center gap-6 text-sm text-gray-700">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onMenuClick(item.id)}
                            className="relative flex items-center gap-1 transition-colors duration-200 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md px-2 py-1"
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>

                            {/* Badge */}
                            {item.badge && (
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
