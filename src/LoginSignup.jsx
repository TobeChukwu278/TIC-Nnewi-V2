import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// The import path is now for the new context hook
import { useUser } from './UserContext';
// import {fa-eye, fa-eye-slash} from '@fortawesome/free-solid-svg-icons';

// ==========================================================
// Login View Component
// ==========================================================
const LoginView = ({ setView }) => {
    const [showPassword, setShowPassword] = useState(false);
    // Use the new custom hook to get the login function
    const { login } = useUser();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('https://backend-production-7f80.up.railway.app/api/user/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Call the login function from the context
                login(data.user.email, data.token);
                localStorage.setItem("authToken", data.token);
                navigate('/');
            } else {
                setMessage(data.error || 'Login failed.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setMessage(`Social login with ${provider} is not yet implemented. Please use email and password.`);
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Log In</h2>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-gray-700 text-sm font-medium mb-1"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </form>

            <div className="flex items-center w-full my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-500 text-sm font-medium">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="w-full space-y-2">
                <button
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full bg-white text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition duration-300"
                >
                    <i className="fa-brands fa-google mr-2"></i> Log In with Google
                </button>
                <button
                    onClick={() => handleSocialLogin('Facebook')}
                    className="w-full bg-white text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition duration-300"
                >
                    <i className="fa-brands fa-facebook mr-2"></i> Log In with Facebook
                </button>
            </div>

            {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
            <div className="mt-6 text-center">
                <button
                    onClick={() => setView('register')}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Don't have an account? Sign Up
                </button>
            </div>
        </div>
    );
};
LoginView.propTypes = {
    setView: PropTypes.func.isRequired,
};

// ==========================================================
// Register View Component
// ==========================================================
// ...existing code...
const RegisterView = ({ setView }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const body = { email, password, role: 'customer' };
            const response = await fetch('https://backend-production-7f80.up.railway.app/api/user/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Registration successful! You can now log in.');
                setEmail('');
                setPassword('');
                // setName('');
                setTimeout(() => setView('login'), 2000);
            } else {
                setMessage(data.error || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignup = (provider) => {
        setMessage(`Social signup with ${provider} is not yet implemented. Please use email and password.`);
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">Register</h2>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>


                <div>
                    <label
                        className="block text-gray-700 text-sm font-medium mb-1"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <div className="flex items-center w-full my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-500 text-sm font-medium">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="w-full space-y-2">
                <button
                    onClick={() => handleSocialSignup('Google')}
                    className="w-full bg-white text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition duration-300"
                >
                    <i className="fa-brands fa-google mr-2"></i> Sign Up with Google
                </button>
                <button
                    onClick={() => handleSocialSignup('Facebook')}
                    className="w-full bg-white text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-50 transition duration-300"
                >
                    <i className="fa-brands fa-facebook mr-2"></i> Sign Up with Facebook
                </button>
            </div>

            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            <div className="mt-6 text-center">
                <button
                    onClick={() => setView('login')}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Already have an account? Log In
                </button>
            </div>
        </div>
    );
};

RegisterView.propTypes = {
    setView: PropTypes.func.isRequired,
};

// ==========================================================
// LoginSignup Form Wrapper
// ==========================================================
const LoginSignup = () => {
    const [view, setView] = useState('login');

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
            <header className="w-full max-w-lg mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">TIC-Nnewi</h1>
                <p className="text-lg text-gray-600 mt-2">Your shopping experience starts here.</p>
            </header>
            <main className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
                {view === 'login' ? (
                    <LoginView setView={setView} />
                ) : (
                    <RegisterView setView={setView} />
                )}
            </main>
        </div>
    );
};

export default LoginSignup;
