import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About Section */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">TIC Nnewi</h3>
                    <p className="text-sm leading-relaxed">
                        Empowering innovation and entrepreneurship in Nnewi and beyond, by providing mentorship, resources, and funding support.
                    </p>
                    <div className="flex space-x-4 mt-6">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition duration-300">
                            <FaFacebookF className="w-6 h-6" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition duration-300">
                            <FaTwitter className="w-6 h-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition duration-300">
                            <FaLinkedinIn className="w-6 h-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition duration-300">
                            <FaInstagram className="w-6 h-6" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="#about" className="hover:text-blue-500 transition duration-300">About Us</a></li>
                        <li><a href="#programs" className="hover:text-blue-500 transition duration-300">Our Programs</a></li>
                        <li><a href="#news" className="hover:text-blue-500 transition duration-300">News & Events</a></li>
                        <li><a href="/faq" className="hover:text-blue-500 transition duration-300">FAQs</a></li>
                        <li><a href="/privacy" className="hover:text-blue-500 transition duration-300">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Contact Info</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                            <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                            <span>Plot No. 1, Technology Incubation Centre, Nnewi, Anambra State, Nigeria</span>
                        </li>
                        <li className="flex items-center">
                            <FaPhone className="w-5 h-5 text-gray-400 mr-3" />
                            <span>+234 801 234 5678</span>
                        </li>
                        <li className="flex items-center">
                            <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                            <span>contact@ticnnewi.com</span>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Signup */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Stay Connected</h3>
                    <p className="text-sm mb-4">
                        Subscribe to our newsletter for the latest updates and opportunities.
                    </p>
                    <form className="flex flex-col space-y-3">
                        <input
                            type="email"
                            placeholder="Your Email Address"
                            className="p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Copyright and Bottom Links */}
            <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} TIC Nnewi. All rights reserved.</p>
                <p className="mt-2">
                    <a href="/terms" className="hover:underline mx-2">Terms of Service</a> |
                    <a href="/privacy" className="hover:underline mx-2">Privacy Policy</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;