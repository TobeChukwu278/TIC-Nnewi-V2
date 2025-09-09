import React from 'react'
import Header from "./land_section/Header"
import Hero from "./land_section/Hero"
import About from "./land_section/About"
import Programs from "./land_section/Programs"
import NewsEvents from "./land_section/NewsEvents"
import Contact from "./land_section/Contact"
import Footer from "./land_section/Footer"

const Land = () => {
    return (
        <div className="font-sans text-gray-800">
            <Header />
            <Hero />
            <About />
            <Programs />
            <NewsEvents />
            <Contact />
            <Footer />
        </div>
    )
}

export default Land
