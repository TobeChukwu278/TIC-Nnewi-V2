import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../lib/utils"; // remove if not needed

const heroSlides = [
    {
        id: 1,
        title: "Mega Summer Sale",
        subtitle: "Up to 50% OFF Electronics",
        buttonText: "Shop Now",
        image:
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1920&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "New Arrivals",
        subtitle: "Check out the latest trends",
        buttonText: "Explore Collection",
        image:
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1920&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Back to School Deals",
        subtitle: "Save big on laptops & accessories",
        buttonText: "Start Shopping",
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1920&auto=format&fit=crop",
    },
];

export default function HeroSlider() {
    // ✅ Initialize autoplay only once
    const autoplay = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    );

    // ✅ Attach Embla with autoplay
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, skipSnaps: false },
        [autoplay.current]
    );

    const [current, setCurrent] = useState(0);

    // ✅ Listen for slide change
    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);

        onSelect(); // initialize at mount
    }, [emblaApi]);

    return (
        <section className="w-full relative">
            {/* Carousel Container */}
            <div
                className="overflow-hidden w-full h-[70vh] md:h-[80vh] relative"
                ref={emblaRef}
            >
                <div className="flex h-full">
                    {heroSlides.map((slide) => (
                        <div
                            key={slide.id}
                            className="relative flex-[0_0_100%] w-full h-[70vh] md:h-[80vh]"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50" />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="text-3xl sm:text-4xl md:text-6xl font-bold text-white"
                                >
                                    {slide.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.9 }}
                                    className="mt-3 sm:mt-4 text-base sm:text-lg md:text-2xl text-gray-200 max-w-xl"
                                >
                                    {slide.subtitle}
                                </motion.p>
                                <button className="mt-5 sm:mt-6 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base">
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all",
                            current === index
                                ? "bg-white scale-110"
                                : "bg-white/50 hover:bg-white/80"
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
