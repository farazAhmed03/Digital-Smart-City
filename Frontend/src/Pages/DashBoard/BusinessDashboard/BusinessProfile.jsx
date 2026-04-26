import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSave, FiImage, FiMapPin, FiPhone, FiMail, FiClock, FiGrid, FiList } from 'react-icons/fi';

export const BusinessProfile = () => {
    const initialState = {
        businessName: "",
        category: "",
        shortDescription: "",
        about: "",
        logo: "",
        coverImage: "",
        services: "",
        openingHours: "",
        contactInfo: {
            phone: "",
            email: "",
            website: "",
            location: ""
        }
    };

    const [profile, setProfile] = useState(initialState);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [coverPreview, setCoverPreview] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`/business/profile/get-profile`, { withCredentials: true });
                if (res.data.success && res.data.profile) {
                    setProfile(res.data.profile);
                    setLogoPreview(res.data.profile.logo || "");
                    setCoverPreview(res.data.profile.coverImage || "");
                }
            } catch (err) {

                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfile(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'logo') {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
            } else if (type === 'coverImage') {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!profile.category) {
            return toast.error("Please select a business category");
        }
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('businessName', profile.businessName);
            formData.append('category', profile.category);
            formData.append('shortDescription', profile.shortDescription);
            formData.append('about', profile.about);
            formData.append('services', profile.services);
            formData.append('openingHours', profile.openingHours);
            formData.append('contactInfo', JSON.stringify(profile.contactInfo));

            if (logoFile) {
                formData.append('logo', logoFile);
            } else {
                formData.append('logo', profile.logo);
            }

            if (coverFile) {
                formData.append('coverImage', coverFile);
            } else {
                formData.append('coverImage', profile.coverImage);
            }

            const res = await axios.put(`/business/profile/update-profile`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {

                toast.success("Profile saved successfully");
                // Construct the link based on category
                const categoryLink = profile.category.split('_')[0]; // e.g., shops_retail -> shops
                navigate(`/business/${categoryLink}`);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="biz-loading">Loading Profile...</div>;

    return (
        <div className="biz-profile-container">
            <h2 className="fd-section-title">Public Profile Management</h2>
            <p className="fd-section-subtitle">The information here will be displayed on the public website based on your selected category.</p>

            <form className="fd-profile-form" onSubmit={handleUpdate}>

                {/* Section: Images */}
                <div className="fd-card">
                    <h3 className="fd-form-section-title"><FiImage /> Business Images</h3>
                    <div className="fd-grid-2">
                        <div className="fd-form-group">
                            <label>Cover Image</label>
                            <input type="file" className="fd-input" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImage')} />
                            {coverPreview && <div className="biz-img-preview cover"><img src={coverPreview} alt="Cover Preview" /></div>}
                        </div>
                        <div className="fd-form-group">
                            <label>Logo / Profile Photo</label>
                            <input type="file" className="fd-input" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                            {logoPreview && <div className="biz-img-preview logo"><img src={logoPreview} alt="Logo Preview" /></div>}
                        </div>
                    </div>
                </div>


                {/* Section: Basic Info */}
                <div className="fd-card">
                    <h3 className="fd-form-section-title"><FiGrid /> Business Information</h3>
                    <div className="fd-grid-2">
                        <div className="fd-form-group">
                            <label>Business Name</label>
                            <input type="text" className="fd-input" name="businessName" value={profile.businessName} onChange={handleChange} required />
                        </div>
                        <div className="fd-form-group">
                            <label>Business Category</label>
                            <select className="fd-input" name="category" value={profile.category} onChange={handleChange} required>
                                <option value="">Select Category ▼</option>
                                <option value="shops_retail">Shops & Retail</option>
                                <option value="offices_companies">Offices & Companies</option>
                                <option value="manufacturing_industry">Manufacturing & Industry</option>
                                <option value="freelancers">Freelancers</option>
                                <option value="events_entertainment">Events & Entertainment</option>
                            </select>
                        </div>
                    </div>
                    <div className="fd-form-group">
                        <label>Short Description</label>
                        <input type="text" className="fd-input" name="shortDescription" value={profile.shortDescription} onChange={handleChange} placeholder="Brief summary of your business" required />
                    </div>
                    <div className="fd-form-group">
                        <label>About</label>
                        <textarea className="fd-textarea" name="about" value={profile.about} onChange={handleChange} placeholder="Detailed description of your business" rows="4" required></textarea>
                    </div>
                </div>

                {/* Section: Services & Hours */}
                <div className="fd-grid-2">
                    <div className="fd-card">
                        <h3 className="fd-form-section-title"><FiList /> Services</h3>
                        <div className="fd-form-group">
                            <label>List your services (one per line)</label>
                            <textarea className="fd-textarea" name="services" value={profile.services} onChange={handleChange} placeholder="Laptop Repair&#10;Electronics Sales&#10;Mobile Accessories" rows="5"></textarea>
                        </div>
                    </div>
                    <div className="fd-card">
                        <h3 className="fd-form-section-title"><FiClock /> Opening Hours</h3>
                        <div className="fd-form-group">
                            <label>Operating Schedule</label>
                            <textarea className="fd-textarea" name="openingHours" value={profile.openingHours} onChange={handleChange} placeholder="Monday – Friday : 9AM – 8PM&#10;Saturday : 10AM – 6PM&#10;Sunday : Closed" rows="5"></textarea>
                        </div>
                    </div>
                </div>

                {/* Section: Contact Info */}
                <div className="fd-card">
                    <h3 className="fd-form-section-title"><FiPhone /> Contact Information</h3>
                    <div className="fd-grid-2">
                        <div className="fd-form-group">
                            <label>Phone Number</label>
                            <input type="text" className="fd-input" name="contactInfo.phone" value={profile.contactInfo?.phone} onChange={handleChange} required />
                        </div>
                        <div className="fd-form-group">
                            <label>Email Address</label>
                            <input type="email" className="fd-input" name="contactInfo.email" value={profile.contactInfo?.email} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="fd-grid-2">
                        <div className="fd-form-group">
                            <label>Website (Optional)</label>
                            <input type="text" className="fd-input" name="contactInfo.website" value={profile.contactInfo?.website} onChange={handleChange} placeholder="www.yourbusiness.com" />
                        </div>
                        <div className="fd-form-group">
                            <label><FiMapPin /> Location / Address</label>
                            <input type="text" className="fd-input" name="contactInfo.location" value={profile.contactInfo?.location} onChange={handleChange} placeholder="Main Bazar Kohat, KPK Pakistan" required />
                        </div>
                    </div>
                </div>

                <div className="biz-form-actions">
                    <button type="submit" className="fd-btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem' }}>
                        <FiSave /> {saving ? "Saving..." : "Save Public Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
};
