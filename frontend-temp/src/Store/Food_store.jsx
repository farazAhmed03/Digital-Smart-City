import { FaUtensils, FaCoffee, FaPizzaSlice, FaHamburger, FaBirthdayCake, FaIceCream, FaBreadSlice } from "react-icons/fa";

// ========================================
// FOOD CATEGORIES
// ========================================
export const Food_categories = [
    {
        title: "Fine Dining",
        img: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600",
        icon: <FaUtensils className="icons" />,
        btn: "Exquisite Dining",
        link: "/food/fine-dining",
        description: "Experience premium dining with exquisite cuisines and elegant atmosphere."
    },
    {
        title: "Cafes & Coffee",
        img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
        icon: <FaCoffee className="icons" />,
        btn: "Coffee Spots",
        link: "/food/cafes",
        description: "Relax and enjoy the best coffee, desserts, and cozy vibes."
    },
    {
        title: "Fast Food",
        img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600",
        icon: <FaPizzaSlice className="icons" />,
        btn: "Quick Bites",
        link: "/food/fast-food",
        description: "Delicious burgers, pizzas, and quick bites for your cravings."
    },
    {
        title: "Local Cuisine",
        img: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600",
        icon: <FaBreadSlice className="icons" />,
        btn: "Traditional Food",
        link: "/food/local-food",
        description: "Explore the authentic flavors and traditional dishes of Kohat."
    },
    {
        title: "Bakeries",
        img: "https://images.pexels.com/photos/1739748/pexels-photo-1739748.jpeg?auto=compress&cs=tinysrgb&w=600",
        icon: <FaBirthdayCake className="icons" />,
        btn: "Sweet Delights",
        link: "/food/bakeries",
        description: "Freshly baked cakes, pastries, and traditional sweets."
    },
    {
        title: "Street Food",
        img: "https://images.pexels.com/photos/5412440/pexels-photo-5412440.jpeg?auto=compress&cs=tinysrgb&w=600",
        icon: <FaIceCream className="icons" />,
        btn: "Street Flavors",
        link: "/food/street-food",
        description: "Authentic street snacks and local favorites from the bazaar."
    },
];

// ========================================
// FINE DINING DATA
// ========================================
export const FineDiningList = [
    { name: "The Grand Regal", id: 1 },
    { name: "Royal Pavilion", id: 2 },
    { name: "Elite Restaurant", id: 3 },
];

export const FineDiningCardsData = [
    { img: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "The Grand Regal", Desc: "Premium fine dining with a mix of continental and local dishes.", id: "1", btn_txt: "View Details", rating: 4.8, priceRange: "$$$", cuisine: "Continental", deliveryAvailable: false, price: 2000 },
    { img: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Royal Pavilion", Desc: "Exquisite ambiance and gourmet flavors for special occasions.", id: "2", btn_txt: "View Details", rating: 4.5, priceRange: "$$$", cuisine: "Mughlai", deliveryAvailable: true, price: 1800 },
    { img: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Elite Restaurant", Desc: "A sophisticated dining experience with top-notch service.", id: "3", btn_txt: "View Details", rating: 4.2, priceRange: "$$$", cuisine: "Steakhouse", deliveryAvailable: false, price: 2500 },
];

// ========================================
// CAFES DATA
// ========================================
export const CafesList = [
    { name: "Mountain Brew", id: 4 },
    { name: "Bean & Beyond", id: 5 },
    { name: "The Cozy Corner", id: 6 },
];

export const CafesCardsData = [
    { img: "https://images.pexels.com/photos/6067/coffee-flower-reading-magazine.jpg?auto=compress&cs=tinysrgb&w=600", InstName: "Mountain Brew", Desc: "Freshly brewed coffee with a stunning view of the hills.", id: "4", btn_txt: "View Details", rating: 4.7, priceRange: "$$", cuisine: "Cafe", deliveryAvailable: true, price: 500 },
    { img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Bean & Beyond", Desc: "The perfect spot for coffee lovers and dessert enthusiasts.", id: "5", btn_txt: "View Details", rating: 4.4, priceRange: "$$", cuisine: "Cafe", deliveryAvailable: true, price: 450 },
    { img: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "The Cozy Corner", Desc: "A small, peaceful space for work or casual meetups.", id: "6", btn_txt: "View Details", rating: 4.1, priceRange: "$", cuisine: "Cafe", deliveryAvailable: false, price: 300 },
];

// ========================================
// FAST FOOD DATA
// ========================================
export const FastFoodList = [
    { name: "Burger Hub", id: 7 },
    { name: "Pizza Palace", id: 8 },
    { name: "Crunchy Chicken", id: 9 },
];

export const FastFoodCardsData = [
    { img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Burger Hub", Desc: "Juicy burgers and crispy fries that will keep you coming back.", id: "7", btn_txt: "View Details", rating: 4.9, priceRange: "$$", cuisine: "Burgers", deliveryAvailable: true, price: 800 },
    { img: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Pizza Palace", Desc: "Authentic wood-fired pizzas with a variety of toppings.", id: "8", btn_txt: "View Details", rating: 4.3, priceRange: "$$", cuisine: "Pizza", deliveryAvailable: true, price: 1200 },
    { img: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Crunchy Chicken", Desc: "The best fried chicken in town, crispy and flavorful.", id: "9", btn_txt: "View Details", rating: 4.0, priceRange: "$$", cuisine: "Fried Chicken", deliveryAvailable: true, price: 600 },
];

// ========================================
// LOCAL FOOD DATA
// ========================================
export const LocalFoodList = [
    { name: "Kohat Chapli Kebab Central", id: 10 },
    { name: "Sulemani Pulao House", id: 11 },
    { name: "Traditional Shinwari BBQ", id: 12 },
];

export const LocalFoodCardsData = [
    { img: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Kohat Chapli Kebab Central", Desc: "The most famous and authentic Chapli Kebabs in the region.", id: "10", btn_txt: "View Details", rating: 4.8, priceRange: "$", cuisine: "Pashtun", deliveryAvailable: true, price: 400 },
    { img: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Sulemani Pulao House", Desc: "Traditional Pulao served with a unique Sulemani taste.", id: "11", btn_txt: "View Details", rating: 4.5, priceRange: "$", cuisine: "Desi", deliveryAvailable: true, price: 350 },
    { img: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Traditional Shinwari BBQ", Desc: "Freshly prepared barbecue using traditional Shinwari recipes.", id: "12", btn_txt: "View Details", rating: 4.6, priceRange: "$$", cuisine: "Shinwari", deliveryAvailable: false, price: 1500 },
];

// ========================================
// BAKERIES DATA
// ========================================
export const BakeriesList = [
    { name: "Sweet Bake Studio", id: 13 },
    { name: "The Pastry Shop", id: 14 },
    { name: "Traditional Sweets Corner", id: 15 },
];

export const BakeriesCardsData = [
    { img: "https://images.pexels.com/photos/1739748/pexels-photo-1739748.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Sweet Bake Studio", Desc: "Custom cakes and premium pastries for all your celebrations.", id: "13", btn_txt: "View Details", rating: 4.7, priceRange: "$$", cuisine: "Bakery", deliveryAvailable: true, price: 1200 },
    { img: "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "The Pastry Shop", Desc: "Freshly baked cookies, bread, and croissants every morning.", id: "14", btn_txt: "View Details", rating: 4.5, priceRange: "$$", cuisine: "French Bakery", deliveryAvailable: true, price: 800 },
    { img: "https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Traditional Sweets Corner", Desc: "Authentic local sweets and mithai made with pure ingredients.", id: "15", btn_txt: "View Details", rating: 4.9, priceRange: "$$", cuisine: "Traditional", deliveryAvailable: true, price: 1100 },
];

// ========================================
// STREET FOOD DATA
// ========================================
export const StreetFoodList = [
    { name: "Bazaar Chaat Point", id: 16 },
    { name: "Golgappa Corner", id: 17 },
    { name: "Samosa & Pakora Stall", id: 18 },
];

export const StreetFoodCardsData = [
    { img: "https://images.pexels.com/photos/5412440/pexels-photo-5412440.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Bazaar Chaat Point", Desc: "Spicy and tangy chaat that captures the essence of street flavors.", id: "16", btn_txt: "View Details", rating: 4.3, priceRange: "$", cuisine: "Street Food", deliveryAvailable: false, price: 250 },
    { img: "https://images.pexels.com/photos/12419161/pexels-photo-12419161.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Golgappa Corner", Desc: "Crispy golgappas with a variety of spicy waters.", id: "17", btn_txt: "View Details", rating: 4.6, priceRange: "$", cuisine: "Street Food", deliveryAvailable: false, price: 200 },
    { img: "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg?auto=compress&cs=tinysrgb&w=600", InstName: "Samosa & Pakora Stall", Desc: "The ultimate evening snacks, freshly fried and hot.", id: "18", btn_txt: "View Details", rating: 4.4, priceRange: "$", cuisine: "Street Food", deliveryAvailable: false, price: 150 },
];

// ========================================
// FOOD DETAILS DATA
// ========================================
export const Food_Details = [
    // fine dining
    {
        id: 1,
        type: "Fine Dining",
        name: "The Grand Regal",
        tagline: "Experience the Pinnacle of Dining",
        about: "The Grand Regal is KPK's premier fine dining destination, offering an unparalleled culinary journey. Our chefs specialize in a fusion of continental masterpieces and refined local flavors.",
        aboutImage: "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg",
        staff: [{ name: "Chef Haris", subject: "Executive Chef", description: "Master of continental cuisine.", image: "https://images.pexels.com/photos/2102934/pexels-photo-2102934.jpeg" }],
        events: [{ title: "Gourmet Week", description: "Special menu featuring international dishes.", icon: "FaUtensils" }],
        promotions: [
            { id: "p1", title: "Weekend Feast", type: "discount", value: "15%", code: "WEEKEND15", status: "active", usage: 45 },
            { id: "p2", title: "Free Delivery", type: "shipping", value: "100%", threshold: 2000, status: "active", usage: 120 }
        ],
        reportStatus: "Warning",
        reportCount: 73,
        reports: [
            { id: "r1", reason: "Fake information", date: "2024-02-15", status: "Verified" },
            { id: "r2", reason: "Bad service", date: "2024-02-18", status: "Pending" },
            { id: "r3", reason: "Overcharging", date: "2024-02-20", status: "Verified" }
        ],
        finance: {
            balance: 45000,
            pendingPayout: 12000,
            lastPayout: "2024-02-01",
            subscriptionStatus: "Active",
            subscriptionPlan: "Premium"
        },
        quickInfo: {
            basicProfile: { name: "The Grand Regal", location: "Cantonment, Kohat", type: "Fine Dining" },
            administration: { owner: "Mr. Zahid Khan", phone: "0922-123456", email: "info@grandregal.com" },
            facilities: ["Private Cabins", "AC Hall", "Valet Parking", "Free Wi-Fi"],
            timings: { timing: "12:00 PM – 12:00 AM" },
            extraActivities: ["Live Violin Performance"],
            parentReviews: ["Best fine dining in KPK.", "Highly professional staff."]
        },
        hygieneRating: "A+",
        inspectionStatus: "Passed",
        verifiedBadge: true,
        isOpen: true,
        detailedReviews: [
            { id: "r1", name: "Ahmed Khan", img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", rating: 5, comment: "Absolutely marvelous experience. The steaks were cooked to perfection!", date: "2024-02-10", response: "Thank you Ahmed! We are glad you enjoyed it." },
            { id: "r2", name: "Sara Malik", img: "https://images.pexels.com/photos/3801456/pexels-photo-3801456.jpeg", rating: 5, comment: "The ambiance is unmatched in Kohat. Highly recommended for family dinners.", date: "2024-02-08", response: "" }
        ],
        categorizedMenu: [
            {
                categoryName: "Signature Deals",
                items: [{ id: 101, name: "Regal Platter for 4", price: "4500", img: "https://images.pexels.com/photos/323682/pexels-photo-323682.jpeg", desc: "A royal mix of BBQ, steaks, and aromatic rice.", tags: ["Popular", "Spicy"], isAvailable: true, prepTime: "45 mins", sku: "RP-004", addOns: ["Extra Rice", "Raita"] }]
            },
            {
                categoryName: "Main Course",
                items: [
                    { id: 102, name: "Beef Wellington", price: "2800", img: "https://images.pexels.com/photos/11749407/pexels-photo-11749407.jpeg", desc: "Tender beef wrapped in puff pastry.", variants: ["Classic", "Extra Spicy"], tags: ["Signature"], isAvailable: true, prepTime: "30 mins", sku: "BW-102", addOns: ["Mashed Potatoes", "Steamed Veggies"] },
                    { id: 103, name: "Grilled Salmon", price: "2200", img: "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg", desc: "Fresh Atlantic salmon grilled with lemon butter.", variants: ["Lemon Garlic", "Honey Glazed"], isAvailable: false, prepTime: "25 mins", sku: "GS-103", addOns: ["Asparagus"] }
                ]
            },
            {
                categoryName: "Sweet Ends",
                items: [{ id: 104, name: "Saffron Cheesecake", price: "600", img: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg", desc: "A creamy fusion of saffron and high-end cheese.", tags: ["Sweet"] }]
            }
        ],
        deliveryAvailability: "Dine-in Only",
        gallery: ["https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg", "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"],
        contact: { email: "contact@grandregal.com", phone: "+92 300 1234567" }
    },
    {
        id: 2,
        type: "Fine Dining",
        name: "Royal Pavilion",
        tagline: "Dine Like Royalty",
        about: "Royal Pavilion offers a regal experience with a focus on traditional Mughal and Persian cuisines. Our opulent decor and attentive service recreate the grandeur of a royal court.",
        aboutImage: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
        staff: [{ name: "Ustad Jamil", subject: "Head Chef", description: "Specialist in Mughlai cuisine.", image: "https://images.pexels.com/photos/2102934/pexels-photo-2102934.jpeg" }],
        events: [{ title: "Mughal Night", description: "Traditional music and authentic recipes.", icon: "FaUtensils" }],
        quickInfo: {
            basicProfile: { name: "Royal Pavilion", location: "Mall Road, Kohat", type: "Fine Dining" },
            administration: { owner: "Mr. Sultan", phone: "0922-555111" },
            facilities: ["Royal Cabins", "AC Hall", "Garden Seating"],
            timings: { timing: "1:00 PM – 11:30 PM" },
            extraActivities: ["Gazal Nights"],
            parentReviews: ["Authentic taste.", "The ambiance is just royal."]
        },
        hygieneRating: "A",
        inspectionStatus: "Passed",
        verifiedBadge: true,
        isOpen: true,
        categorizedMenu: [
            {
                categoryName: "Royal Court Deals",
                items: [
                    { id: 201, name: "Darbari Platter", price: "5500", img: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg", desc: "A feast of mutton, chicken, and kabuli rice.", tags: ["Elite"] }
                ]
            },
            {
                categoryName: "Mughlai Specialties",
                items: [
                    { id: 202, name: "Shahi Mutton Karahi", price: "2400", img: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg", desc: "Mutton cooked in rich desi ghee and spices.", variants: ["Desi Ghee", "Butter"], tags: ["Popular"] },
                    { id: 203, name: "Zaffrani Pulao", price: "1200", img: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg", desc: "Aromatic saffron rice with nuts.", tags: ["Traditional"] }
                ]
            }
        ],
        deliveryAvailability: "Limited (3km Radius)",
        gallery: ["https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg"],
        contact: { email: "royal@pavilion.com", phone: "+92 311 5551111" }
    },
    {
        id: 3,
        type: "Fine Dining",
        name: "Elite Restaurant",
        tagline: "Sophistication in Every Bite",
        about: "Elite Restaurant is synonymous with quality and sophistication. We offer a diverse menu that caters to both local palates and international standards of excellence.",
        aboutImage: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg",
        staff: [{ name: "Chef Moiz", subject: "Executive Chef", description: "Steak and Grill expert.", image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg" }],
        events: [{ title: "Steak Night", description: "Premium cuts grilled to perfection.", icon: "FaUtensils" }],
        quickInfo: {
            basicProfile: { name: "Elite Restaurant", location: "KDA, Kohat", type: "Fine Dining" },
            administration: { owner: "Mr. Hamza", phone: "0922-999888" },
            facilities: ["Conference Room", "Wi-Fi", "Ample Parking"],
            timings: { timing: "11:00 AM – 12:00 AM" },
            extraActivities: ["Business Brunch"],
            parentReviews: ["Perfect for business meetings.", "Great steaks!"]
        },
        hygieneRating: "A",
        inspectionStatus: "Passed",
        verifiedBadge: true,
        isOpen: false,
        categorizedMenu: [
            {
                categoryName: "Gourmet Steaks",
                items: [
                    { id: 301, name: "T-Bone Steak", price: "2800", img: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg", desc: "Juicy premium T-Bone with sides.", variants: ["Rare", "Medium", "Well Done"], tags: ["Signature"] },
                    { id: 302, name: "Chicken Alfredo", price: "1500", img: "https://images.pexels.com/photos/12737651/pexels-photo-12737651.jpeg", desc: "Creamy white sauce pasta.", tags: ["Classic"] }
                ]
            }
        ],
        deliveryAvailability: "Dine-in Only",
        gallery: ["https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg"],
        contact: { email: "manager@eliterest.com", phone: "+92 333 9998881" }
    },

    // cafes
    {
        id: 4,
        type: "Cafe",
        name: "Mountain Brew",
        tagline: "Coffee with a View",
        about: "Mountain Brew offers the perfect escape with artesanal coffee blends while taking in the breathtaking views of the KPK hills.",
        aboutImage: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
        categorizedMenu: [
            {
                categoryName: "Hot Beverages",
                items: [{ id: 401, name: "Artisanal Coffee", price: "450", img: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg", desc: "Freshly roasted beans.", variants: ["Cappuccino", "Latte", "Americano", "Mocha"], tags: ["Classic"] }]
            },
            {
                categoryName: "Ice Cold Brews",
                items: [{ id: 402, name: "Iced Latte", price: "500", img: "https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg", desc: "Chilled espresso with milk.", variants: ["Caramel", "Vanilla", "Hazelnut"], tags: ["Refreshing"] }]
            },
            {
                categoryName: "Desert & Snacks",
                items: [{ id: 403, name: "Choco Lava Cake", price: "550", img: "https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg", desc: "Melt-in-your-mouth chocolate center.", tags: ["Sweet"] }]
            }
        ],
        deliveryAvailability: "Available (Within 5km)",
        gallery: ["https://images.pexels.com/photos/6067/coffee-flower-reading-magazine.jpg"],
        detailedReviews: [
            { name: "Zia Ullah", img: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg", rating: 5, comment: "The best espresso in town. The view of the hills makes it even better." },
            { name: "Hina Gul", img: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg", rating: 4, comment: "Great coffee, but it gets a bit crowded on weekends. Love the vibe!" }
        ],
        contact: { email: "visit@mountainbrew.com", phone: "+92 333 1122334" }
    },
    {
        id: 5,
        type: "Cafe",
        name: "Bean & Beyond",
        tagline: "Beyond Just Coffee",
        about: "At Bean & Beyond, we believe every cup tells a story. We source the finest beans globally and roast them to perfection for our community.",
        aboutImage: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
        staff: [{ name: "Sara", subject: "Cafe Manager", description: "Beverage expert.", image: "https://images.pexels.com/photos/3801456/pexels-photo-3801456.jpeg" }],
        categorizedMenu: [
            {
                categoryName: "Brewed Masterpieces",
                items: [
                    { id: 501, name: "Turkish Coffee", price: "600", img: "https://images.pexels.com/photos/5946636/pexels-photo-5946636.jpeg", desc: "Traditional strong coffee.", tags: ["Signature"] },
                    { id: 502, name: "Spanish Latte", price: "550", img: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg", desc: "Sweet condensed milk latte.", tags: ["Popular"] }
                ]
            }
        ],
        deliveryAvailability: "City Wide Delivery",
        gallery: ["https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg"],
        contact: { email: "info@beanbeyond.com", phone: "+92 345 0001112" }
    },
    {
        id: 6,
        type: "Cafe",
        name: "The Cozy Corner",
        tagline: "Your Home Away from Home",
        about: "The Cozy Corner is designed for comfort. With plush seating and a quiet atmosphere, it's the ideal place for readers and remote workers.",
        aboutImage: "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg",
        staff: [{ name: "Bilal", subject: "Supervisor", description: "Hospitality specialist.", image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" }],
        categorizedMenu: [
            {
                categoryName: "Relaxing Teas",
                items: [
                    { id: 601, name: "Herbal Green Tea", price: "250", img: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg", desc: "Fresh loose leaf tea.", tags: ["Healthy"] },
                    { id: 602, name: "Classic Waffles", price: "450", img: "https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg", desc: "Warm waffles with honey.", tags: ["Sweet"] }
                ]
            }
        ],
        deliveryAvailability: "Takeaway Preferred",
        gallery: ["https://images.pexels.com/photos/6067/coffee-flower-reading-magazine.jpg"],
        contact: { email: "stay@cozycorner.com", phone: "+92 300 4443331" }
    },

    // fast food
    {
        id: 7,
        type: "Fast Food",
        name: "Burger Hub",
        tagline: "The Ultimate Burger Experience",
        about: "KPK's best burger spot, 100% fresh beef and secret legendary sauces.",
        categorizedMenu: [
            {
                categoryName: "Value Deals",
                items: [{ id: 701, name: "Hub Duo Deal", price: "1200", img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg", desc: "2 Classic Burgers + 2 Drinks.", tags: ["Economic"] }]
            },
            {
                categoryName: "Gourmet Burgers",
                items: [
                    { id: 702, name: "Monster Zinger", price: "650", img: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg", desc: "Extra crispy chicken patty.", variants: ["Mild", "Spicy", "Extreme"], tags: ["Popular"] },
                    { id: 703, name: "Hub Classic Beef", price: "750", img: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg", desc: "Flame grilled beef.", variants: ["Single Patty", "Double Patty"], tags: ["Classic"] }
                ]
            },
            {
                categoryName: "Sides & Extras",
                items: [{ id: 704, name: "Loaded Fries", price: "400", img: "https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg", desc: "Cheese and jalapeño topping.", tags: ["Spicy"] }]
            }
        ],
        deliveryAvailability: "City Wide",
        gallery: ["https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg"],
        contact: { email: "orders@burgerhub.com", phone: "+92 312 7778881" }
    },
    {
        id: 8,
        type: "Fast Food",
        name: "Pizza Palace",
        tagline: "Slices of Heaven",
        about: "Pizza Palace is where taste meets tradition. Our handmade dough and fresh toppings ensure every slice is a masterpiece.",
        aboutImage: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg",
        categorizedMenu: [
            {
                categoryName: "Best Pizza Deals",
                items: [
                    { id: 801, name: "Palace Super Mix", price: "1800", img: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg", desc: "Large Pizza + Garlic Bread + Drink.", tags: ["Popular"] }
                ]
            },
            {
                categoryName: "The Classics",
                items: [
                    { id: 802, name: "Tikka Feast", price: "1400", img: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg", desc: "Spicy chicken tikka toppings.", variants: ["Small", "Medium", "Large"], tags: ["Spicy"] },
                    { id: 803, name: "Pepperoni Passion", price: "1600", img: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg", desc: "Loaded with beef pepperoni.", tags: ["Kid-Friendly"] }
                ]
            }
        ],
        deliveryAvailability: "Free Home Delivery",
        gallery: ["https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg"],
        contact: { email: "pizza@palace.com", phone: "+92 321 4445551" },
        hygieneRating: "B+",
        inspectionStatus: "Pending",
        verifiedBadge: false,
        isOpen: true
    },
    {
        id: 9,
        type: "Fast Food",
        name: "Crunchy Chicken",
        tagline: "Crave the Crunch",
        about: "The go-to destination for crispy fried chicken lovers. Our special breading and marination secret is what makes us unique.",
        aboutImage: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg",
        categorizedMenu: [
            {
                categoryName: "Family Buckets",
                items: [
                    { id: 901, name: "8pc Family Bucket", price: "2200", img: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg", desc: "8 pieces of crispy chicken with dips.", tags: ["Value"] }
                ]
            },
            {
                categoryName: "Snack Items",
                items: [
                    { id: 902, name: "Spicy Wings", price: "600", img: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg", desc: "10 pieces extra spicy wings.", tags: ["Spicy"] }
                ]
            }
        ],
        deliveryAvailability: "Available (Within City)",
        gallery: ["https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg"],
        contact: { email: "crunchy@chicken.com", phone: "+92 315 1112223" }
    },

    // local cuisine
    {
        id: 10,
        type: "Local Cuisine",
        name: "Kohat Chapli Kebab Central",
        tagline: "The Legend of Kohat",
        about: "Experience the authentic taste of KPK with our world-famous Chapli Kebabs. We've been serving the same traditional recipe for decades.",
        aboutImage: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
        categorizedMenu: [
            {
                categoryName: "Traditional Deals",
                items: [{ id: 1001, name: "Kebab Family Deal", price: "1500", img: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg", desc: "4 Large Kebabs + 4 Naans + Chutney.", tags: ["Popular", "Traditional"] }]
            },
            {
                categoryName: "Kebab Specialties",
                items: [
                    { id: 1002, name: "Special Beef Chapli", price: "350", img: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg", desc: "Traditional spicy minced beef patty.", variants: ["Mild", "Spicy"], tags: ["Signature"] },
                    { id: 1003, name: "Full Fat Chapli", price: "400", img: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg", desc: "Traditional kebabs cooked in animal fat.", tags: ["Authentic"] }
                ]
            },
            {
                categoryName: "Sides",
                items: [{ id: 1004, name: "Afghani Naan", price: "60", img: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg", desc: "Fresh oven-baked bread.", tags: ["Fresh"] }]
            }
        ],
        deliveryAvailability: "City Wide",
        gallery: ["https://images.pexels.com/photos/5412440/pexels-photo-5412440.jpeg"],
        detailedReviews: [
            { name: "Khalid Pashtun", img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg", rating: 5, comment: "Authentic Chapli Kebab! Takes me back to my childhood." },
            { name: "Zeba Jan", img: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg", rating: 5, comment: "The spice level is perfect and the chutneys are legendary." }
        ],
        contact: { email: "orders@kebabcentral.com", phone: "+92 345 5556667" }
    },
    {
        id: 11,
        type: "Local Cuisine",
        name: "Sulemani Pulao House",
        tagline: "Fragrance of Tradition",
        about: "Specialists in the legendary Sulemani Pulao. We use premium Basmati rice and aged spices for a world-class experience.",
        aboutImage: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg",
        categorizedMenu: [
            {
                categoryName: "Pulao Selection",
                items: [
                    { id: 1101, name: "Mutton Sulemani Pulao", price: "1200", img: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg", desc: "Tender local mutton with aromatic rice.", tags: ["Classic"] },
                    { id: 1102, name: "Beef Kabuli Pulao", price: "1000", img: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg", desc: "Traditional pulao with raisins and carots.", tags: ["Traditional"] }
                ]
            }
        ],
        deliveryAvailability: "Available City Wide",
        gallery: ["https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg"],
        contact: { email: "pulao@house.com", phone: "+92 333 7773331" }
    },
    {
        id: 12,
        type: "Local Cuisine",
        name: "Traditional Shinwari BBQ",
        tagline: "The Real Taste of Fire",
        about: "Shinwari BBQ is about simplicity and freshness. Natural charcoal fire and the best meat selection in the province.",
        aboutImage: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg",
        categorizedMenu: [
            {
                categoryName: "Salted BBQ",
                items: [
                    { id: 1201, name: "Lamb Chops (1 KG)", price: "3200", img: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg", desc: "Salted grills without spices.", tags: ["Pure"] },
                    { id: 1202, name: "Dumba Karahi", price: "2800", img: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg", desc: "Cooked in lamb fat.", tags: ["Signature"] }
                ]
            }
        ],
        deliveryAvailability: "Takeaway Only",
        gallery: ["https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg"],
        contact: { email: "shinwari@bbq.com", phone: "+92 345 5552225" }
    },

    // bakeries
    {
        id: 13,
        type: "Bakery",
        name: "Sweet Bake Studio",
        tagline: "Baking Moments of Happiness",
        about: "Your destination for all things sweet. Artisanal breads and custom cakes baked fresh daily.",
        aboutImage: "https://images.pexels.com/photos/1739748/pexels-photo-1739748.jpeg",
        categorizedMenu: [
            {
                categoryName: "Premium Cakes",
                items: [
                    { id: 1301, name: "Fudge Cake", price: "1500", img: "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg", desc: "Rich chocolate experience.", tags: ["Sweet"] },
                    { id: 1302, name: "Fruit Delight", price: "1200", img: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg", desc: "Fresh seasonal fruit base.", tags: ["Refreshing"] }
                ]
            }
        ],
        deliveryAvailability: "Available (Cantonment Area)",
        gallery: ["https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg"],
        contact: { email: "hello@sweetbake.com", phone: "+92 345 1111222" }
    },
    {
        id: 14,
        type: "Bakery",
        name: "The Pastry Shop",
        tagline: "Artisanal Bakes Daily",
        about: "European-style baking in the heart of KPK. Croissants and Danishes made with 100% real butter.",
        aboutImage: "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg",
        categorizedMenu: [
            {
                categoryName: "French Pastries",
                items: [
                    { id: 1401, name: "Butter Croissant", price: "350", img: "https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg", desc: "Flaky and buttery.", variants: ["Plain", "Cheese", "Chocolate"], tags: ["Classic"] }
                ]
            }
        ],
        deliveryAvailability: "In-Store & App Orders",
        gallery: ["https://images.pexels.com/photos/1739748/pexels-photo-1739748.jpeg"],
        contact: { email: "orders@thepastryshop.com", phone: "+92 333 8889993" }
    },
    {
        id: 15,
        type: "Bakery",
        name: "Traditional Sweets Corner",
        tagline: "Authenticity in Every Piece",
        about: "Specialized in traditional Pakistani Mithai made with pure desi ghee. A generational recipe since 1970.",
        aboutImage: "https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg",
        categorizedMenu: [
            {
                categoryName: "Mithai Selection",
                items: [
                    { id: 1501, name: "Gulab Jamun (1 KG)", price: "1200", img: "https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg", desc: "Soft balls in syrup.", tags: ["Sweet"] },
                    { id: 1502, name: "Desi Ghee Sohan Halwa", price: "1500", img: "https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg", desc: "Rich and nutty halwa.", tags: ["Elite"] }
                ]
            }
        ],
        deliveryAvailability: "Country Wide Delivery",
        gallery: ["https://images.pexels.com/photos/808941/pexels-photo-808941.jpeg"],
        contact: { email: "sweets@corner.com", phone: "+92 300 1112224" }
    },

    // street food
    {
        id: 16,
        type: "Street Food",
        name: "Bazaar Chaat Point",
        tagline: "The Pulse of the Bazaar",
        about: "Spiciest mix of chutneys and crispy papri for the true street lover.",
        aboutImage: "https://images.pexels.com/photos/5412440/pexels-photo-5412440.jpeg",
        staff: [{ name: "Kaka Jan", subject: "Owner", description: "Vibe of the bazaar.", image: "https://images.pexels.com/photos/2102934/pexels-photo-2102934.jpeg" }],
        quickInfo: {
            basicProfile: { name: "Bazaar Chaat Point", location: "Main Bazaar, Kohat" },
            timings: { timing: "2:00 PM – 10:00 PM" },
            facilities: ["Takeaway", "Street Seating"],
            parentReviews: ["Best spicy chaat in Kohat!", "Mind blowing chutneys."]
        },
        categorizedMenu: [
            {
                categoryName: "Tangy Treats",
                items: [
                    { id: 1601, name: "Mix Chaat Platter", price: "250", img: "https://images.pexels.com/photos/5412440/pexels-photo-5412440.jpeg", desc: "Chickpea & potato mix.", tags: ["Spicy"] }
                ]
            }
        ],
        deliveryAvailability: "Takeaway Only",
        gallery: ["https://images.pexels.com/photos/5412440/pexels-photo-5412440.jpeg", "https://images.pexels.com/photos/12419161/pexels-photo-12419161.jpeg"],
        contact: { email: "visit@chaatpoint.com", phone: "+92 300 5554441" }
    },
    {
        id: 17,
        type: "Street Food",
        name: "Golgappa Corner",
        tagline: "Spice it Up",
        about: "5 types of water flavors. Classic and yogurt filled golgappas.",
        aboutImage: "https://images.pexels.com/photos/12419161/pexels-photo-12419161.jpeg",
        staff: [{ name: "Imran", subject: "Chief Maker", description: "The Golgappa specialist.", image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg" }],
        quickInfo: {
            basicProfile: { name: "Golgappa Corner", location: "Tehsil Road, Kohat" },
            timings: { timing: "3:00 PM – 11:00 PM" },
            facilities: ["Outdoor Seating", "Custom Water Flavors"],
            parentReviews: ["The Pani Puri is just wow.", "Multiple flavors are great!"]
        },
        categorizedMenu: [
            {
                categoryName: "Crunchy Puri",
                items: [
                    { id: 1701, name: "Classic Pani Puri", price: "200", img: "https://images.pexels.com/photos/12419161/pexels-photo-12419161.jpeg", desc: "10 pieces spicy water.", variants: ["Spicy", "Mint", "Sweet"], tags: ["Popular"] }
                ]
            }
        ],
        deliveryAvailability: "In-Store Experience",
        gallery: ["https://images.pexels.com/photos/12419161/pexels-photo-12419161.jpeg"],
        contact: { email: "pani@puri.com", phone: "+92 345 3332221" }
    },
    {
        id: 18,
        type: "Street Food",
        name: "Samosa & Pakora Stall",
        tagline: "Evening Staples",
        about: "Freshly fried snacks every evening with signature mint chutney.",
        aboutImage: "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg",
        staff: [{ name: "Baba Ji", subject: "Master Fryer", description: "Frying perfection for 20 years.", image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" }],
        quickInfo: {
            basicProfile: { name: "Samosa Stall", location: "City Gate, Kohat" },
            timings: { timing: "4:00 PM – 9:00 PM" },
            facilities: ["Freshly Fried", "Signature Chutney"],
            parentReviews: ["Best pakoras in town.", "Signature mint chutney is the key."]
        },
        categorizedMenu: [
            {
                categoryName: "Crispy Bites",
                items: [
                    { id: 1801, name: "Beef Samosa", price: "60", img: "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg", desc: "Spicy meat filling.", tags: ["Spicy"] },
                    { id: 1802, name: "Mixed Pakora (KG)", price: "500", img: "https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg", desc: "Aromatic mix of fritters.", tags: ["Value"] }
                ]
            }
        ],
        deliveryAvailability: "Takeaway Only",
        gallery: ["https://images.pexels.com/photos/4449068/pexels-photo-4449068.jpeg", "https://images.pexels.com/photos/5412440/pexels-photo-5412440.jpeg"],
        contact: { email: "snacks@kohat.com", phone: "+92 300 3331114" }
    }
];
