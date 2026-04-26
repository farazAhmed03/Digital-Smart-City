
import React, { useState } from 'react';

const BusinessProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        businessName: 'Kohat Super Market',
        description: 'Your one-stop shop for all daily needs. Fresh vegetables, groceries, and household items.',
        address: 'Shop # 45, Main Bazaar, Kohat',
        phone: '0333-1234567',
        email: 'info@kohatsupermart.com',
        website: 'www.kohatsupermart.com',
        timings: '09:00 AM - 10:00 PM',
        services: 'Home Delivery, Online Ordering, Bulk Supply',
        category: 'Shops & Retail'
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontFamily: 'Outfit, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0', color: '#15543a' }}>Business Profile</h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                        background: isEditing ? '#e74c3c' : '#32b57e',
                        color: 'white',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="profile-details">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Business Name</label>
                        <input
                            type="text"
                            name="businessName"
                            value={profile.businessName}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={profile.category}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Short Description</label>
                    <textarea
                        name="description"
                        rows="3"
                        value={profile.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                    ></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Website</label>
                        <input
                            type="text"
                            name="website"
                            value={profile.website}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Timings</label>
                        <input
                            type="text"
                            name="timings"
                            value={profile.timings}
                            onChange={handleChange}
                            disabled={!isEditing}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                        />
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Services (Comma Separated)</label>
                    <input
                        type="text"
                        name="services"
                        value={profile.services}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: isEditing ? '#fff' : '#f9f9f9', fontFamily: 'inherit' }}
                    />
                </div>

                {isEditing && (
                    <button style={{ background: '#32b57e', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}>
                        Save Changes
                    </button>
                )}
            </div>
        </div>
    );
};

export default BusinessProfile;
