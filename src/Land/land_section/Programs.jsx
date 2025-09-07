import React from 'react';
import { FaLightbulb, FaFlask, FaDollarSign } from 'react-icons/fa'; // Importing icons

const programs = [
    {
        title: "Startup Mentorship",
        desc: "Receive personalized guidance from seasoned industry experts and entrepreneurs to navigate challenges and accelerate growth.",
        icon: <FaLightbulb className="w-8 h-8 text-blue-600 mb-4" />
    },
    {
        title: "Workspace & Labs",
        desc: "Access state-of-the-art co-working spaces, specialized laboratories, and cutting-edge equipment to bring your ideas to life.",
        icon: <FaFlask className="w-8 h-8 text-blue-600 mb-4" />
    },
    {
        title: "Funding Support",
        desc: "Gain crucial access to angel investors, venture capitalists, and grant opportunities to secure the capital needed for your innovation.",
        icon: <FaDollarSign className="w-8 h-8 text-blue-600 mb-4" />
    },
];

const Programs = () => {
    return (
        <section id="programs" className="py-16 bg-blue-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-10 text-blue-700">Our Core Programs</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Changed md:grid-cols-3 to include default grid-cols-1 */}
                    {programs.map((p, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            {p.icon} {/* Display the icon */}
                            <h3 className="text-2xl font-semibold mb-3 text-gray-800">{p.title}</h3> {/* Changed h4 to h3 for semantic hierarchy */}
                            <p className="text-gray-700 leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Programs;