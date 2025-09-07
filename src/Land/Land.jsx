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



// import React from "react";
// import Header from "./components/Header";
// import Hero from "./components/Hero";
// import About from "./components/About";
// import Programs from "./components/Programs";
// import NewsEvents from "./components/NewsEvents";
// import Contact from "./components/Contact";
// import Footer from "./components/Footer";

// export default function App() {
//   return (
//     <div className="font-sans text-gray-800">
//       <Header />
//       <Hero />
//       <About />
//       <Programs />
//       <NewsEvents />
//       <Contact />
//       <Footer />
//     </div>
//   );
// }