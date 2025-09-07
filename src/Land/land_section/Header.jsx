import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white text-gray-800 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo */}
                <NavLink to="/" className="text-2xl font-bold text-blue-600 transition duration-300 transform hover:scale-105">
                    TIC Nnewi
                </NavLink>

                {/* Desktop Navigation */}
                <nav className="space-x-6 hidden md:flex">
                    {/* <NavLink to="/land" className="hover:text-blue-600 transition duration-300 font-medium">Home</NavLink> */}
                    <a href="#hero" className="hover:text-blue-600 transition duration-300 font-medium">Home</a>
                    <a href="#about" className="hover:text-blue-600 transition duration-300 font-medium">About</a>
                    <NavLink to="/" className="hover:text-blue-600 transition duration-300 font-medium">Store</NavLink>
                    <a href="#programs" className="hover:text-blue-600 transition duration-300 font-medium">Programs</a>
                    <a href="#news" className="hover:text-blue-600 transition duration-300 font-medium">News</a>
                    <a href="#contact" className="hover:text-blue-600 transition duration-300 font-medium">Contact</a>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 hover:text-blue-600 focus:outline-none">
                        {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu (Dropdown/Overlay) */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <nav className="flex flex-col space-y-2 p-6 bg-white text-gray-800 border-t border-gray-200">
                    <a href="#about" className="block py-2 hover:text-blue-600 transition duration-300" onClick={() => setIsMenuOpen(false)}>About</a>
                    <NavLink to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-blue-600 transition duration-300 font-medium">Store</NavLink>
                    <a href="#programs" className="block py-2 hover:text-blue-600 transition duration-300" onClick={() => setIsMenuOpen(false)}>Programs</a>
                    <a href="#news" className="block py-2 hover:text-blue-600 transition duration-300" onClick={() => setIsMenuOpen(false)}>News</a>
                    <a href="#contact" className="block py-2 hover:text-blue-600 transition duration-300" onClick={() => setIsMenuOpen(false)}>Contact</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;