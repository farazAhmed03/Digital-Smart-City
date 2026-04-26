
import React from 'react';

const SummaryCards = () => {
    const stats = [
        { label: 'Profile Views', value: '1,245', icon: '👀', color: '#3498db' },
        { label: 'Calls Clicked', value: '87', icon: '📞', color: '#2ecc71' },
        { label: 'WhatsApp', value: '42', icon: '💬', color: '#25D366' },
        { label: 'Rating', value: '4.8', icon: '⭐', color: '#f1c40f' },
    ];

    return (
        <div className="summary-cards-container" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
            {stats.map((stat, index) => (
                <div key={index} style={{
                    flex: 1,
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: `${stat.color}20`,
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        {stat.icon}
                    </div>
                    <div>
                        <h3 style={{ margin: '0', fontSize: '1.5rem', color: '#2c3e50' }}>{stat.value}</h3>
                        <p style={{ margin: '0', color: '#7f8c8d', fontSize: '0.9rem' }}>{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
