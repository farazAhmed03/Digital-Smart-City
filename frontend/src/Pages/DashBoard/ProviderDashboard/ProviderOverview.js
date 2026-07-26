
import React from 'react';
import SummaryCards from './Components/SummaryCards';
import ActivityOverview from './Components/ActivityOverview';
import CustomerRequests from './Components/CustomerRequests';

export const ProviderOverview = () => {
    return (
        <div>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Dashboard Overview</h2>
            <SummaryCards />
            <ActivityOverview />
            <CustomerRequests />
        </div>
    );
};
