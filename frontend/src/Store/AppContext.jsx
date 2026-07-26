import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GetUserData, LogoutUserApi } from '../ApiCalls/ApiCalls';
import API_BASE_URL from '../config';

axios.defaults.baseURL = API_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Initial load: check for tokens/login status
    useEffect(() => {
        const checkLoggedIn = async () => {
            // Check for customer
            let customerToken = localStorage.getItem('customerToken');
            if (customerToken) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${customerToken}`;
                    const res = await axios.get('/customer/auth/me');
                    if (res.data.success) {
                        setCustomer(res.data.customer);
                    }
                } catch (error) {
                    console.error('Error verifying customer token', error);
                }
            }

            // Check for general user
            let userLoggedIn = localStorage.getItem("IsLoggedIn");
            if (userLoggedIn) {
                try {
                    GetUserData(setUserData);
                } catch (error) {
                    console.error("User not logged in or session expired", error);
                }
            }

            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = (token, customerData) => {
        localStorage.setItem('customerToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setCustomer(customerData);
    };

    const logout = () => {
        localStorage.removeItem('customerToken');
        delete axios.defaults.headers.common['Authorization'];
        setCustomer(null);

        // General User Logout
        LogoutUserApi(setUserData);
    };

    return (
        <AppContext.Provider value={{ customer, userData, setUserData, login, logout, loading }}>
            {children}
        </AppContext.Provider>
    );
};
