
import React from 'react';

const ActivityOverview = () => {
    return (
        <div className="activity-overview" style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            marginBottom: '30px'
        }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Activity Overview</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                    <h4 style={{ color: '#7f8c8d', marginBottom: '15px' }}>Requests Breakdown</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                        <span>New Requests</span>
                        <strong style={{ color: '#e74c3c' }}>12</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                        <span>Pending</span>
                        <strong style={{ color: '#f39c12' }}>5</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Completed (This Month)</span>
                        <strong style={{ color: '#2ecc71' }}>45</strong>
                    </div>
                </div>

                <div>
                    <h4 style={{ color: '#7f8c8d', marginBottom: '15px' }}>Account Status</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ flex: 1 }}>Verification Status:</span>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold' }}>Verified ✅</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ flex: 1 }}>Subscription Plan:</span>
                            <span style={{ background: '#fff9e6', color: '#d35400', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold' }}>Premium (Annual)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ flex: 1 }}>Suspension Risk:</span>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold' }}>Safe (0 Reports)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityOverview;
