import "./BusinessCategories.css";
import axios from "axios";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FreelancersData } from "../../../Store/Business_store";
import { FaPhone, FaEnvelope, FaClock, FaUserTie, FaLinkedin, FaBehance, FaGlobe } from "react-icons/fa";
import ProductCard from "../../../components/ProductCard/ProductCard";

export const FreelancersPg = () => {

    const [List, setList] = useState(FreelancersData);
    const [Cards, setCards] = useState(FreelancersData);
    const [loading, setLoading] = useState(true);

    const fetchCategoryProfiles = async () => {
        try {
            const res = await axios.get('/business/profile/category/freelancers');
            if (res.data.success && res.data.profiles.length > 0) {
                const dynamicProfiles = res.data.profiles.map(p => ({
                    id: p._id,
                    name: p.businessName,
                    img: p.logo,
                    desc: p.shortDescription,
                    btn_txt: "View Profile",
                    coverImage: p.coverImage,
                    services: p.services ? p.services.split('\n') : [],
                    address: p.contactInfo?.location,
                    contact: {
                        phone: p.contactInfo?.phone,
                        email: p.contactInfo?.email
                    },
                    timings: {
                        opening: p.openingHours ? p.openingHours.split('-')[0] : "09:00 AM",
                        closing: p.openingHours ? p.openingHours.split('-')[1] : "06:00 PM"
                    },
                    products: p.products || [],
                    isDynamic: true
                }));

                setList([...dynamicProfiles, ...FreelancersData]);
                setCards([...dynamicProfiles, ...FreelancersData]);
            }
        } catch (err) {
            console.error("Failed to fetch freelancer profiles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryProfiles();
    }, []);

    let [showList, setShowlist] = useState(false);
    let navigate = useNavigate();

    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const id = query.get("id");

    const selectedItem = id ? List.find(item => String(item.id) === String(id)) : null;

    return (
        <>
            {
                (selectedItem)
                    ?
                    <div className="detail-view-container">
                        <button className="btn-back" onClick={() => navigate(-1)}>← Back to List</button>

                        <div className="detail-header" style={{ backgroundImage: `url(${selectedItem.coverImage || selectedItem.img})` }}>
                            {selectedItem.img && (
                                <img src={selectedItem.img} alt="Business Logo" className="detail-logo" />
                            )}
                            <div className="detail-title-block">
                                <h1>{selectedItem.name}</h1>
                                <div className="detail-meta">
                                    <span>{selectedItem.desc}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-content">
                            <div className="content-main">
                                <div className="info-card">
                                    <h3>Professional Summary</h3>
                                    <p>{selectedItem.desc} I am a dedicated professional with expertise in my field. I offer high-quality freelance services tailored to your project needs.</p>
                                </div>

                                <div className="info-card">
                                    <h3>Competencies & Skills</h3>
                                    <div className="service-tags">
                                        {selectedItem.services ? selectedItem.services.map((s, i) => <span key={i}>{s}</span>) : (
                                            <>
                                                <span>Professional</span>
                                                <span>Experienced</span>
                                                <span>Freelancer</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {selectedItem.products && selectedItem.products.length > 0 && (
                                    <div className="products-section" style={{ marginTop: '30px' }}>
                                        <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: '700', color: '#333' }}>Available Products</h3>
                                        <div className="products-grid" style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                            gap: '20px'
                                        }}>
                                            {selectedItem.products.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="content-sidebar">
                                <div className="info-card">
                                    <h3>Contact Me</h3>
                                    <ul className="info-list" style={{ listStyle: 'none', padding: 0 }}>
                                        <li style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}><FaPhone style={{ color: '#32b57e' }} /> {selectedItem.contact?.phone || "0300-5555555"}</li>
                                        <li style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}><FaEnvelope style={{ color: '#32b57e' }} /> {selectedItem.contact?.email || "freelancer@email.com"}</li>
                                    </ul>
                                </div>

                                <div className="info-card">
                                    <h3>Availability</h3>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                        <FaClock style={{ color: '#32b57e' }} />
                                        <span>{selectedItem.timings?.opening || "09:00 AM"} - {selectedItem.timings?.closing || "06:00 PM"}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        Days: {selectedItem.timings?.workingDays?.join(", ") || "Mon - Fri"}
                                    </div>
                                </div>

                                <div className="info-card">
                                    <h3>Portfolio</h3>
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '1.5rem', color: '#32b57e' }}>
                                        <FaLinkedin style={{ cursor: 'pointer' }} title="LinkedIn Profile" />
                                        <FaBehance style={{ cursor: 'pointer' }} title="Behance Profile" />
                                        <FaGlobe style={{ cursor: 'pointer' }} title="Portfolio Website" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <section className="edu-cata-pg-sec">
                        <div className={(showList) ? "lft-sec showList" : "lft-sec"} >
                            <h2 className="sector" onClick={() => { navigate(`/business`) }}>Business</h2>
                            <div className="institute-hd-lst">
                                <h2 className="institute-hd">Freelancers</h2>
                                <ul className="institute-lst">
                                    {
                                        List.map((v, i) => {
                                            return (
                                                <li onClick={() => { navigate(`?id=${v.id}`); setShowlist(false) }} key={i}>{v.name}</li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="main-sec">
                            <div className="showLstBtn" onClick={() => { setShowlist(!showList) }}>{(showList) ? <>&times;</> : <>&#9776;</>}</div>
                            <div className="cata-pg-banner" style={{ backgroundImage: "url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg')" }}>
                                <h1 className="cata-pg-main-hd">Freelancers & Professionals</h1>
                                <p>Hire top freelancers, consultants, and skilled professionals.</p>
                                <SearchBar SearchedInst={setCards} AllInst={Cards} />
                            </div>
                            <div className="cata-card-cont">
                                {
                                    Cards.map((v, i) => {
                                        return (
                                            <div className="cata-pg-card" key={i}>
                                                <img src={v.img} alt="Placeholder" />
                                                <div className="cata-pg-card-content">
                                                    <h3>{v.name}</h3>
                                                    <p>{v.desc}</p>
                                                    <button onClick={() => { navigate(`?id=${v.id}`) }} className="cata-pg-card-btn">{v.btn_txt}</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    </section >
            }
        </>
    )
}
