import "./FoodLandingPage.css";
import { useNavigate } from "react-router-dom";
import {
    FaPhone, FaEnvelope, FaGlobe, FaClock, FaStar, FaMapMarkerAlt,
    FaTruck, FaShoppingCart, FaTrash, FaCheckCircle, FaUtensils,
    FaChair, FaCalendarAlt, FaUserFriends, FaStickyNote, FaInfoCircle
} from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { PlaceOrderApi, GetTheFoodData, BookTableApi, ChangeRatingData, ReportServiceLandingApi } from "../../../ApiCalls/ApiCalls";
import { toast } from "react-toastify";
import { AppContext } from "../../../Store/AppContext";
import AutofillNote from "../../../components/AutofillNote/AutofillNote";
import { isCurrentlyOpen } from "../../../utils/timeUtils";

export const FoodLandingPage = ({ id, Alldata }) => {
    const navigate = useNavigate();
    const { userData } = useContext(AppContext);
    const [cart, setCart] = useState([]);
    const [orderStatus, setOrderStatus] = useState(null);
    const [reservationStatus, setReservationStatus] = useState(null);
    const [activeTab, setActiveTab] = useState('delivery'); // 'delivery' or 'booking'
    const [dbItem, setDbItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    // Review Form States
    const [selectedRating, setSelectedRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);

    // Form states for pre-filling
    const [orderForm, setOrderForm] = useState({ fullName: "", phone: "", address: "" });
    const [bookingForm, setBookingForm] = useState({ resName: "", resContact: "" });
    const [reviewForm, setReviewForm] = useState({ name: "", comment: "" });
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

    useEffect(() => {
        if (userData) {
            setOrderForm({
                fullName: userData.fullName || "",
                phone: userData.phone || "",
                address: userData.address || ""
            });
            setBookingForm({
                resName: userData.fullName || "",
                resContact: userData.phone || ""
            });
            setReviewForm(prev => ({
                ...prev,
                name: userData.fullName || ""
            }));
        }
    }, [userData]);

    // Initial check in static data
    const staticItem = Alldata.find(v => String(v.id) === String(id));

    const normalizeService = (data) => {
        if (!data) return data;
        const offersValue =
            data.offersReservation ??
            data.quickInfo?.offersReservation ??
            data.quickInfo?.offersTableReservation;

        const offersReservation = (() => {
            if (typeof offersValue === "string") {
                const v = offersValue.toLowerCase();
                if (["no", "false", "off", "0"].includes(v)) return false;
                if (["yes", "true", "on", "1"].includes(v)) return true;
            }
            // default to true unless explicitly false
            return offersValue === false ? false : true;
        })();

        return {
            ...data,
            offersReservation,
        };
    };

    useEffect(() => {
        if (id && String(id).length > 20) {
            setLoading(true);
            GetTheFoodData(id, (data) => {
                setDbItem(normalizeService(data));
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [id]);

    const item = normalizeService(dbItem || staticItem || {});
    const serviceId = item.id || item._id || id;

    const timingString = item.timings?.opening || item.quickInfo?.timings?.opening || item.quickInfo?.timings?.timing || "";
    const derivedIsOpen = isCurrentlyOpen(timingString);

    if (loading) return <div className="fd-loading">Loading Restaurant Details...</div>;
    if (!item || Object.keys(item).length === 0) return <div className="error-msg">Information not found.</div>;

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(i => i.id !== productId));
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, curr) => acc + (Number(curr.price) * curr.quantity), 0);
        return subtotal - discount;
    };

    const applyPromoCode = () => {
        if (!promoCode) return;
        const promos = Array.isArray(item.promotions) ? item.promotions : [];
        const promo = promos.find(p => p.code?.toLowerCase() === promoCode.toLowerCase() && p.status === "active");
        if (promo) {
            const subtotal = cart.reduce((acc, curr) => acc + (Number(curr.price) * curr.quantity), 0);
            const discAmt = promo.type === "discount" ? (subtotal * (parseFloat(promo.value) / 100)) : parseFloat(promo.value);
            setDiscount(discAmt);
            alert(`Promo applied! You saved Rs. ${discAmt}`);
        } else {
            alert("Invalid or expired promo code.");
            setDiscount(0);
        }
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        if (!localStorage.getItem("IsLoggedIn")) {
            toast.info("Please log in to place an order.");
            navigate("/user/login");
            return;
        }

        if (!derivedIsOpen) {
            alert(`Sorry, ${item.name} is currently closed and not accepting orders according to their timings.`);
            return;
        }

        if (!cart.length) {
            alert("Add at least one item before placing an order.");
            return;
        }
        if (!serviceId || String(serviceId).length !== 24) {
            alert("Invalid service id. Please refresh and try again.");
            return;
        }

        const orderData = {
            orderID: `ORD-${Math.floor(Math.random() * 1000000)}`,
            serviceId,
            shopName: item.name,
            items: cart.map(i => ({ name: i.name, qty: i.quantity, subtotal: Number(i.price) * i.quantity })),
            total: calculateTotal(),
            paymentMethod: e.target.paymentMethod.value === "cod" ? "Cash on Delivery" : "Online Payment",
            specialInstructions: e.target.specialInstructions.value,
            status: "Pending",
            timestamp: new Date().toLocaleString(),
            userDetails: {
                name: e.target.fullName.value,
                phone: e.target.phone.value,
                address: e.target.address.value
            }
        };

        PlaceOrderApi(orderData)
            .then(res => {
                if (res.data.success) {
                    setOrderStatus(`Order placed successfully! Total: Rs. ${orderData.total}`);
                    setCart([]);
                    alert(`Order Confirmed at ${item.name}!\nTotal: Rs. ${orderData.total}\nOrder ID: ${orderData.orderID}`);
                    setTimeout(() => setOrderStatus(null), 5000);
                } else {
                    alert("Failed to place order: " + res.data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Something went wrong while placing the order.");
            });
    };

    const handleTableBooking = (e) => {
        e.preventDefault();

        if (!localStorage.getItem("IsLoggedIn")) {
            toast.info("Please log in to book a table.");
            navigate("/user/login");
            return;
        }
        const bookingData = {
            serviceId,
            shopName: item.name,
            date: e.target.date.value,
            time: e.target.time.value,
            guests: e.target.guests.value,
            specialRequest: e.target.specialRequest.value,
            customerName: e.target.resName.value,
            contact: e.target.resContact.value
        };

        BookTableApi(bookingData)
            .then(res => {
                if (res.data.success) {
                    setReservationStatus(`Table Booked successfully for ${bookingData.guests} guests!`);
                    alert(`Table Reserved!\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nReference: ${res.data.bookingId}`);
                    e.target.reset();
                } else {
                    alert("Failure: " + res.data.message);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Something went wrong with the reservation.");
            });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        
        if (!serviceId || String(serviceId).length !== 24) {
            return toast.info("Reviews are only available for verified community listings.");
        }

        const rating = selectedRating;
        const { name, comment } = reviewForm;

        if (!name) return toast.warning("Please provide your name.");
        if (isReviewSubmitting) return;

        const reviewObj = {
            id: Date.now(),
            name,
            rating,
            comment,
            timestamp: new Date().toISOString(),
            img: userData?.img || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
        };

        setIsReviewSubmitting(true);
        ChangeRatingData(reviewObj, serviceId, (newRatingData, newReviews) => {
            setIsReviewSubmitting(false);
            setReviewForm({ name: userData?.fullName || "", comment: "" });
            setSelectedRating(5);
            setDbItem(prev => ({
                ...prev,
                ratingData: newRatingData,
                detailedReviews: newReviews
            }));
        }, "FOOD");
    };

    const renderInteractiveStars = () => {
        return (
            <div className="star-rating-input">
                <label>Your Rating</label>
                <div className="stars-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                            key={star}
                            className={`interactive-star ${(hoverRating || selectedRating) >= star ? 'active' : ''} ${hoverRating === star ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setSelectedRating(star)}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const handleReportSubmit = (e) => {
        e.preventDefault();
        const reportData = {
            id,
            reason: e.target.reason.value,
            details: e.target.details.value,
            reporterName: e.target.reporterName.value
        };

        ReportServiceLandingApi(reportData)
            .then(res => {
                if (res.data.success) {
                    alert(res.data.message);
                    setIsReportModalOpen(false);
                } else {
                    alert(res.data.message);
                }
            })
            .catch(err => alert("Failed to submit report."));
    };

    return (
        <section className="FoodLanding">
            {/* HERO SECTION */}
            <div className="FoodHero" style={{ backgroundImage: (item.img || item.aboutImage) ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${item.img || item.aboutImage})` : `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))` }}>
                <div className="HeroContent">
                    <div className="HeroBadges">
                        {item.verifiedBadge && <span className="badge verified"><FaCheckCircle /> Verified</span>}
                        {item.hygieneRating && <span className="badge hygiene">Hygiene: {item.hygieneRating}</span>}
                        <span className={`badge status ${derivedIsOpen ? 'open' : 'closed'}`}>
                            {derivedIsOpen ? 'Open Now' : 'Closed'}
                        </span>
                    </div>
                    <h1>{item.name}</h1>
                    <p className="tagline">{item.tagline}</p>
                    <button className="fd-back-btn" onClick={() => navigate(-1)}>Back to List</button>
                </div>
            </div>

            <div className="FoodContainer">
                {/* ABOUT & QUICK INFO */}
                <div className="MainGrid">
                    <div className="InfoSection">
                        <h2 className="section-title">About Us</h2>
                        <p className="about-text">{item.about}</p>

                        <div className="QuickInfoGrid">
                            <div className="InfoCard">
                                <FaClock className="info-icon" />
                                <div>
                                    <h4>Timings</h4>
                                    <p>{item.timings?.opening || item.quickInfo?.timings?.opening || item.quickInfo?.timings?.timing || "Contact for timings"}</p>
                                </div>
                            </div>
                            <div className="InfoCard">
                                <FaMapMarkerAlt className="info-icon" />
                                <div>
                                    <h4>Location</h4>
                                    <p>{item.quickInfo?.basicProfile?.location || "Kohat"}</p>
                                </div>
                            </div>
                            <div className="InfoCard">
                                <FaTruck className="info-icon" />
                                <div>
                                    <h4>Delivery</h4>
                                    <p>{item.deliveryAvailability || "Not Specified"}</p>
                                </div>
                            </div>
                            {item.inspectionStatus && (
                                <div className="InfoCard">
                                    <FaInfoCircle className="info-icon" />
                                    <div>
                                        <h4>Inspection</h4>
                                        <p>{item.inspectionStatus}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="ContactSidebar">
                        <h3>Contact & Order Info</h3>
                        <div className="ContactLinks">
                            <a href={`tel:${item.contact?.phone}`} className="contact-item">
                                <FaPhone /> {item.contact?.phone}
                            </a>
                            <a href={`mailto:${item.contact?.email}`} className="contact-item">
                                <FaEnvelope /> {item.contact?.email}
                            </a>
                            <a
                                href={item.contact?.website || "#"}
                                onClick={(e) => { if (!item.contact?.website) e.preventDefault(); }}
                                target={item.contact?.website ? "_blank" : "_self"}
                                rel="noreferrer"
                                className="contact-item"
                                style={{ cursor: item.contact?.website ? "pointer" : "default", opacity: item.contact?.website ? 1 : 0.6 }}
                            >
                                <FaGlobe /> {item.contact?.website ? "Website" : "Website (Not Available)"}
                            </a>
                        </div>
                        <div className="rating-box">
                            <FaStar className="star-icon" />
                            {(() => {
                                const ratingArr = Array.isArray(item.ratingData) ? item.ratingData : [];
                                const avg = ratingArr.length > 0
                                    ? (ratingArr.reduce((acc, curr) => acc + Number(curr.rating || curr), 0) / ratingArr.length).toFixed(1)
                                    : (item.ratingData?.average ? Number(item.ratingData.average).toFixed(1) : "4.8");
                                const count = ratingArr.length || item.ratingData?.totalReviews || 150;
                                return (
                                    <>
                                        <span>{avg} / 5.0</span>
                                        <small>(Based on {count} reviews)</small>
                                    </>
                                );
                            })()}
                        </div>
                        <button className="report-service-btn" onClick={() => setIsReportModalOpen(true)}>
                            <FaInfoCircle /> Report this Service
                        </button>
                    </div>
                </div>

                {/* PROMOTIONS & DEALS */}
                {item.promotions && item.promotions.length > 0 && (
                    <section className="PromotionsSection">
                        <h2 className="section-title">Exclusive Deals & Offers</h2>
                        <div className="PromotionsGrid">
                            {item.promotions.filter(p => p.status === "active").map((promo, idx) => (
                                <div key={idx} className="PromoCard">
                                    <div className="PromoBadge">{promo.value} OFF</div>
                                    <div className="PromoContent">
                                        <h3>{promo.title}</h3>
                                        <p>{promo.type === "discount" ? "Save on your entire order" : "Special offer available"}</p>
                                        <div className="PromoCode">
                                            <span>Use Code:</span>
                                            <strong>{promo.code}</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* MENU & ORDER SYSTEM SIDE-BY-SIDE */}
                <div className="MenuOrderLayout">
                    {/* LEFT SIDE: MENU */}
                    <section className="MenuSide">
                        <div className="MenuHeader">
                            <h2>Our Signature Menu</h2>
                            <p>Explore our curated selection of fine dishes and deals.</p>
                        </div>

                        <div className="MenuCategoriesList">
                            {item.categorizedMenu && item.categorizedMenu.length > 0 ? (
                                item.categorizedMenu.map((cat, catIdx) => (
                                    <div key={catIdx} className="MenuCategoryBlock">
                                        <h3 className="CategoryTitle">{cat.categoryName}</h3>
                                        <div className="MenuItemsGrid">
                                            {cat.items.map((menuItem) => (
                                                <div key={menuItem.id} className="MenuItemCardNew">
                                                    <div className="ItemImageWrapper">
                                                        <img src={menuItem.img} alt={menuItem.name} />
                                                        {menuItem.tags && menuItem.tags.map((tag, tIdx) => (
                                                            <span key={tIdx} className={`item-tag tag-${tag.toLowerCase()}`}>{tag}</span>
                                                        ))}
                                                        {menuItem.isAvailable === false && (
                                                            <span className="item-tag tag-unavailable">Out of Stock</span>
                                                        )}
                                                    </div>
                                                    <div className="ItemDetails">
                                                        <div className="ItemTitlePrice">
                                                            <h4>{menuItem.name}</h4>
                                                            <span className="ItemPrice">Rs. {menuItem.price}</span>
                                                        </div>
                                                        <p className="ItemDesc">{menuItem.desc || menuItem.description}</p>
                                                        {menuItem.variants && (
                                                            <div className="ItemVariants">
                                                                <span>Variants:</span>
                                                                <div className="VariantBadges">
                                                                    {menuItem.variants.map((v, vIdx) => (
                                                                        <span key={vIdx} className="v-badge">{v}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button
                                                            className="AddToCartBtn"
                                                            onClick={() => addToCart(menuItem)}
                                                            disabled={menuItem.isAvailable === false || !derivedIsOpen}
                                                        >
                                                            {menuItem.isAvailable === false ? "Out of Stock" : !derivedIsOpen ? "Closed" : "Add to Order"}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="MenuItemsGrid">
                                    {(item.menu || []).map((menuItem) => (
                                        <div key={menuItem.id} className="MenuItemCardNew">
                                            <div className="ItemImageWrapper">
                                                <img src={menuItem.img || "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"} alt={menuItem.name} />
                                                <span className={`item-tag ${menuItem.isAvailable ? "tag-fresh" : "tag-unavailable"}`}>
                                                    {menuItem.isAvailable ? "Available" : "Out of Stock"}
                                                </span>
                                            </div>
                                            <div className="ItemDetails">
                                                <div className="ItemTitlePrice">
                                                    <h4>{menuItem.name}</h4>
                                                    <span className="ItemPrice">Rs. {menuItem.price}</span>
                                                </div>
                                                <p className="ItemDesc">{menuItem.desc || menuItem.description}</p>
                                                <button
                                                    className="AddToCartBtn"
                                                    onClick={() => addToCart(menuItem)}
                                                    disabled={menuItem.isAvailable === false || !derivedIsOpen}
                                                >
                                                    {menuItem.isAvailable === false ? "Out of Stock" : !derivedIsOpen ? "Closed" : "Add to Order"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* RIGHT SIDE: STICKY SIDEBAR (Tabs) */}
                    <aside className="OrderSidebar" id="order-section">
                        <div className="SidebarTabs">
                            <button
                                className={`tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
                                onClick={() => setActiveTab('delivery')}
                            >
                                <FaTruck /> Order Delivery
                            </button>
                            {item.offersReservation && (
                                <button
                                    className={`tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('booking')}
                                >
                                    <FaChair /> Book Table
                                </button>
                            )}
                        </div>

                        <div className="StickyOrderCard">
                            {activeTab === 'delivery' ? (
                                <>
                                    <h2 className="sidebar-title">Your Order</h2>
                                    {cart.length === 0 ? (
                                        <div className="EmptyCartState">
                                            <FaShoppingCart className="empty-icon" />
                                            <p>Your cart is empty. Browse the menu to add delicious items!</p>
                                        </div>
                                    ) : (
                                        <div className="ActiveCart">
                                            <div className="CartItemsList">
                                                {cart.map((c) => (
                                                    <div key={c.id} className="SideCartItem">
                                                        <div className="item-txt">
                                                            <span className="item-name">{c.name}</span>
                                                            <span className="item-qty">x {c.quantity}</span>
                                                        </div>
                                                        <div className="item-price-remove">
                                                            <span>Rs. {Number(c.price) * c.quantity}</span>
                                                            <button className="small-remove" onClick={() => removeFromCart(c.id)}>
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="CartTotalBox">
                                                <span>Total Amount</span>
                                                <strong>Rs. {calculateTotal()}</strong>
                                            </div>
                                            <hr />
                                            <div className="CheckoutForm">
                                                <h3>Checkout Details</h3>
                                                <form className="order-form-side" onSubmit={handlePlaceOrder}>
                                                    <AutofillNote />
                                                    <input type="text" name="fullName" placeholder="Full Name" value={orderForm.fullName} onChange={(e) => setOrderForm({ ...orderForm, fullName: e.target.value })} required />
                                                    <input type="tel" name="phone" placeholder="Phone Number" value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} required />
                                                    <textarea name="address" placeholder="Delivery Address" value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} required></textarea>
                                                    <div className="form-group-side">
                                                        <label>Payment Method</label>
                                                        <select name="paymentMethod" required>
                                                            <option value="cod">Cash on Delivery</option>
                                                            <option value="online">Online Payment</option>
                                                        </select>
                                                    </div>
                                                    <textarea name="specialInstructions" placeholder="Special Instructions (e.g. less spicy, extra sauce)" rows="2"></textarea>
                                                    <div className="PromoInputGroup">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Promo Code"
                                                            value={promoCode}
                                                            onChange={(e) => setPromoCode(e.target.value)}
                                                        />
                                                        <button type="button" onClick={applyPromoCode}>Apply</button>
                                                    </div>
                                                    {discount > 0 && (
                                                        <div className="DiscountInfo">
                                                            <span>Discount Applied:</span>
                                                            <strong>- Rs. {discount}</strong>
                                                        </div>
                                                    )}
                                                    {orderStatus && <p className="success-msg-side">{orderStatus}</p>}
                                                    <button className="submit-order-btn" type="submit" disabled={!derivedIsOpen}>
                                                        {derivedIsOpen ? "Confirm & Order" : "Restaurant Currently Closed"}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* BOOKING TAB */
                                <div className="BookingSection">
                                    <h2 className="sidebar-title">Reserve a Table</h2>
                                    <p className="booking-desc">Book your spot at {item.name} in advance.</p>
                                    <form className="booking-form" onSubmit={handleTableBooking}>
                                        <AutofillNote />
                                        <div className="form-group">
                                            <label><FaCalendarAlt /> Date</label>
                                            <input type="date" name="date" required min={new Date().toISOString().split('T')[0]} />
                                        </div>
                                        <div className="form-group">
                                            <label><FaClock /> Time</label>
                                            <input type="time" name="time" required />
                                        </div>
                                        <div className="form-group">
                                            <label><FaUserFriends /> Guests</label>
                                            <input type="number" name="guests" min="1" max="20" placeholder="Number of Guests" required />
                                        </div>
                                        <div className="form-group">
                                            <label><FaStickyNote /> Special Request</label>
                                            <textarea name="specialRequest" placeholder="Birthday, Anniversary, Corner Table..." rows="2"></textarea>
                                        </div>
                                        <hr />
                                        <div className="form-group">
                                            <input type="text" name="resName" placeholder="Your Name" value={bookingForm.resName} onChange={(e) => setBookingForm({ ...bookingForm, resName: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <input type="tel" name="resContact" placeholder="Contact Number" value={bookingForm.resContact} onChange={(e) => setBookingForm({ ...bookingForm, resContact: e.target.value })} required />
                                        </div>

                                        {reservationStatus && <p className="success-msg-side">{reservationStatus}</p>}
                                        <button className="submit-order-btn booking-btn" type="submit">
                                            Confirm Reservation
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>

                {/* VISUAL & FACILITIES SECTIONS */}
                <section className="MenuSection">
                    <h2 className="section-title">Specialties & Facilities</h2>
                    <div className="ChipsContainer">
                        {item.quickInfo?.facilities?.map((f, i) => (
                            <span key={i} className="facility-chip">{f}</span>
                        ))}
                        {item.quickInfo?.extraActivities?.map((a, i) => (
                            <span key={i} className="activity-chip">{a}</span>
                        ))}
                    </div>
                </section>

                <section className="GallerySection">
                    <h2 className="section-title">Photo Gallery</h2>
                    <div className="GalleryGrid">
                        {item.gallery?.map((img, i) => (
                            <div key={i} className="gallery-item">
                                <img src={img} alt={`${item.name} gallery ${i}`} />
                            </div>
                        ))}
                    </div>
                </section>


                <section className="ReviewsSection feedback-modern">
                    <h2 className="section-title">Customer Feedback</h2>

                    {/* Add Review Form */}
                    <div className="AddReviewForm feedback-modern">
                        <div className="form-header">
                            <h3>Write a Review</h3>
                            <p>Share your experience with the community</p>
                        </div>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="form-row">
                                <input 
                                    type="text" 
                                    name="reviewerName" 
                                    placeholder="Your Name" 
                                    value={reviewForm.name} 
                                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                    required 
                                />
                                {renderInteractiveStars()}
                            </div>
                            <textarea 
                                name="comment" 
                                placeholder="Share your experience..." 
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                required 
                                rows="4"
                            ></textarea>
                            <button type="submit" className="submit-review-btn" disabled={isReviewSubmitting}>
                                {isReviewSubmitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>

                    <div className="ReviewsGrid feedback-modern">
                        {[
                            ...(Array.isArray(item.detailedReviews) ? item.detailedReviews : []),
                            ...(Array.isArray(item.quickInfo?.parentReviews) ? item.quickInfo.parentReviews : [])
                        ].map((rev, i) => {
                            const isDetailed = typeof rev === 'object';
                            const ratingVal = isDetailed ? Number(rev.rating) : 5;
                            const reviewDate = isDetailed ? (rev.date || rev.timestamp) : null;
                            return (
                                <div key={i} className="ReviewCard feedback-modern">
                                    <div className="ReviewHeader modern">
                                        <div className="ReviewerLeft">
                                            <img
                                                src={isDetailed ? (rev.img || "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg") : "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"}
                                                alt={isDetailed ? rev.name : "Customer"}
                                                className="ReviewerImg"
                                            />
                                            <div className="ReviewerInfo">
                                                <h4>{isDetailed ? (rev.name || "Verified Customer") : "Verified Customer"}</h4>
                                                <div className="stars">
                                                    {[...Array(5)].map((_, sIdx) => (
                                                        <FaStar key={sIdx} className={sIdx < Math.max(1, Math.min(5, ratingVal || 0)) ? "filled" : ""} />
                                                    ))}
                                                    <span className="star-value">{ratingVal.toFixed ? ratingVal.toFixed(1) : ratingVal}/5</span>
                                                </div>
                                            </div>
                                        </div>
                                        {reviewDate && <span className="review-date">{new Date(reviewDate).toLocaleDateString()}</span>}
                                    </div>

                                    <p className="ReviewText">"{isDetailed ? rev.comment : rev}"</p>

                                    {isDetailed && rev.response && (
                                        <div className="RestaurantReply">
                                            <strong>Restaurant Reply:</strong>
                                            <p>{rev.response}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {/* REPORT MODAL */}
            {isReportModalOpen && (
                <div className="ReportModalOverlay">
                    <div className="ReportModal">
                        <h2>Report {item.name}</h2>
                        <form onSubmit={handleReportSubmit}>
                            <input type="text" name="reporterName" placeholder="Your Name (Optional)" />
                            <select name="reason" required>
                                <option value="">Select a Reason</option>
                                <option value="Wrong Info">Incorrect Information</option>
                                <option value="Poor Quality">Poor Service Quality</option>
                                <option value="Hygiene">Hygiene Issues</option>
                                <option value="Foul Language">Foul Language/Behavior</option>
                                <option value="Other">Other</option>
                            </select>
                            <textarea name="details" placeholder="Please provide more details..." required rows="4"></textarea>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsReportModalOpen(false)}>Cancel</button>
                                <button type="submit" className="confirm-report">Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};
