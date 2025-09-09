<<<<<<< HEAD
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
    return (
        <section id="contact" className="py-16 bg-blue-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-10 text-blue-700">Get in Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Contact Information */}
                    <div className="bg-white p-8 rounded-lg shadow-xl text-left flex flex-col space-y-6">
                        <h3 className="text-2xl font-bold mb-2">Our Details</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Feel free to reach out to us with any questions or to schedule a visit to our center. We're here to help you turn your innovative ideas into reality.
                        </p>

                        <div className="flex items-center space-x-4">
                            <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                            <p className="text-lg">
                                Plot No. 1, Technology Incubation Centre, Nnewi, Anambra State, Nigeria
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaPhone className="w-6 h-6 text-blue-600" />
                            <p className="text-lg">+234 801 234 5678</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaEnvelope className="w-6 h-6 text-blue-600" />
                            <p className="text-lg">contact@ticnnewi.com</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-xl text-left">
                        <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                        <form className="space-y-6">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="border border-gray-300 p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="border border-gray-300 p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <textarea
                                placeholder="Your Message"
                                className="border border-gray-300 p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                rows="6"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold px-6 py-4 rounded-md shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

=======
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
    return (
        <section id="contact" className="py-16 bg-blue-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-10 text-blue-700">Get in Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Contact Information */}
                    <div className="bg-white p-8 rounded-lg shadow-xl text-left flex flex-col space-y-6">
                        <h3 className="text-2xl font-bold mb-2">Our Details</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Feel free to reach out to us with any questions or to schedule a visit to our center. We're here to help you turn your innovative ideas into reality.
                        </p>

                        <div className="flex items-center space-x-4">
                            <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                            <p className="text-lg">
                                Plot No. 1, Technology Incubation Centre, Nnewi, Anambra State, Nigeria
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaPhone className="w-6 h-6 text-blue-600" />
                            <p className="text-lg">+234 801 234 5678</p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FaEnvelope className="w-6 h-6 text-blue-600" />
                            <p className="text-lg">contact@ticnnewi.com</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-xl text-left">
                        <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
                        <form className="space-y-6">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="border border-gray-300 p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="border border-gray-300 p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                            <textarea
                                placeholder="Your Message"
                                className="border border-gray-300 p-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                rows="6"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold px-6 py-4 rounded-md shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

>>>>>>> 297942d187eb65516db5973e6385cd9897f43895
export default Contact;