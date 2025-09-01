import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '../ui/menubar';

export default function StoreMenubar() {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>About Us</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Our Story</MenubarItem>
                    <MenubarItem>Contact</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>My Account</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Login</MenubarItem>
                    <MenubarItem>Register</MenubarItem>
                    <MenubarItem>Profile</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Wishlist</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>View Wishlist</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>Order Tracking</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Track My Order</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
