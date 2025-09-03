import { createContext, useState, useContext } from 'react';

// Create the Context (but we won't export it directly)
const UserContext = createContext(null);

// Create the Provider component to manage the shared state.
export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = localStorage.getItem('authToken');
        return !!token;
    });
    const [userEmail, setUserEmail] = useState(() => {
        return localStorage.getItem('userEmail');
    });

    // Sync state with localStorage on mount (in case of manual changes)
    // This is optional, but ensures state is always correct
    // useEffect is not strictly necessary here since we use lazy initial state
    // The login function
    const login = (email, token) => {
        setIsLoggedIn(true);
        setUserEmail(email);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);
    };

    // The logout function
    const logout = () => {
        setIsLoggedIn(false);
        setUserEmail(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
    };

    const contextValue = {
        isLoggedIn,
        userEmail,
        login,
        logout,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

// Create a custom hook to make it easy for components to use the context.
// We export this hook instead of the raw context.
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
