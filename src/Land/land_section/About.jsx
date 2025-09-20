import React from 'react';

const About = () => {

    return (
        <section id="about" className="py-16 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image Section */}
                    <div className="relative">
                        <img
                            src="/image3.png"
                            alt="TIC Nnewi team working together"
                            className="w-full h-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-4xl font-bold mb-4 text-blue-700">About Our Centre</h2>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            Technology Incubation concept is beign promoted by the Federal Ministry of Science and Technology in response to an initiative by the United Nations Funds for Science and Technology Development <span>(UNFSTD)</span>. Since the establishment of the programmes in Nigeria by decree N0. 5 of %th April 1995, a number of incubation centres came into existence at various locations across the Country. These Centres are supervised by the National Board for Technology Incubation <span>(NBTI)</span>, a parasatal under the Federal Ministry of Science and Technology.
                        </p>

                        <p>
                            Technology Incubation Centre Nnewi <span>(TICN)</span> is among the Twenty-Seven <span>(27)</span> Centres established across the country to assist budding entrepreneurs in the development of new technology-based firms both start-up and fledglings. It seeks to effectively link talent, technology, capital and know-how to leverage entrepreneurial talent in order to accelerate development of new companies and speedy commercialization of R&D and innovation. It also helps in value reorientation by craeting an environment that encourages personal initiative, creativity, innovation, risk-taking and entrepreneurship.
                        </p>
                        {/* <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            The Technology Incubation Centre Nnewi is dedicated to nurturing the next generation of entrepreneurs and innovators. We provide a dynamic environment where groundbreaking ideas can flourish into sustainable businesses. Our comprehensive support system includes access to cutting-edge facilities, expert mentorship, and a network of industry leaders.
                        </p> */}
                        {/* <p className="text-lg text-gray-700 leading-relaxed mb-6">
                            By fostering a culture of collaboration and innovation, we aim to be a catalyst for economic growth in the region, empowering startups to overcome challenges and achieve long-term success.
                        </p> */}
                        <a
                            href="#contact"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-bold shadow-lg hover:bg-blue-700 transition duration-300 self-start"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;