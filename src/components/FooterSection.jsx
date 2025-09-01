import React from "react";
import {
    FaXTwitter,
    FaLinkedin,
    FaFacebook,
    FaInstagram,
    FaTiktok,
} from "react-icons/fa6";

const links = [
    {
        group: "Product",
        items: [
            { title: "Features", href: "#" },
            { title: "Solution", href: "#" },
            { title: "Customers", href: "#" },
            { title: "Pricing", href: "#" },
            { title: "Help", href: "#" },
            { title: "About", href: "#" },
        ],
    },
    {
        group: "Solution",
        items: [
            { title: "Startup", href: "#" },
            { title: "Freelancers", href: "#" },
            { title: "Organizations", href: "#" },
            { title: "Students", href: "#" },
            { title: "Collaboration", href: "#" },
            { title: "Enterprenuership", href: "#" },
            { title: "Management", href: "#" },
        ],
    },
    {
        group: "Company",
        items: [
            { title: "About", href: "#" },
            { title: "Careers", href: "#" },
            { title: "Blog", href: "#" },
            { title: "Press", href: "#" },
            { title: "Contact", href: "#" },
            { title: "Help", href: "#" },
        ],
    },
    {
        group: "Legal",
        items: [
            { title: "Licence", href: "#" },
            { title: "Privacy", href: "#" },
            { title: "Cookies", href: "#" },
            { title: "Security", href: "#" },
        ],
    },
];

export default function FooterSection() {
    return (
        <footer className="border-b bg-white pt-20 dark:bg-transparent">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-12 md:grid-cols-5">
                    {/* Logo */}

                    <div className="md:col-span-2">
                        <a href="/" aria-label="go home" className="block size-fit ">
                            {/* Replace with your logo */}
                            {/* <img src="/logo.svg" alt="Logo" className="h-8 w-auto" /> */}
                            <h4 className="text-green-900 font-bold">TIC Nnewi</h4>
                        </a>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
                        {links.map((link, index) => (
                            <div key={index} className="space-y-4 text-sm">
                                <span className="block font-medium">{link.group}</span>
                                {link.items.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary block duration-150"
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer bottom */}
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
                        © {new Date().getFullYear()} TIC-Nnewi, All rights reserved
                    </span>

                    {/* Social links */}
                    <div className="order-first flex flex-wrap justify-center gap-6 text-lg md:order-last">
                        <a href="#" aria-label="Twitter" className="hover:text-blue-500">
                            <FaXTwitter />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-blue-600">
                            <FaLinkedin />
                        </a>
                        <a href="#" aria-label="Facebook" className="hover:text-blue-700">
                            <FaFacebook />
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-pink-500">
                            <FaInstagram />
                        </a>
                        <a href="#" aria-label="TikTok" className="hover:text-black">
                            <FaTiktok />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
