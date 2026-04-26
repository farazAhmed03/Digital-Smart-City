
import * as icon from "react-icons/fa";
import { MdBusinessCenter, MdStore, MdPerson } from "react-icons/md";

// % % % % % % *BUSINESS PAGE* % % % % % %

// ========================================
// BUSINESS HOME - Categories
// ========================================
export const businessCategories = [
    {
        title: "Shops & Retail",
        icon: <MdStore className="icons" />,
        btn: "Visit Shops",
        link: "shops",
        description: "Grocery, Fashion, Electronics, Pharmacy, and more.",
        coverImage: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg"
    },
    {
        title: "Offices & Companies",
        icon: <MdBusinessCenter className="icons" />,
        btn: "Visit Offices",
        link: "offices",
        description: "Software, Construction, Legal, Travel Agencies.",
        coverImage: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
    },
    {
        title: "Manufacturing & Industry",
        icon: <icon.FaIndustry className="icons" />,
        btn: "Visit Industry",
        link: "manufacturing",
        description: "Textile, Food, Plastic, Steel Factories.",
        coverImage: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg"
    },
    {
        title: "Freelancers",
        icon: <MdPerson className="icons" />,
        btn: "Visit Freelancers",
        link: "freelancers",
        description: "Designers, Developers, Writers, Consultants.",
        coverImage: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
    },
    {
        title: "Events & Entertainment",
        icon: <icon.FaCalendarAlt className="icons" />,
        btn: "Visit Events",
        link: "events",
        description: "Marriage Halls, Decor, Cinemas, Parks.",
        coverImage: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
    },
];

// &&&&&&&&&&&& *SHOPS & RETAIL DATA* &&&&&&&&&&&& \\

export const ShopsData = [
    {
        id: 1,
        name: "Kohat Super Mart",
        img: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
        desc: "Grocery & Super Store - All daily needs.",
        btn_txt: "Read More",
        // Extended Details matching Registration Form
        subCategory: "Grocery & Super Stores",
        coverImage: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
        timings: { opening: "08:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
        contact: { phone: "0300-1234567", whatsapp: "0300-1234567", email: "info@kohatmart.com" },
        socialLinks: { facebook: "fb.com/kohatmart", instagram: "inst.com/kohatmart" },
        address: "Main Bazaar, Kohat",
        location: { lat: 33.5889, lng: 71.4429 },
        services: ["Home Delivery", "Fresh Vegetables", "Imported Goods"],
        subscription: "Verified Listing",
        products: [
            { id: 101, title: "Fresh Apples", description: "Organic apples from local farms.", price: "250/kg", image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg" },
            { id: 102, title: "Cooking Oil (5L)", description: "Premium quality refined sunflower oil.", price: "2800", image: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg" },
            { id: 103, title: "Basmati Rice (10kg)", description: "Long grain aromatic Basmati rice.", price: "4500", image: "https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg" }
        ]
    },
    { id: 2, name: "Fresh Greens", img: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg", desc: "Fruits & Vegetables - Organic and fresh.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg", timings: { opening: "07:00 AM", closing: "09:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] } },
    { id: 3, name: "Meat Master", img: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg", desc: "Meat & Poultry - Fresh chicken and beef.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg", timings: { opening: "08:00 AM", closing: "08:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] } },
    { id: 4, name: "Sweet Delights", img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg", desc: "Bakeries & Sweets - Cakes, pastries, and more.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg", timings: { opening: "09:00 AM", closing: "11:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] } },
    { id: 5, name: "Style Hub", img: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg", desc: "Clothing & Fashion - Trendy outfits.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg", timings: { opening: "11:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 6, name: "Step Up Shoes", img: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg", desc: "Shoes & Accessories - For men and women.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg", timings: { opening: "11:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 7, name: "City Electronics", img: "https://images.pexels.com/photos/1337243/pexels-photo-1337243.jpeg", desc: "Electronics & Mobile Shops - Latest gadgets.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/1337243/pexels-photo-1337243.jpeg", timings: { opening: "10:00 AM", closing: "09:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 8, name: "Tech World", img: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg", desc: "Computer & IT Stores - Laptops and accessories.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg", timings: { opening: "10:00 AM", closing: "09:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 9, name: "Home Comforts", img: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", desc: "Furniture & Home Decor - Elegant designs.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", timings: { opening: "10:00 AM", closing: "08:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 10, name: "Construct Hardware", img: "https://images.pexels.com/photos/3609110/pexels-photo-3609110.jpeg", desc: "Hardware & Sanitary - Building materials.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/3609110/pexels-photo-3609110.jpeg", timings: { opening: "08:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 11, name: "Readers Corner", img: "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg", desc: "Stationery & Book Shops - Books and supplies.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg", timings: { opening: "09:00 AM", closing: "09:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 12, name: "Glow & Shine", img: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg", desc: "Cosmetics & Beauty Stores - Makeup and skincare.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg", timings: { opening: "10:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 13, name: "City Pharmacy", img: "https://images.pexels.com/photos/5910953/pexels-photo-5910953.jpeg", desc: "Pharmacy - Medicines and health products.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/5910953/pexels-photo-5910953.jpeg", timings: { opening: "24/7", closing: "24/7", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] } },
    { id: 14, name: "Clear Vision", img: "https://images.pexels.com/photos/39716/pexels-photo-39716.jpeg", desc: "Optical Shops - Glasses and lenses.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/39716/pexels-photo-39716.jpeg", timings: { opening: "10:00 AM", closing: "09:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 15, name: "Fit Pro Sports", img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg", desc: "Sports & Fitness Stores - Gym gear.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg", timings: { opening: "11:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 16, name: "Kids Zone", img: "https://images.pexels.com/photos/264905/pexels-photo-264905.jpeg", desc: "Gift & Toy Shops - Fun for everyone.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/264905/pexels-photo-264905.jpeg", timings: { opening: "10:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] } },
    { id: 17, name: "Budget Store", img: "https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg", desc: "One Dollar Shop - Affordable items.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg", timings: { opening: "09:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] } },
];

export const Shops_Details = [
    {
        id: 1, type: "Shop", name: "Kohat Super Mart", tagline: "Quality products at affordable prices.", about: "Kohat Super Mart has been serving the community for over 10 years, providing a wide range of groceries, household items, and personal care products under one roof.",
        aboutImage: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
        quickInfo: { address: "Main Bazaar, Kohat", phone: "0300-1234567", timing: "8:00 AM - 10:00 PM" },
        gallery: ["https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg", "https://images.pexels.com/photos/2733918/pexels-photo-2733918.jpeg"],
        // Enriched Fields
        coverImage: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg",
        timings: { opening: "08:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
        socialLinks: { facebook: "https://fb.com/kohatmart", email: "info@kohatmart.com" },
        services: ["Grocery", "Cosmetics", "Bakery Items", "Household Needs"]
    },
    // ... add more details if needed
];


// &&&&&&&&&&&& *OFFICES & COMPANIES DATA* &&&&&&&&&&&& \\

export const OfficesData = [
    {
        id: 1, name: "Kohat Soft", img: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg", desc: "Software House - Web & App Development.", btn_txt: "Read More",
        coverImage: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
        timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
        contact: { phone: "0300-1111111", email: "info@kohatsoft.com", website: "https://kohatsoft.com" },
        socialLinks: { linkedin: "linkedin.com/kohatsoft" },
        address: "IT Park, Kohat",
        services: ["Web Development", "App Development", "SEO", "Digital Marketing"],
        products: [
            { id: 201, title: "Corporate Website", description: "Full responsive corporate website with CMS.", price: "45,000", image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg" },
            { id: 202, title: "Mobile App Starter", description: "Cross-platform mobile app for iOS and Android.", price: "80,000", image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg" }
        ]
    },
    {
        id: 2, name: "Tech Innovators", img: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg", desc: "IT & Tech Company - Solutions provider.", btn_txt: "Read More",
        coverImage: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
        timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
        contact: { phone: "0300-2222222", email: "contact@techinnovators.com" },
        address: "KDA, Kohat",
        services: ["Cloud Solutions", "IT Consulting", "Network Security"]
    },
    { id: 3, name: "Brand Boosters", img: "https://images.pexels.com/photos/6476598/pexels-photo-6476598.jpeg", desc: "Marketing & Advertising Agency.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/6476598/pexels-photo-6476598.jpeg", timings: { opening: "10:00 AM", closing: "07:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Social Media Marketing", "Branding", "Content Creation"] },
    { id: 4, name: "Kohat Builders", img: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg", desc: "Construction Company - Commercial projects.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg", timings: { opening: "08:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Commercial Construction", "Residential Projects", "Renovation"] },
    { id: 5, name: "Urban Developers", img: "https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg", desc: "Builders & Developers - Housing schemes.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Land Development", "Housing Societies", "Real Estate Planning"] },
    { id: 6, name: "Design Studio", img: "https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg", desc: "Architecture Firm - Modern designs.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Interior Design", "Architectural Planning", "Landscape Design"] },
    { id: 7, name: "Justice Law", img: "https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg", desc: "Legal Firm & Advocates.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg", timings: { opening: "09:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Legal Consultation", "Corporate Law", "Litigation"] },
    { id: 8, name: "Expert Accounts", img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", desc: "Chartered Accountants & Auditors.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Audit", "Taxation", "Financial Advisory"] },
    { id: 9, name: "Wealth Partners", img: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg", desc: "Financial Advisors & Consultants.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg", timings: { opening: "09:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Investment Planning", "Wealth Management"] },
    { id: 10, name: "Safe Life", img: "https://images.pexels.com/photos/814041/pexels-photo-814041.jpeg", desc: "Insurance Office - Life and car insurance.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/814041/pexels-photo-814041.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Life Insurance", "Car Insurance", "Health Insurance"] },
    { id: 11, name: "Fly High", img: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg", desc: "Travel Agency - Tours and tickets.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg", timings: { opening: "09:00 AM", closing: "07:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Air Tickets", "Visa Assistance", "Tour Packages"] },
    { id: 12, name: "Talent Hunt", img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", desc: "HR & Recruitment Firm.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Recruitment", "HR Consulting", "Training"] },
    { id: 13, name: "Global Trade", img: "https://images.pexels.com/photos/93398/pexels-photo-93398.jpeg", desc: "Import / Export Company.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/93398/pexels-photo-93398.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Import", "Export", "Logistics"] },
    { id: 14, name: "Prime Estate", img: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg", desc: "Real Estate Office - Property dealing.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg", timings: { opening: "10:00 AM", closing: "08:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Buying", "Selling", "Rentals"] },
    { id: 15, name: "Study Abroad", img: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg", desc: "Educational Consultancy.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg", timings: { opening: "10:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Student Visa", "University Admissions", "Career Counseling"] }
];

// &&&&&&&&&&&& *EVENTS & ENTERTAINMENT DATA* &&&&&&&&&&&& \\

export const EventsData = [
    {
        id: 1, name: "Royal Marriage Hall", img: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg", desc: "Spacious venue for weddings and parties.", btn_txt: "Read More",
        coverImage: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg",
        timings: { opening: "10:00 AM", closing: "12:00 AM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
        contact: { phone: "0333-9999999", email: "info@royalhall.com" },
        services: ["Wedding Venue", "Catering", "Event Decor"],
        products: [
            { id: 501, title: "Premium Theme Setup", description: "Complete stage and hall decor with premium themes.", price: "50,000", image: "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg" },
            { id: 502, title: "Gourmet Catering", description: "Full menu catering service for up to 500 guests.", price: "200,000", image: "https://images.pexels.com/photos/50675/banquet-lights-dinner-event-50675.jpeg" }
        ]
    },
    { id: 2, name: "Kohat Event Planners", img: "https://images.pexels.com/photos/50675/banquet-lights-dinner-event-50675.jpeg", desc: "Complete event management services.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/50675/banquet-lights-dinner-event-50675.jpeg", timings: { opening: "09:00 AM", closing: "08:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Birthday Parties", "Corporate Events", "Wedding Planning"] },
    { id: 3, name: "Elegant Decor", img: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg", desc: "Decor Services for all occasions.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg", timings: { opening: "10:00 AM", closing: "09:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Stage Decor", "Lighting", "Floral Arrangements"] },
    { id: 4, name: "DJ Sounds", img: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg", desc: "Professional DJs & Sound Systems.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg", timings: { opening: "10:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, services: ["DJ Services", "Sound System Rental", "Lighting"] },
    { id: 5, name: "City Cinema", img: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg", desc: "Cinemas - Latest movies.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg", timings: { opening: "12:00 PM", closing: "01:00 AM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, services: ["Movie Screenings", "Snack Bar", "Family Shows"] },
    { id: 6, name: "Fun City Play Area", img: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg", desc: "Play Areas for kids.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg", timings: { opening: "03:00 PM", closing: "11:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, services: ["Kids Rides", "Arcade Games", "Birthday Parties"] },
    { id: 7, name: "Green Park", img: "https://images.pexels.com/photos/158063/benches-bank-park-rest-158063.jpeg", desc: "Parks & Recreation - Family fun.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/158063/benches-bank-park-rest-158063.jpeg", timings: { opening: "06:00 AM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, services: ["Jogging Track", "Picnic Spots", "Playground"] }
];

// &&&&&&&&&&&& *MANUFACTURING DATA* &&&&&&&&&&&& \\

export const ManufacturingData = [
    {
        id: 1, name: "Kohat Foods", img: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg", desc: "Food Manufacturing & Processing.", btn_txt: "Read More",
        coverImage: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg",
        timings: { opening: "08:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
        contact: { phone: "0300-8888888", email: "info@kohatfoods.com" },
        services: ["Food Processing", "Packaging", "Distribution"],
        products: [
            { id: 401, title: "Packed Spices Mix", description: "Authentic Kohat spice blends for your kitchen.", price: "1200", image: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg" },
            { id: 402, title: "Bulk Flour (20kg)", description: "High-quality whole wheat flour directly from the mill.", price: "3200", image: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg" }
        ]
    },
    { id: 2, name: "Textile Mills", img: "https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg", desc: "Textile & Garments Factory.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg", timings: { opening: "08:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Fabric Production", "Garment Manufacturing", "Export"] },
    { id: 3, name: "Poly Plast", img: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg", desc: "Plastic Products Manufacturer.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg", timings: { opening: "08:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Plastic Molding", "Household Plastics", "Industrial Parts"] },
    { id: 4, name: "Metal Works", img: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg", desc: "Steel & Metal Fabrication.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Welding", "Steel Structures", "Metal Fabrication"] },
    { id: 5, name: "WoodCraft", img: "https://images.pexels.com/photos/3637786/pexels-photo-3637786.jpeg", desc: "Furniture Manufacturing.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/3637786/pexels-photo-3637786.jpeg", timings: { opening: "08:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Custom Furniture", "Wood Carving", "Polishing"] },
    { id: 6, name: "Build Mat", img: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg", desc: "Construction Materials Supplier.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg", timings: { opening: "08:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Cement", "Bricks", "Sand & Gravel"] },
    { id: 7, name: "Electro Equip", img: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg", desc: "Electrical Equipment Industry.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Transformers", "Switchgear", "Cables"] },
    { id: 8, name: "Chem Co", img: "https://images.pexels.com/photos/8974417/pexels-photo-8974417.jpeg", desc: "Chemical Products.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/8974417/pexels-photo-8974417.jpeg", timings: { opening: "08:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Industrial Chemicals", "Cleaning Products", "Paints"] },
    { id: 9, name: "Pack It", img: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg", desc: "Packaging Industry.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg", timings: { opening: "08:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Cartons", "Plastic Bags", "Custom Packaging"] },
    { id: 10, name: "Print Hub", img: "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg", desc: "Printing & Publishing House.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg", timings: { opening: "09:00 AM", closing: "08:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Offset Printing", "Digital Printing", "Binding"] },
    { id: 11, name: "Stone Crafters", img: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg", desc: "Marble & Stone factory.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg", timings: { opening: "08:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Marble Tiles", "Granite", "Stone Carving"] },
    { id: 12, name: "Eng Workshops", img: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg", desc: "Engineering Workshops.", btn_txt: "Read More", coverImage: "https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg", timings: { opening: "08:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }, services: ["Lathe Work", "Milling", "Repairs"] }
];

// &&&&&&&&&&&& *FREELANCERS DATA* &&&&&&&&&&&& \\

export const FreelancersData = [
    {
        id: 1, name: "Ali Raza", img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg", desc: "Graphic Designer - Logo & branding.", btn_txt: "View Profile",
        coverImage: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        timings: { opening: "10:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
        contact: { phone: "0300-7777777", email: "ali.raza@freelance.com" },
        services: ["Logo Design", "Branding", "UI/UX Design"],
        products: [
            { id: 301, title: "Premium Logo Design", description: "3 professional concepts with unlimited revisions.", price: "5,000", image: "https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg" },
            { id: 302, title: "Full Brand Identity", description: "Logo, Business Cards, Letterhead, and Social Media kit.", price: "15,000", image: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg" }
        ]
    },
    {
        id: 2, name: "Ahmed Khan", img: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg", desc: "Web Developer - Full stack.", btn_txt: "View Profile",
        coverImage: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
        timings: { opening: "10:00 AM", closing: "08:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
        contact: { phone: "0300-6666666", email: "ahmed.dev@freelance.com" },
        services: ["React Development", "Node.js", "Full Stack Web Apps"]
    },
    { id: 3, name: "Sara Khan", img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", desc: "App Developer - iOS & Android.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", timings: { opening: "09:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["iOS Apps", "Android Apps", "Flutter"] },
    { id: 4, name: "Kamran Akmal", img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg", desc: "Content Writer & Blogger.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg", timings: { opening: "10:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["SEO Writing", "Blog Posts", "Copywriting"] },
    { id: 5, name: "Bilal Ahmed", img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg", desc: "SEO Expert.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["On-Page SEO", "Link Building", "Keyword Research"] },
    { id: 6, name: "Zainab Bibi", img: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg", desc: "Digital Marketer.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg", timings: { opening: "10:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Social Media Ads", "Google Ads", "Email Marketing"] },
    { id: 7, name: "Hamza Ali", img: "https://images.pexels.com/photos/6474470/pexels-photo-6474470.jpeg", desc: "Video Editor.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/6474470/pexels-photo-6474470.jpeg", timings: { opening: "10:00 AM", closing: "07:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Video Editing", "Motion Graphics", "Post Production"] },
    { id: 8, name: "Usman Ghani", img: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg", desc: "Animator.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["2D Animation", "3D Modeling", "Character Design"] },
    { id: 9, name: "Hira Mani", img: "https://images.pexels.com/photos/3801456/pexels-photo-3801456.jpeg", desc: "UI/UX Designer.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/3801456/pexels-photo-3801456.jpeg", timings: { opening: "10:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["UI Design", "UX Research", "Prototyping"] },
    { id: 10, name: "Fahad Mustafa", img: "https://images.pexels.com/photos/2102934/pexels-photo-2102934.jpeg", desc: "Photographer.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/2102934/pexels-photo-2102934.jpeg", timings: { opening: "09:00 AM", closing: "09:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, services: ["Wedding Photography", "Event Shoots", "Product Photography"] },
    { id: 11, name: "Nida Yasir", img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", desc: "Social Media Manager.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Community Management", "Content Scheduling", "Analytics"] },
    { id: 12, name: "Tutor Pro", img: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg", desc: "Online Tutor.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/1181682/pexels-photo-1181682.jpeg", timings: { opening: "04:00 PM", closing: "10:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Math Tutoring", "Science", "English"] },
    { id: 13, name: "Virtual Aid", img: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg", desc: "Virtual Assistant.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg", timings: { opening: "09:00 AM", closing: "05:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Admin Support", "Data Entry", "Email Management"] },
    { id: 14, name: "Data Insight", img: "https://images.pexels.com/photos/5864163/pexels-photo-5864163.jpeg", desc: "Data Analyst.", btn_txt: "View Profile", coverImage: "https://images.pexels.com/photos/5864163/pexels-photo-5864163.jpeg", timings: { opening: "09:00 AM", closing: "06:00 PM", workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"] }, services: ["Data Visualization", "Python", "SQL"] }
];
