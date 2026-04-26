
import React from 'react';

const CustomerRequests = () => {
    const requests = [
        { id: 1, name: 'Ali Khan', type: 'Product Inquiry', date: 'Today, 10:30 AM', status: 'New', area: 'KDA Sector 9' },
        { id: 2, name: 'Saima B.', type: 'Home Delivery', date: 'Yesterday', status: 'In Progress', area: 'City Center' },
        { id: 3, name: 'Tariq Mehmood', type: 'Service Booking', date: '2 days ago', status: 'Closed', area: 'Rawalpindi Road' },
    ];

    const getStatusColor = (status) => {
        if (status === 'New') return '#e74c3c';
        if (status === 'In Progress') return '#f39c12';
        return '#27ae60';
    };

    return (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Recent Customer Requests
                <button style={{ fontSize: '0.9rem', padding: '5px 15px', border: '1px solid #ddd', background: 'none', borderRadius: '5px', cursor: 'pointer' }}>View All</button>
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8f9fa', color: '#7f8c8d' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Request Type</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Area</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px', fontWeight: '500' }}>{req.name} <br /> <span style={{ fontSize: '0.8rem', color: '#999' }}>{req.date}</span></td>
                            <td style={{ padding: '12px' }}>{req.type}</td>
                            <td style={{ padding: '12px' }}>{req.area}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    color: getStatusColor(req.status),
                                    background: `${getStatusColor(req.status)}15`,
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '0.85rem'
                                }}>
                                    {req.status}
                                </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                                <button style={{ border: 'none', background: '#3498db', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerRequests;
