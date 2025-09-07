import React from 'react';

const Hero = () => {
    return (
        <section id='hero'
            className="relative bg-cover bg-center bg-no-repeat py-16 min-h-screen"
            style={{ backgroundImage: "url('/image.png')" }}
        >
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Centered Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="container mx-auto px-6 text-center text-white">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
                        Empowering Innovation & Entrepreneurship
                    </h2>
                    <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-6 opacity-90">
                        Technology Incubation Centre Nnewi helps startups and innovators bring their ideas to life through mentorship, funding, and state-of-the-art facilities.
                    </p>
                    <a
                        href="#contact"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;