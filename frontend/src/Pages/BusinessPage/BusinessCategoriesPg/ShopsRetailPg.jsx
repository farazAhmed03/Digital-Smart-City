import "./BusinessCategories.css";
import axios from "axios";
import { SearchBar } from "../../../components/SearchBar/Searchbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopsData } from "../../../Store/Business_store";
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaFacebook, FaInstagram, FaGlobe } from "react-icons/fa";
import ProductCard from "../../../components/ProductCard/ProductCard";

export const ShopsRetailPg = () => {

    const [List, setList] = useState(ShopsData);
    const [Cards, setCards] = useState(ShopsData);
    const [loading, setLoading] = useState(true);
    const [businessReviews, setBusinessReviews] = useState([]);

    const fetchCategoryProfiles = async () => {
        try {
            const res = await axios.get('/business/profile/category/shops_retail');
            if (res.data.success && res.data.profiles.length > 0) {
                // Map backend profiles to match the expected structure of ShopsData
                const dynamicProfiles = res.data.profiles.map(p => ({
                    id: p._id, // Use string ID from mongo
                    businessId: p.businessId, // needed for fetching reviews
                    name: p.businessName,
                    img: p.logo,
                    desc: p.shortDescription,
                    btn_txt: "Read More",
                    coverImage: p.coverImage,
                    services: p.services ? p.services.split('\n') : [],
                    address: p.contactInfo?.location,
                    contact: {
                        phone: p.contactInfo?.phone,
                        email: p.contactInfo?.email
                    },
                    timings: {
                        opening: p.openingHours ? p.openingHours.split('-')[0] : "09:00 AM",
                        closing: p.openingHours ? p.openingHours.split('-')[1] : "10:00 PM"
                    },
                    products: p.products || [],
                    isDynamic: true // Flag to distinguish from static
                }));


                // Combine with static data but filter out any static ones that might be "duplicates" if we wanted
                setList([...dynamicProfiles, ...ShopsData]);
                setCards([...dynamicProfiles, ...ShopsData]);
            }
        } catch (err) {
            console.error("Failed to fetch shop profiles:", err);
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

    // Find item in our combined list
    const selectedItem = id ? List.find(item => String(item.id) === String(id)) : null;

    // Fetch reviews for selected business when it's a dynamic (backend) business
    useEffect(() => {
        if (selectedItem && selectedItem.isDynamic && selectedItem.businessId) {
            axios.get(`/business/reviews/public/${selectedItem.businessId}`)
                .then(res => {
                    if (res.data.success) setBusinessReviews(res.data.data);
                })
                .catch(() => setBusinessReviews([]));
        } else {
            setBusinessReviews([]);
        }
    }, [selectedItem?.id]);

    // Get reviews for a specific product by name
    const getProductReviews = (productName) => {
        const match = businessReviews.find(p => p.productName === productName);
        return match ? match.reviews : [];
    };

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
                                    <h3>About</h3>
                                    <p>{selectedItem.desc} We are dedicated to providing the best quality products for our customers. Visit us to explore our wide range of items.</p>
                                </div>

                                <div className="info-card">
                                    <h3>Services & Products</h3>
                                    <div className="service-tags">
                                        {/* Use services from data if available, else dummy */}
                                        {selectedItem.services ? selectedItem.services.map((s, i) => <span key={i}>{s}</span>) : (
                                            <>
                                                <span>In-Store Shopping</span>
                                                <span>Quality Assurance</span>
                                                <span>Customer Support</span>
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
                                                <ProductCard key={product.id} product={product} reviews={getProductReviews(product.title)} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="content-sidebar">
                                <div className="info-card">
                                    <h3>Contact Info</h3>
                                    <ul className="info-list" style={{ listStyle: 'none', padding: 0 }}>
                                        <li style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}><FaPhone style={{ color: '#32b57e' }} /> {selectedItem.contact?.phone || "0300-1234567"}</li>
                                        <li style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}><FaEnvelope style={{ color: '#32b57e' }} /> {selectedItem.contact?.email || "info@shop.com"}</li>
                                        <li style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}><FaGlobe style={{ color: '#32b57e' }} /> www.website.com</li>
                                        <li style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}><FaMapMarkerAlt style={{ color: '#32b57e' }} /> {selectedItem.address || "Main Bazaar, Kohat"}</li>
                                    </ul>
                                </div>

                                <div className="info-card">
                                    <h3>Opening Hours</h3>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                        <FaClock style={{ color: '#32b57e' }} />
                                        <span>{selectedItem.timings?.opening || "09:00 AM"} - {selectedItem.timings?.closing || "10:00 PM"}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        Open: {selectedItem.timings?.workingDays?.join(", ") || "Mon - Sat"}
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
                                <h2 className="institute-hd">Shops</h2>
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
                            <div className="cata-pg-banner" style={{ backgroundImage: "url('https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg')" }}>
                                <h1 className="cata-pg-main-hd">Popular Shops in Kohat</h1>
                                <p>Discover the best retail outlets and shops for your daily needs.</p>
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
