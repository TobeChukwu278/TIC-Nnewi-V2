import React, { useState, useEffect } from 'react';
import { CalendarDays, Megaphone } from 'lucide-react';

// The API endpoint. NOTE: This is a placeholder and should be a real URL for a production environment.
const API_ENDPOINT = 'https://backend-production-7f80.up.railway.app/api/store/updates/mentorship';

// Main component to display news and events
const NewsEvents = () => {
    // State to hold the news and events data
    const [news, setNews] = useState([]);
    // State to manage the loading status
    const [loading, setLoading] = useState(true);
    // State to handle potential fetch errors
    const [error, setError] = useState(null);

    // Function to fetch resources from the API
    const fetchResources = async () => {
        setLoading(true); // Start loading state
        setError(null);   // Clear any previous errors

        try {
            // Fetch data from the specified API endpoint
            const res = await fetch(API_ENDPOINT, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // Check if the response was successful
            if (!res.ok) {
                // If not, throw an error with the status
                throw new Error('Failed to fetch resources. Status: ' + res.status);
            }

            // Parse the JSON response
            const data = await res.json();

            // Set the fetched data to state
            setNews(data);

        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load resources. Please check the API endpoint and try again.');
        } finally {
            // Stop loading regardless of success or failure
            setLoading(false);
        }
    };

    // Use useEffect to fetch data on initial component mount.
    // The empty dependency array ensures this effect runs only once.
    useEffect(() => {
        fetchResources();
    }, []);

    // Conditional rendering based on the component's state (loading, error, or data)
    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-blue-50 text-center">
                <div className="p-6 text-red-600 font-bold">
                    {error}
                </div>
            </section>
        );
    }

    return (
        <section id="news" className="py-16 bg-blue-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold mb-10 text-blue-700">Latest News & Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {news.length > 0 ? (
                        news.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.link}
                                className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-left"
                            >
                                <div className="flex items-center mb-3">
                                    {/* Use 'category' from the server response to determine the icon */}
                                    {item.category === "event" ? (
                                        <CalendarDays className="w-6 h-6 text-blue-500 mr-3" />
                                    ) : (
                                        <Megaphone className="w-6 h-6 text-green-500 mr-3" />
                                    )}
                                    <p className="text-sm text-gray-500 font-semibold">{item.date}</p>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                                {/* Use 'content' from the server response for the description */}
                                <p className="text-gray-700 text-base">{item.content}</p>
                            </a>
                        ))
                    ) : (
                        // Display a message if there's no data
                        <div className="text-center text-gray-500 col-span-full">No news or events to display at the moment.</div>
                    )}
                </div>

                <div className="mt-12">
                    <a
                        href="/all-news-events"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-bold shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    >
                        View All Updates
                    </a>
                </div>
            </div>
        </section>
    );
};

export default NewsEvents;
