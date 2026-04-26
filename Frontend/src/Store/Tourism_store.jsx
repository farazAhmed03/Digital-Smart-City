import kohatDam from "../components/imgs/kohatdam.jpg";
import kohatTunnel from "../components/imgs/kohat_tunnel.png";
import kdaPark from "../components/imgs/kda_park.png";
import tourismImg from "../components/imgs/tourism.png";
import restaurantImg from "../components/imgs/restaurant.jpg";
import hotelImg from "../components/imgs/hotel.jpg";

import imgSahil from "../components/imgs/sahil.jpeg";
import imgSaqibullah from "../components/imgs/Saqibullah.jpg";
import imgguidelady from "../components/imgs/guideimg.jpg";
import galleryImg from "../components/imgs/gallery.jpg";
import bazarMain from "../components/imgs/bazar_main.png";
import bazarStreet from "../components/imgs/bazar_street.png";
import bazarModern from "../components/imgs/bazar_modern.png";
import bazarMeat from "../components/imgs/bazar_meat.png";
import bazarCosmetic from "../components/imgs/bazar_cosmetic.png";
import bazarCloth from "../components/imgs/bazar_cloth.png";

export const tourismCategories = [
  {
    id: "places",
    title: "Places",
    description: "Explore historical and natural attractions in Kohat",
    btn: "Explore Places",
    link: "/tourism/places",
    bgImage: kohatDam,
    icon: "fa fa-map-marker-alt",
  },
  {
    id: "parks",
    title: "Parks",
    description: "Relax in beautiful parks and picnic spots",
    btn: "View Parks",
    link: "/tourism/parks",
    bgImage: kdaPark,
    icon: "fa fa-tree",
  },
  {
    id: "hotels",
    title: "Hotels",
    description: "Find best hotels to stay in Kohat",
    btn: "Find Hotels",
    link: "/tourism/hotels",
    bgImage: hotelImg,
    icon: "fa fa-hotel",
  },
  {
    id: "restaurants",
    title: "Restaurants",
    description: "Enjoy local & traditional food",
    btn: "View Restaurants",
    link: "/tourism/restaurants",
    bgImage: restaurantImg,
    icon: "fa fa-utensils",
  },
  {
    id: "guides",
    title: "Tour Guides",
    description: "Hire professional local tour guides",
    btn: "Find Guides",
    link: "/tourism/guides",
    bgImage: tourismImg,
    icon: "fa fa-user-tie",
  },
  {
    id: "Bazar",
    title: "Bazar",
    description: "Explore local markets and shopping areas",
    btn: "View Bazar",
    link: "/tourism/bazar",
    bgImage: bazarMain,
    icon: "fa fa-shopping-bag",
  },
];

/* ================================
   CREATE LANDING DATA FUNCTION
================================ */
const createLandingData = ({
  id,
  name,
  type,
  category,
  tagline,
  about,
  aboutImage,
  bgImage,
  staff = [],
  events = [],
  gallery = [],
  contact = {},
  quickInfo = {},
  commonInfo = {},
  rating = 4.5,
  reviewsCount = 120
}) => ({
  id,
  name,
  title: name, // For backward compatibility
  type,
  category,
  tagline,
  about,
  aboutImage,
  bgImage,
  img: bgImage, // Ensuring compatibility with components using .img
  staff,
  events,
  gallery,
  contact,
  quickInfo,
  commonInfo: {
    ...defaultCommonInfo,
    ...commonInfo,
    basicInfo: {
      ...defaultCommonInfo.basicInfo,
      placeName: name,
      category: category || "",
      ...(commonInfo.basicInfo || {})
    }
  },
  rating,
  reviewsCount
});

/* ================================
   DEFAULT COMMON INFO TEMPLATE
================================ */
const defaultCommonInfo = {
  // 1) Basic Place Information
  basicInfo: {
    placeName: "",
    city: "Kohat",
    category: "",
    shortIntroduction: ""
  },
  // 2) Location & Navigation
  locationNavigation: {
    exactLocation: "",
    googleMap: "", // URL for iframe or link
    distanceFromCityCenter: "",
    howToReach: {
      byCar: "",
      byPublicTransport: "",
      parkingAvailability: ""
    }
  },
  // 3) Visiting Information
  visitingInfo: {
    openingTime: "08:00 AM",
    closingTime: "06:00 PM",
    entryFee: "Free",
    bestTimeOfDay: "Morning / Evening",
    bestSeason: "September to March"
  },
  // 4) Things to Do (Activities)
  thingsToDo: ["Sightseeing", "Photography", "Walking", "Relaxing"],
  // 5) Facilities Available
  facilities: ["Washrooms", "Sitting areas", "Nearby Parking"],
  // 6) Safety Information
  safetyInfo: {
    warnings: "Stay within designated areas.",
    restrictedAreas: "None",
    swimmingAllowed: "No",
    terrainRisks: "Slippery surfaces",
    emergencyInstructions: "Contact local security in case of any emergency."
  },
  // 7) Educational Information
  educationalInfo: {
    historicalBackground: "N/A",
    environmentalImportance: "Provides local habitat and green space.",
    culturalRelevance: "Important community gathering spot.",
    whyItMatters: "Contributes to the city's natural beauty and tourism."
  },
  // 8) Nearby Attractions
  nearbyAttractions: [], // Array of { name, distance }
  // 9) Budget Information
  budgetInfo: {
    transportCost: "Minimal",
    foodCost: "Varies",
    familyVisitEstimate: "Low"
  },
  // 10) Photos & Videos
  media: {
    photos: [],
    videos: [],
    droneShots: []
  },
  // 11) Do’s & Don’ts
  dosAndDonts: {
    dos: ["Keep the area clean", "Respect local culture", "Use dustbins"],
    donts: ["Do not litter", "No loud music", "Do not damage property"]
  }
};

/* -----------------------------
   PLACES DATA
-------------------------------- */
export const PlacesList = [
  { id: 1, name: "Toi Khula", bgImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80" },
  { id: 2, name: "KDA Park", bgImage: kdaPark },
  { id: 3, name: "Kohat Fort", bgImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80" }
  , {
    id: 4,
    name: "Tanda Dam",
    bgImage: kohatDam
  }
  , {
    id: 5,
    name: "Kohat Tunnel",
    bgImage: kohatTunnel
  }
];

export const PlacesCardsData = [
  createLandingData({
    id: 1,
    name: "Toi Khula",
    type: "Place",
    tagline: "Explore the beautiful Toi Khula valley.",
    about: "Toi Khula is a scenic valley known for its lush greenery and serene environment. A must-visit spot for nature lovers.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    staff: [],
    events: [{ title: "Valley Trekking", description: "Guided trekking tour through the valley.", icon: "MdScience" }],
    gallery: [tourismImg, galleryImg],
    contact: { email: "info@toikhula.com", phone: "+92 922 111222", website: "https://tourism.kp.gov.pk" },
    quickInfo: { facilities: ["Parking", "Rest Areas"], extraActivities: ["Photography", "Hiking"], parentReviews: ["Beautiful spot!", "Peaceful valley."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Toi Khula", city: "Kohat", category: "Valley", shortIntroduction: "A serene valley perfect for nature lovers and adventurers." },
      locationNavigation: { exactLocation: "Toi Khula, Near Kohat", googleMap: "https://www.google.com/maps/@33.5200,71.4000,15z", distanceFromCityCenter: "25 KM", howToReach: { byCar: "45 mins drive via Hangu Road", byPublicTransport: "Local vans available till nearby village" }, parkingAvailability: "Available at entrance" },
      visitingInfo: { openingTime: "Sunrise", closingTime: "Sunset", entryFee: "Free", bestTimeOfDay: "Morning", bestSeason: "Spring & Autumn" },
      thingsToDo: ["Hiking", "Nature Photography", "Bird Watching", "Picnic"],
      facilities: ["Public Restroom", "Small tuck shop", "Prayer area"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Be careful of slippery rocks near the stream.", swimmingAllowed: "In designated shallow areas only" },
      educationalInfo: { historicalBackground: "Part of the historical trade route through the Kohat hills.", environmentalImportance: "Rich in local flora and fauna.", culturalRelevance: "Popular site for local spring festivals.", whyItMatters: "Essential for local ecosystem and tourism." }
    }
  }),
  createLandingData({
    id: 2,
    name: "KDA Park",
    type: "Place",
    tagline: "Relax and unwind at KDA Park.",
    about: "KDA Park is the largest and most popular family-friendly park in Kohat featuring walking trails, picnic spots, and a small lake.",
    aboutImage: kdaPark,
    bgImage: kdaPark,
    staff: [],
    events: [{ title: "Weekend Picnic", description: "Special arrangements for weekend visitors.", icon: "FaArtstation" }],
    gallery: [kdaPark, galleryImg],
    contact: { email: "contact@kdapark.com", phone: "+92 922 555444", website: "https://kohat.gov.pk" },
    quickInfo: { facilities: ["Playground", "Restrooms", "Cafeteria"], extraActivities: ["Jogging", "Yoga Classes"], parentReviews: ["Great for kids!", "Lovely park for families."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "KDA Park", city: "Kohat", category: "Public Park", shortIntroduction: "A premier family-friendly park with hiking trails and scenic city views." },
      locationNavigation: { exactLocation: "KDA Sector, Kohat", googleMap: "https://www.google.com/maps/@33.5950,71.4500,15z", distanceFromCityCenter: "3 KM", howToReach: { byCar: "10 mins drive from city center", byPublicTransport: "Taxis and Rickshaws readily available" }, parkingAvailability: "Ample parking available" },
      visitingInfo: { openingTime: "8:00 AM", closingTime: "10:00 PM", entryFee: "Rs. 20", bestTimeOfDay: "Late Afternoon", bestSeason: "Summer Evenings & Winter Afternoons" },
      thingsToDo: ["Jogging", "Climbing the hill trails", "Family picnic", "Children's play"],
      facilities: ["Kids Play Area", "Cafeteria", "Prayer Hall", "Walkways", "Security"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Follow the marked trails when hiking.", emergencyInstructions: "Security staff available at main gate." },
      educationalInfo: { historicalBackground: "Developed by Kohat Development Authority in the late 20th century.", environmentalImportance: "Acts as 'Green Lungs' for the KDA residential area.", culturalRelevance: "A central hub for local community interaction.", whyItMatters: "Primary recreation spot for urban Kohat." }
    }
  }),
  createLandingData({
    id: 3,
    name: "Kohat Fort",
    type: "Place",
    tagline: "Historical landmark of Kohat.",
    about: "Kohat Fort is an ancient fort that stands as a symbol of Kohat's rich history and military architecture.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    staff: [],
    events: [{ title: "Historical Tours", description: "Guided tours exploring the fort's history.", icon: "FaBaseball" }],
    gallery: [tourismImg, galleryImg],
    contact: { email: "heritage@kohat.gov.pk", phone: "+92 922 123456", website: "https://heritage.kp.gov.pk" },
    quickInfo: { facilities: ["Guided Tours", "Restrooms"], extraActivities: ["Photography", "History Workshops"], parentReviews: ["Educational and fun!", "Loved the architecture."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Kohat Fort", city: "Kohat", category: "Heritage Site", shortIntroduction: "A historic fortress offering a glimpse into the colonial and pre-colonial past of the region." },
      locationNavigation: { exactLocation: "Main Road, Near Old City, Kohat", googleMap: "https://www.google.com/maps/@33.5850,71.4400,15z", distanceFromCityCenter: "1 KM", howToReach: { byCar: "5 mins from city center", byPublicTransport: "Walking distance from old city" }, parkingAvailability: "Street parking nearby" },
      visitingInfo: { openingTime: "9:00 AM", closingTime: "5:00 PM", entryFee: "Rs. 50 (Museum only)", bestTimeOfDay: "Morning", bestSeason: "Winter" },
      thingsToDo: ["Architecture study", "Photography", "Visiting the museum"],
      facilities: ["Information center", "Restrooms"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Photography might be restricted in certain military areas.", restrictedAreas: "Army sections within the fort" },
      educationalInfo: { historicalBackground: "Rebuilt by the British on older foundations, used as a key strategic outpost.", environmentalImportance: "Preserves the historical hill site.", culturalRelevance: "Represents the resilient history of the Pathan tribes.", whyItMatters: "One of the most significant landmarks of the city." }
    }
  }),
  createLandingData({
    id: 4,
    name: "Tanda Dam",
    type: "Place",
    tagline: "A peaceful lake surrounded by hills",
    about: "Tanda Dam is a scenic water reservoir and a RAMSAR site near Kohat, ideal for picnics, boating, and bird watching.",
    aboutImage: kohatDam,
    bgImage: kohatDam,
    staff: [],
    events: [{ title: "Morning Boating", description: "Enjoy serene boating in the lake.", icon: "MdNature" }],
    gallery: [kohatDam, tourismImg],
    contact: { email: "tourism@kp.gov.pk", phone: "+92 922 666777", website: "https://kptourism.com" },
    quickInfo: { facilities: ["Parking", "Washrooms", "Food stalls"], extraActivities: ["Photography", "Boating", "Picnic"], parentReviews: ["Very peaceful place", "Great for families"] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Tanda Dam", city: "Kohat", category: "Nature Reserve", shortIntroduction: "A breathtaking water reservoir and protected wetland site." },
      locationNavigation: { exactLocation: "Tanda Dam Lake, Kohat", googleMap: "https://www.google.com/maps/@33.5700,71.4000,15z", distanceFromCityCenter: "8 KM", howToReach: { byCar: "20 mins drive from city", byPublicTransport: "Pickups available from city stand" }, parkingAvailability: "Designated picnic parking" },
      visitingInfo: { openingTime: "24/7", closingTime: "No restriction (Night visits not recommended)", entryFee: "Free (Parking fee applies)", bestTimeOfDay: "Sunset", bestSeason: "Monsoon & Winter" },
      thingsToDo: ["Picnic", "Landscape photography", "Bird watching", "Lake walk"],
      facilities: ["Boat ride service", "Snack shops", "Rest areas"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Deep water. Do not go near edges during rains.", swimmingAllowed: "Strictly Prohibited" },
      educationalInfo: { historicalBackground: "Commissioned in the 1960s to support local agriculture.", environmentalImportance: "A globally recognized RAMSAR wetland for migratory birds.", culturalRelevance: "The most popular weekend spot for locals.", whyItMatters: "Crucial for irrigation and local biodiversity." }
    }
  }),
  createLandingData({
    id: 5,
    name: "Kohat Tunnel",
    type: "Place",
    tagline: "The Engineering Marvel: Pak-Japan Friendship Tunnel.",
    about: "The Kohat Tunnel is a 1.9 km long highway tunnel that connects Kohat with Peshawar, showcasing modern Japanese engineering.",
    aboutImage: kohatTunnel,
    bgImage: kohatTunnel,
    staff: [],
    events: [{ title: "Mountain Drive", description: "Experience the drive through the mountain heart.", icon: "MdNature" }],
    gallery: [kohatTunnel, tourismImg],
    contact: { email: "info@nha.gov.pk", phone: "+92 51 111", website: "https://nha.gov.pk" },
    quickInfo: { facilities: ["Well-lit", "CCTV Monitoring"], extraActivities: ["Sightseeing"], parentReviews: ["Impressive engineering.", "Saves a lot of time."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Kohat Tunnel", city: "Kohat", category: "Engineering Landmark", shortIntroduction: "A 1.9km masterpiece of engineering connecting southern districts to Peshawar." },
      locationNavigation: { exactLocation: "Indus Highway, Kohat Pass", googleMap: "https://www.google.com/maps/@33.6500,71.5000,15z", distanceFromCityCenter: "15 KM", howToReach: { byCar: "25 mins drive via Indus Highway", byPublicTransport: "All Peshawar-bound buses pass through" }, parkingAvailability: "Not allowed inside tunnel (viewpoints nearby)" },
      visitingInfo: { openingTime: "24 Hours", closingTime: "None", entryFee: "Toll Tax applies", bestTimeOfDay: "Anytime", bestSeason: "Year round" },
      thingsToDo: ["Driving experience", "Nearby mountain photography"],
      facilities: ["Emergency phones", "Air ventilation system", "24/7 surveillance"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Speed limit 60km/h. Turn on headlights.", restrictedAreas: "No stopping inside the tunnel" },
      educationalInfo: { historicalBackground: "Built with the assistance of Japan (JICA), opening in 2003.", environmentalImportance: "Reduces fuel consumption by cutting travel time.", culturalRelevance: "Symbol of Pak-Japan friendship.", whyItMatters: "Major economic artery for the region." }
    }
  })
];

/* -----------------------------
   NATURE / PARKS DATA
-------------------------------- */
export const NatureList = [
  { id: 1, name: "Toi Waterfall" },
  { id: 2, name: "KDA Hills" },
  { id: 3, name: "Jungle Point" }
];

export const NatureCardsData = [
  createLandingData({
    id: 1,
    name: "Toi Waterfall",
    type: "Park",
    tagline: "Nature's refreshing waterfall.",
    about: "Toi Waterfall is a beautiful natural waterfall surrounded by greenery, perfect for picnics and photography.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    staff: [],
    events: [{ title: "Waterfall Hike", description: "Guided hike to the waterfall.", icon: "MdScience" }],
    gallery: [tourismImg, galleryImg],
    contact: { email: "nature@kohat.gov.pk", phone: "+92 922 444555", website: "https://kptourism.com" },
    quickInfo: { facilities: ["Parking", "Rest Areas", "Picnic Tables"], extraActivities: ["Hiking", "Photography"], parentReviews: ["Refreshing spot!", "Great for nature lovers."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Toi Waterfall", city: "Kohat", category: "Nature Spot", shortIntroduction: "A natural oasis featuring a refreshing seasonal waterfall." },
      locationNavigation: { exactLocation: "Rawarpatti Hills, Near Kohat", googleMap: "https://www.google.com/maps/search/33.5300,71.3900", distanceFromCityCenter: "18 KM", howToReach: { byCar: "35 mins drive from Kohat", byPublicTransport: "Local transport available till hill base" }, parkingAvailability: "Open space parking" },
      visitingInfo: { openingTime: "Dawn", closingTime: "Dusk", entryFee: "Free", bestTimeOfDay: "Noon (for swimming)", bestSeason: "Monsoon (July-Sept)" },
      thingsToDo: ["Swimming in natural pools", "Landscape photography", "Rock climbing", "Picnic"],
      facilities: ["Nature trails", "Stone benches"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Be careful of sharp rocks. Watch out for sudden water flow during rains.", terrainRisks: "Steep and slippery paths" },
      educationalInfo: { historicalBackground: "A long-time favorite retreat for local tribes.", environmentalImportance: "Key freshwater source for local ecology.", culturalRelevance: "Symbolizes the hidden beauty of the Kohat hills.", whyItMatters: "Important for local eco-tourism." }
    }
  }),
  createLandingData({
    id: 2,
    name: "KDA Hills",
    type: "Park",
    tagline: "Hiking and panoramic city views.",
    about: "KDA Hills offers scenic hiking trails overlooking the entire Kohat city with a peaceful vibe.",
    aboutImage: kdaPark,
    bgImage: kdaPark,
    staff: [],
    events: [{ title: "Evening Hike", description: "Group hikes at sunset.", icon: "FaMountain" }],
    gallery: [kdaPark, galleryImg],
    contact: { email: "admin@kdakohat.com", phone: "+92 922 121212", website: "https://kdakohat.com" },
    quickInfo: { facilities: ["Parking", "Rest Areas"], extraActivities: ["Photography", "Bird Watching"], parentReviews: ["Amazing views!", "Great for morning hikes."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "KDA Hills", city: "Kohat", category: "Hill Park", shortIntroduction: "Elevation offering the best sunset views and hiking trails in the city." },
      locationNavigation: { exactLocation: "Phase 1, KDA, Kohat", googleMap: "https://www.google.com/maps/place/KDA+Kohat/@33.6100,71.4600", distanceFromCityCenter: "4 KM", howToReach: { byCar: "5-10 mins from city center", byPublicTransport: "Rickshaws go to hill base" }, parkingAvailability: "Available at trail start" },
      visitingInfo: { openingTime: "6:00 AM", closingTime: "11:00 PM", entryFee: "Free", bestTimeOfDay: "Evening", bestSeason: "October to March" },
      thingsToDo: ["Sunset watching", "Night photography", "Fitness trekking", "Outdoor yoga"],
      facilities: ["Paved paths", "Viewing points", "Street lights"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Stick to the main paved path after dark.", terrainRisks: "Moderate inclines" },
      educationalInfo: { historicalBackground: "Developed alongside the KDA township projects.", environmentalImportance: "Protects the hill topography from urban sprawl.", culturalRelevance: "Favorite dating and meetup spot for youth.", whyItMatters: "Increases the living quality of Kohat." }
    }
  }),
  createLandingData({
    id: 3,
    name: "Jungle Point",
    type: "Park",
    tagline: "Deep natural forest area.",
    about: "Jungle Point is a dense forested area ideal for trekking and experiencing nature in its raw form.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    staff: [],
    events: [{ title: "Eco Trek", description: "Learn about local plants.", icon: "FaTree" }],
    gallery: [tourismImg, galleryImg],
    contact: { email: "forests@kp.gov.pk", phone: "+92 91 000", website: "https://kpforests.com" },
    quickInfo: { facilities: ["Guided Tours", "Rest Areas"], extraActivities: ["Photography", "Camping"], parentReviews: ["Peaceful environment!", "Loved the forest trails."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Jungle Point", city: "Kohat", category: "Forest Reserve", shortIntroduction: "A lush, dense forest spot on the city outskirts." },
      locationNavigation: { exactLocation: "Kohat Pass Forest Range", googleMap: "https://www.google.com/maps/@33.6200,71.4800", distanceFromCityCenter: "12 KM", howToReach: { byCar: "20 mins drive north of city", byPublicTransport: "Accessible via Peshawar bound vans" }, parkingAvailability: "Open natural parking" },
      visitingInfo: { openingTime: "Sunrise", closingTime: "Evening", entryFee: "Free", bestTimeOfDay: "Early Morning", bestSeason: "September to April" },
      thingsToDo: ["Wildlife spotting", "Forest trekking", "Pine cone collecting", "Photography"],
      facilities: ["Walking tracks", "Natural seating areas"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Do not wander deep without a guide. Beware of wild boars.", restrictedAreas: "Protected research plots" },
      educationalInfo: { historicalBackground: "Part of the semi-arid forest range of southern KP.", environmentalImportance: "Critical forest cover for the Kohat valley.", culturalRelevance: "Traditional hunting grounds (now protected).", whyItMatters: "Preserves native biodiversity." }
    }
  })
];

/* -----------------------------
   BAZAR / MARKETS DATA
-------------------------------- */
export const BazarList = [
  { id: 1, name: "Main Bazar Kohat", category: "General" },
  { id: 2, name: "Old City Bazar", category: "General" },
  { id: 3, name: "Kohat Mall Area", category: "Super Market" },
  { id: 4, name: "Al-Noor Meat Shop", category: "Meat" },
  { id: 5, name: "Kohat Fresh Mutton", category: "Meat" },
  { id: 6, name: "Madina Cosmetic center", category: "Cosmetic" },
  { id: 7, name: "Glow & Shine", category: "Cosmetic" },
  { id: 8, name: "Kohat Fabrics", category: "Cloth" },
  { id: 9, name: "Heritage Silks", category: "Cloth" },
  { id: 10, name: "Step-In Shoes", category: "Shoes" },
  { id: 11, name: "Peshawari Chappal House", category: "Shoes" },
  { id: 12, name: "Green Grocery Mart", category: "Super Market" }
];

export const BazarCardsData = [
  createLandingData({
    id: 1,
    name: "Main Bazar Kohat",
    type: "Bazar",
    category: "General",
    tagline: "The heartbeat of Kohat's commerce.",
    about: "Main Bazar Kohat is one of the oldest and busiest markets in the region, offering everything from traditional spices to modern electronics.",
    aboutImage: bazarMain,
    bgImage: bazarMain,
    gallery: [bazarMain, bazarStreet, bazarModern],
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Main Bazar Kohat", city: "Kohat", category: "Traditional Market", shortIntroduction: "A historic marketplace where tradition meets modern commerce." },
      locationNavigation: { exactLocation: "Old City Center, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0 KM", howToReach: { byCar: "Directly accessible via Main Road", byPublicTransport: "All rickshaws go to main bazaar" }, parkingAvailability: "Street parking (limited)" },
      visitingInfo: { openingTime: "09:00 AM", closingTime: "09:00 PM", entryFee: "Free", bestTimeOfDay: "Evening", bestSeason: "Winter" },
      thingsToDo: ["Shopping for traditional fabrics", "Street food tasting", "Historical walk"],
      facilities: ["Public Toilets", "Prayer Area", "Benches", "Food Stalls"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Keep your belongings safe in crowded areas.", restrictedAreas: "None" },
      educationalInfo: { historicalBackground: "The bazaar dates back to the British era and has been a trade hub for over a century.", whyItMatters: "Central to the economy of the southern districts of KP." },
      budgetInfo: { transportCost: "Low", foodCost: "Low", familyVisitEstimate: "Budget Friendly" }
    }
  }),
  createLandingData({
    id: 2,
    name: "Old City Bazar",
    type: "Bazar",
    category: "General",
    tagline: "Authentic cultural shopping experience.",
    about: "Step into the past at the Old City Bazar, famous for its hand-made Peshawari Chappals and intricate embroidery work.",
    aboutImage: bazarStreet,
    bgImage: bazarStreet,
    gallery: [bazarStreet, bazarMain],
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Old City Bazar", city: "Kohat", category: "Handicrafts Market", shortIntroduction: "The best place to find authentic local handicrafts." },
      locationNavigation: { exactLocation: "Rawarpatti Side, Old Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "1 KM", howToReach: { byCar: "Drive through Hangu Road", byPublicTransport: "Local vans available" }, parkingAvailability: "Nearby public parking" },
      visitingInfo: { openingTime: "10:00 AM", closingTime: "08:00 PM", entryFee: "Free", bestTimeOfDay: "Afternoon", bestSeason: "Spring" },
      thingsToDo: ["Buying Peshawari Chappals", "Exploring embroidery shops"],
      facilities: ["Tea Shops", "Small Rest Areas"],
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Narrow streets, watch out for motorcycles.", terrainRisks: "Uneven pavement" },
      educationalInfo: { historicalBackground: "Built around the traditional residential quarters of the old city.", whyItMatters: "Preserves the authentic architectural heritage of Kohat." },
      budgetInfo: { transportCost: "Low", foodCost: "Medium", familyVisitEstimate: "Moderate" }
    }
  }),
  createLandingData({
    id: 3,
    name: "Kohat Mall Area",
    type: "Bazar",
    category: "Super Market",
    tagline: "Modern shopping and entertainment.",
    about: "A rapidly developing area with modern shopping malls and national brands.",
    aboutImage: bazarModern,
    bgImage: bazarModern,
    gallery: [bazarModern, bazarMain],
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Kohat Mall Area", city: "Kohat", category: "Modern Shopping", shortIntroduction: "Experience modern retail therapy with major national and international brands." },
      locationNavigation: { exactLocation: "KDA/Peshawar Road Area, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "3 KM", howToReach: { byCar: "10 mins drive from city center", byPublicTransport: "Main road taxis available" }, parkingAvailability: "Secure indoor parking" },
      visitingInfo: { openingTime: "11:00 AM", closingTime: "11:00 PM", entryFee: "Free", bestTimeOfDay: "Night", bestSeason: "Summer" },
      thingsToDo: ["Brand shopping", "Food court dining", "Cinema"],
      facilities: ["AC", "Elevators", "Safe Zone", "Food Court"],
      budgetInfo: { transportCost: "Medium", foodCost: "High", familyVisitEstimate: "Premium" }
    }
  }),
  createLandingData({
    id: 4,
    name: "Al-Noor Meat Shop",
    type: "Bazar",
    category: "Meat",
    tagline: "Fresh and quality meat every day.",
    about: "The most trusted meat providers in Kohat Bazar, known for fresh mutton and beef.",
    aboutImage: bazarMeat,
    bgImage: bazarMeat,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Al-Noor Meat Shop", city: "Kohat", category: "Meat Shop", shortIntroduction: "Fresh and organic meat sourced daily." },
      locationNavigation: { exactLocation: "Sabzi Mandi Road, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.5 KM", howToReach: { byCar: "5 mins from main gate", byPublicTransport: "Rickshaw stop nearby" }, parkingAvailability: "Open space" },
      visitingInfo: { openingTime: "07:00 AM", closingTime: "02:00 PM", entryFee: "Free", bestTimeOfDay: "Morning", bestSeason: "Year round" },
      facilities: ["Home Delivery", "Custom Cuts"],
      budgetInfo: { transportCost: "Low", foodCost: "Market Price", familyVisitEstimate: "Domestic" }
    }
  }),
  createLandingData({
    id: 5,
    name: "Kohat Fresh Mutton",
    type: "Bazar",
    category: "Meat",
    tagline: "Pure organic meat from local farms.",
    about: "Famous for high-quality mutton and hygienic environment.",
    aboutImage: bazarMeat,
    bgImage: bazarMeat,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Kohat Fresh Mutton", city: "Kohat", category: "Meat Shop", shortIntroduction: "Premium mutton shop in the heart of Kohat." },
      locationNavigation: { exactLocation: "Main Road, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "1 KM" },
      visitingInfo: { openingTime: "08:00 AM", closingTime: "03:00 PM", entryFee: "Free" }
    }
  }),
  createLandingData({
    id: 6,
    name: "Madina Cosmetic center",
    type: "Bazar",
    category: "Cosmetic",
    tagline: "All your beauty needs in one place.",
    about: "Specializing in local and imported cosmetics, perfumes, and jewelry.",
    aboutImage: bazarCosmetic,
    bgImage: bazarCosmetic,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Madina Cosmetic center", city: "Kohat", category: "Cosmetic Shop", shortIntroduction: "Leading cosmetic store in Kohat Bazar." },
      locationNavigation: { exactLocation: "Bangle Market, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.2 KM", howToReach: { byCar: "Walking within bazaar recommended", byPublicTransport: "Rickshaw to bazaar gate" }, parkingAvailability: "Limited" },
      visitingInfo: { openingTime: "10:00 AM", closingTime: "09:00 PM", entryFee: "Free", bestTimeOfDay: "Evening", bestSeason: "Wedding Season" },
      facilities: ["Makeup advice", "Tester available"],
      budgetInfo: { transportCost: "Low", foodCost: "N/A", familyVisitEstimate: "Shopping Budget" }
    }
  }),
  createLandingData({
    id: 7,
    name: "Glow & Shine",
    type: "Bazar",
    category: "Cosmetic",
    tagline: "Enhance your natural beauty.",
    about: "A modern cosmetics boutique with top international brands.",
    aboutImage: bazarCosmetic,
    bgImage: bazarCosmetic,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Glow & Shine", city: "Kohat", category: "Cosmetic Shop", shortIntroduction: "Modern beauty and skin care outlet." },
      locationNavigation: { exactLocation: "Phase 1 KDA, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "4 KM" },
      visitingInfo: { openingTime: "11:00 AM", closingTime: "10:00 PM", entryFee: "Free" }
    }
  }),
  createLandingData({
    id: 8,
    name: "Kohat Fabrics",
    type: "Bazar",
    category: "Cloth",
    tagline: "Traditional fabrics and modern designs.",
    about: "Extensive collection of local fabrics including embroidery and silk.",
    aboutImage: bazarCloth,
    bgImage: bazarCloth,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Kohat Fabrics", city: "Kohat", category: "Cloth Shop", shortIntroduction: "The best collection of textiles in the city." },
      locationNavigation: { exactLocation: "Cloth Market, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.3 KM", howToReach: { byCar: "Parking at city stand and walk", byPublicTransport: "Center of Bazar" }, parkingAvailability: "Bazar parking" },
      visitingInfo: { openingTime: "10:00 AM", closingTime: "08:00 PM", entryFee: "Free", bestTimeOfDay: "Noon", bestSeason: "Eid Season" },
      facilities: ["Tailoring Service", "Wholesale available"],
      budgetInfo: { transportCost: "Low", foodCost: "N/A", familyVisitEstimate: "Varies" }
    }
  }),
  createLandingData({
    id: 9,
    name: "Heritage Silks",
    type: "Bazar",
    category: "Cloth",
    tagline: "Authentic silk and heritage wear.",
    about: "Specializing in premium silks and traditional wedding attire.",
    aboutImage: bazarCloth,
    bgImage: bazarCloth,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Heritage Silks", city: "Kohat", category: "Cloth Shop", shortIntroduction: "Premium wedding and silk wear." },
      locationNavigation: { exactLocation: "Tehsil Road, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.5 KM" },
      visitingInfo: { openingTime: "10:00 AM", closingTime: "09:00 PM", entryFee: "Free" }
    }
  }),
  createLandingData({
    id: 10,
    name: "Step-In Shoes",
    type: "Bazar",
    category: "Shoes",
    tagline: "Quality footwear for all ages.",
    about: "Large variety of shoes from traditional Peshawari Chappals to modern brands.",
    aboutImage: bazarStreet,
    bgImage: bazarStreet,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Step-In Shoes", city: "Kohat", category: "Shoes Shop", shortIntroduction: "Comfortable and stylish shoes for everyone." },
      locationNavigation: { exactLocation: "Shoe Market, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.4 KM", howToReach: { byCar: "Direct road access", byPublicTransport: "Main road stop" }, parkingAvailability: "Available" },
      visitingInfo: { openingTime: "10:00 AM", closingTime: "10:00 PM", entryFee: "Free", bestTimeOfDay: "Afternoon", bestSeason: "Festivals" },
      facilities: ["Fittings", "Repairs"],
      budgetInfo: { transportCost: "Low", foodCost: "N/A", familyVisitEstimate: "Fair" }
    }
  }),
  createLandingData({
    id: 11,
    name: "Peshawari Chappal House",
    type: "Bazar",
    category: "Shoes",
    tagline: "Authentic hand-made footwear.",
    about: "Specialists in traditional hand-made Peshawari Chappals with pure leather.",
    aboutImage: bazarStreet,
    bgImage: bazarStreet,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Peshawari Chappal House", city: "Kohat", category: "Shoes Shop", shortIntroduction: "The best hand-made chappals in Kohat." },
      locationNavigation: { exactLocation: "Old City, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "1.2 KM" },
      visitingInfo: { openingTime: "09:00 AM", closingTime: "08:00 PM", entryFee: "Free" }
    }
  }),
  createLandingData({
    id: 12,
    name: "Green Grocery Mart",
    type: "Bazar",
    category: "Super Market",
    tagline: "Freshness you can trust.",
    about: "A large super market offering fresh produce, groceries, and household essentials.",
    aboutImage: bazarModern,
    bgImage: bazarModern,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Green Grocery Mart", city: "Kohat", category: "Super Market", shortIntroduction: "Your one-stop shop for fresh daily needs." },
      locationNavigation: { exactLocation: "Indus Highway Road, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "5 KM" },
      visitingInfo: { openingTime: "08:00 AM", closingTime: "11:00 PM", entryFee: "Free" },
      facilities: ["Parking", "Home Delivery", "Fresh Section"]
    }
  })
];

/* -----------------------------
   HOTELS DATA
-------------------------------- */
export const HotelsList = [
  { id: 1, name: "Pearl Continental Hotel" },
  { id: 2, name: "Kohat Galaxy Hotel" },
  { id: 3, name: "Green Hills Guest House" }
];

export const HotelCardsData = [
  createLandingData({
    id: 1,
    name: "Pearl Continental Hotel",
    type: "Hotel",
    tagline: "Luxury stay in the heart of Kohat.",
    about: "Pearl Continental offers top-notch amenities, fine dining, and comfortable rooms for a memorable stay.",
    aboutImage: hotelImg,
    bgImage: hotelImg,
    staff: [{ name: "Receptionist: Alice", image: "https://randomuser.me/api/portraits/women/44.jpg", description: "Front desk support" }],
    events: [{ title: "Gala Dinner", description: "Exclusive dinner for guests.", icon: "FaUtensils" }],
    gallery: [hotelImg, galleryImg],
    contact: { email: "info@pckohat.com", phone: "+92 922 555666", website: "https://pckohat.com" },
    quickInfo: { facilities: ["Wi-Fi", "Swimming Pool", "Parking", "Gym"], extraActivities: ["Spa", "Business Center"], parentReviews: ["Excellent service!", "Very comfortable stay."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Pearl Continental", city: "Kohat", category: "Luxury Hotel", shortIntroduction: "The most prestigious stay option in the city center." },
      locationNavigation: { exactLocation: "Cantonment Area, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.5 KM", howToReach: { byCar: "2 mins from main bazaar", byPublicTransport: "Easily accessible by rickshaw" }, parkingAvailability: "Valet & Secure self-parking" },
      visitingInfo: { openingTime: "Check-in 2 PM", closingTime: "Check-out 12 PM", entryFee: "Booking Required", bestTimeOfDay: "Evening", bestSeason: "Spring" },
      facilities: ["Swimming Pool", "Free Wi-Fi", "Continental Breakfast", "Gym", "Concierge"],
      budgetInfo: { transportCost: "Low", foodCost: "Premium", familyVisitEstimate: "High" }
    }
  }),
  createLandingData({
    id: 2,
    name: "Kohat Galaxy Hotel",
    type: "Hotel",
    tagline: "Modern comfort at affordable prices.",
    about: "Kohat Galaxy Hotel features clean, modern rooms and a central location for business travelers.",
    aboutImage: hotelImg,
    bgImage: hotelImg,
    staff: [],
    events: [],
    gallery: [hotelImg, galleryImg],
    contact: { email: "info@kohatgalaxy.com", phone: "+92 922 333444", website: "https://kohatgalaxy.com" },
    quickInfo: { facilities: ["Wi-Fi", "Room Service", "Parking"], extraActivities: ["City Tours"], parentReviews: ["Great value for money", "Very clean rooms."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Kohat Galaxy Hotel", city: "Kohat", category: "Business Hotel", shortIntroduction: "A modern facility focused on traveler convenience." },
      locationNavigation: { exactLocation: "Peshawar Road, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "2 KM", howToReach: { byCar: "10 mins from city center", byPublicTransport: "On the main bus route" }, parkingAvailability: "On-site parking available" },
      visitingInfo: { openingTime: "24/7", closingTime: "None", entryFee: "Booking Required", bestTimeOfDay: "Anytime", bestSeason: "Year round" },
      facilities: ["Restaurant", "Meeting Rooms", "Laundry Service", "High Speed Internet"],
      budgetInfo: { transportCost: "Low", foodCost: "Moderate", familyVisitEstimate: "Moderate" }
    }
  }),
  createLandingData({
    id: 3,
    name: "Green Hills Guest House",
    type: "Hotel",
    tagline: "Feel like home in the hills.",
    about: "Green Hills Guest House offers a quiet and cozy atmosphere away from the city noise.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    staff: [],
    events: [],
    gallery: [tourismImg, galleryImg],
    contact: { email: "greenhills@guest.com", phone: "+92 922 999111", website: "https://greenhills.com" },
    quickInfo: { facilities: ["Garden", "Wi-Fi", "Home Cooked Food"], extraActivities: ["Photography", "Hiking"], parentReviews: ["Beautiful views!", "Wonderful hospitality."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Green Hills Guest House", city: "Kohat", category: "Guest House", shortIntroduction: "A charming boutique stay nestled near the KDA hills." },
      locationNavigation: { exactLocation: "Near KDA Park, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "3.5 KM", howToReach: { byCar: "12 mins from city", byPublicTransport: "Van service till KDA Phase 1" }, parkingAvailability: "Secure garage" },
      visitingInfo: { openingTime: "Check-in 11 AM", closingTime: "Check-out 10 AM", entryFee: "Booking Required", bestTimeOfDay: "Morning", bestSeason: "Winter" },
      facilities: ["Private Balcony", "Hills view", "Lush Garden", "Traditional Kitchen"],
      educationalInfo: { historicalBackground: "Built in the old British bungalow style." },
      budgetInfo: { transportCost: "Moderate", foodCost: "Moderate", familyVisitEstimate: "Budget-Friendly" }
    }
  })
];

/* -----------------------------
   RESTAURANTS DATA
-------------------------------- */
export const RestaurantsList = [
  { id: 1, name: "Pearl Restaurant" },
  { id: 2, name: "Kohat Cafe" },
  { id: 3, name: "Spice Villa" }
];

export const RestaurantsCardsData = [
  createLandingData({
    id: 1,
    name: "Pearl Restaurant",
    type: "Restaurant",
    tagline: "Fine dining experience.",
    about: "Pearl Restaurant offers a wide variety of local and international cuisines in a cozy environment.",
    aboutImage: restaurantImg,
    bgImage: restaurantImg,
    staff: [{ name: "Chef John", image: "https://randomuser.me/api/portraits/men/32.jpg", description: "Head Chef" }],
    events: [{ title: "Live Music Night", description: "Classic music every Friday evening.", icon: "FaMusic" }],
    gallery: [restaurantImg, galleryImg],
    contact: { email: "info@pearlrestaurant.com", phone: "+92 300 6667788", website: "https://pearlrestaurant.com" },
    quickInfo: { facilities: ["Indoor Seating", "Outdoor Seating", "Wi-Fi"], extraActivities: ["Cooking Workshops"], parentReviews: ["Delicious food!", "Lovely ambiance."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Pearl Restaurant", city: "Kohat", category: "Upscale Dining", shortIntroduction: "An elegant restaurant famous for its Chapli Kababs and Continental menu." },
      locationNavigation: { exactLocation: "Cantonment Area, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.4 KM", howToReach: { byCar: "Inside Cantt, near main entrance", byPublicTransport: "Rickshaws stop at gate" }, parkingAvailability: "Ample secure parking" },
      visitingInfo: { openingTime: "12:00 PM", closingTime: "12:00 AM", entryFee: "Pay per dish", bestTimeOfDay: "Dinner", bestSeason: "October to April" },
      facilities: ["Private Booths", "Prayer Area", "Air Conditioning", "Valet Parking"],
      budgetInfo: { transportCost: "Low", foodCost: "High", familyVisitEstimate: "Moderate" }
    }
  }),
  createLandingData({
    id: 2,
    name: "Kohat Cafe",
    type: "Restaurant",
    tagline: "Local flavors, cozy vibes.",
    about: "Kohat Cafe is the favorite hangout for locals and travelers alike, serving traditional Peshawari Kahwa and Snacks.",
    aboutImage: restaurantImg,
    bgImage: restaurantImg,
    staff: [],
    events: [],
    gallery: [restaurantImg, galleryImg],
    contact: { email: "order@kohatcafe.com", phone: "+92 922 112233", website: "https://kohatcafe.com" },
    quickInfo: { facilities: ["Traditional Seating", "Tea Corner"], extraActivities: ["Street Photography"], parentReviews: ["Best Kahwa in town!", "Very affordable and tasty."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Kohat Cafe", city: "Kohat", category: "Traditional Cafe", shortIntroduction: "A authentic spot for local Peshawari tea and traditional snacks." },
      locationNavigation: { exactLocation: "Main Bazaar, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "0.1 KM", howToReach: { byCar: "Walking within main bazaar recommend", byPublicTransport: "Center of the city" }, parkingAvailability: "Difficult in bazaar area" },
      visitingInfo: { openingTime: "8:00 AM", closingTime: "11:00 PM", entryFee: "Very affordable", bestTimeOfDay: "Morning & Late Night", bestSeason: "Winter" },
      facilities: ["Outdoor roadside seating", "Takeaway"],
      budgetInfo: { transportCost: "Low", foodCost: "Low", familyVisitEstimate: "Very Low" }
    }
  }),
  createLandingData({
    id: 3,
    name: "Spice Villa",
    type: "Restaurant",
    tagline: "Experience the true spice of Kohat.",
    about: "Spice Villa specializes in traditional barbecue and spicy local curries with a modern twist.",
    aboutImage: restaurantImg,
    bgImage: restaurantImg,
    staff: [],
    events: [],
    gallery: [restaurantImg, galleryImg],
    contact: { email: "spice@villa.com", phone: "+92 922 444111", website: "https://spicevilla.pk" },
    quickInfo: { facilities: ["AC Hall", "Family Area", "Parking"], extraActivities: ["Live BBQ"], parentReviews: ["Best BBQ in the city.", "Friendly staff."] },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Spice Villa", city: "Kohat", category: "BBQ & Desi", shortIntroduction: "A family restaurant dedicated to spicy traditional cuisine." },
      locationNavigation: { exactLocation: "Rawarpatti Road, Kohat", googleMap: "https://maps.app.goo.gl/KohatMapArea", distanceFromCityCenter: "3 KM", howToReach: { byCar: "Direct road from city center", byPublicTransport: "Rickshaws available" }, parkingAvailability: "Free on-site parking" },
      visitingInfo: { openingTime: "3:00 PM", closingTime: "11:30 PM", entryFee: "Competitive prices", bestTimeOfDay: "Dinner", bestSeason: "Year round" },
      facilities: ["Separate Family Hall", "AC", "Traditional Majlis seating"],
      budgetInfo: { transportCost: "Moderate", foodCost: "Moderate", familyVisitEstimate: "Moderate" }
    }
  })
];

/* -----------------------------
   GALLERY IMAGES
-------------------------------- */
export const GalleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", bgImage: "https://images.unsplash.com/photo-1501183638710-841dd1904471" },
  { id: 2, src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d", bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
  { id: 3, src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", bgImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511" },
  { id: 4, src: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66", bgImage: "https://images.unsplash.com/photo-1500534623283-312aade485b7" },
  { id: 5, src: "https://images.unsplash.com/photo-1500534623283-312aade485b7", bgImage: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66" }
];

/* -----------------------------
   TRAVEL GUIDE
-------------------------------- */
export const GuideContent = [
  createLandingData({
    id: 1,
    name: "How to Reach Kohat?",
    type: "Guide",
    tagline: "Your gateway to the southern districts.",
    about: "Kohat is well-connected by road to major cities like Peshawar and Islamabad through the Kohat Tunnel and Indus Highway.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    contact: { email: "transport@kohat.gov.pk", phone: "+92 922 111", website: "https://nha.gov.pk" },
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Travel Guide: Reaching Kohat", city: "Kohat", category: "Logistics", shortIntroduction: "A comprehensive guide on reaching Kohat via various transport modes." },
      locationNavigation: { exactLocation: "Indus Highway, KP, Pakistan", howToReach: { byCar: "2.5 hours from Islamabad, 1 hour from Peshawar", byPublicTransport: "Buses available from Daewoo and General Bus Stands" } },
      budgetInfo: { transportCost: "Affordable", familyVisitEstimate: "Flexible" }
    }
  }),
  createLandingData({
    id: 2,
    name: "Best Time to Visit",
    type: "Guide",
    tagline: "Plan your trip for the perfect weather.",
    about: "The best time to visit Kohat is between October and March when the weather is pleasantly cool and ideal for outdoor exploration.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Travel Guide: Weather & Timing", city: "Kohat", category: "Planning", shortIntroduction: "Expert advice on seasonal patterns and the best months to plan your trip." },
      visitingInfo: { bestSeason: "October to March", openingTime: "Anytime", closingTime: "Anytime", entryFee: "Free" }
    }
  }),
  createLandingData({
    id: 3,
    name: "Tourism Safety Tips",
    type: "Guide",
    tagline: "Stay safe while exploring.",
    about: "Kohat is generally safe for tourists, but it's always good to follow local customs and stay aware of your surroundings.",
    aboutImage: tourismImg,
    bgImage: tourismImg,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Travel Guide: Safety & Ethics", city: "Kohat", category: "Safety", shortIntroduction: "Important safety protocols and cultural etiquette for visitors." },
      safetyInfo: { ...defaultCommonInfo.safetyInfo, warnings: "Respect local tribal customs. Avoid unauthorized photography in restricted areas." }
    }
  }),
  createLandingData({
    id: 4,
    name: "Local Cuisine Guide",
    type: "Guide",
    tagline: "A taste of traditional flavors.",
    about: "Don't miss the famous Kohat Chapli Kebab and the traditional Peshawari Kahwa during your visit.",
    aboutImage: restaurantImg,
    bgImage: restaurantImg,
    commonInfo: {
      ...defaultCommonInfo,
      basicInfo: { placeName: "Travel Guide: Food & Dining", city: "Kohat", category: "Culinary", shortIntroduction: "A foodie's roadmap to the best traditional dishes in the city." },
      thingsToDo: ["Try Chapli Kebab at Main Bazaar", "Traditional Breakfast at Cantonment", "Kahwa session at night"]
    }
  })
];

/* -----------------------------
   TOUR GUIDES DATA (PEOPLE)
-------------------------------- */
export const TourGuidesList = [
  { id: 1, name: "Salma" },
  { id: 2, name: "Syed Sahil Shah" },
  { id: 3, name: "Saqibullah" }
];

export const TourGuidesCardsData = [
  createLandingData({
    id: 1,
    name: "Salma",
    type: "Tour Guide",
    tagline: "Expert in Historical & Natural Sites of Kohat",
    about: "With over 10 years of experience, I specialize in taking tourists through the hidden gems of Kohat, from the historical Fort to the serene Tanda Dam.",
    aboutImage: imgguidelady,
    bgImage: imgguidelady,
    contact: { phone: "+92 321 1234567", email: "salma.guide@example.com" },
    rating: 4.9,
    reviewsCount: 45,
    commonInfo: {
      basicInfo: { shortIntroduction: "Friendly and knowledgeable guide with deep roots in Kohat.", city: "Kohat", category: "History & Nature" },
      visitingInfo: { entryFee: "Rs. 2000 / Day", openingTime: "08:00 AM", closingTime: "06:00 PM" }
    }
  }),
  createLandingData({
    id: 2,
    name: "Syed Sahil Shah",
    type: "Tour Guide",
    tagline: "Nature & Adventure Specialist",
    about: "Specializing in mountain trekking and wildlife photography. I know every trail in the Kohat hills and the best spots for bird watching at Tanda Dam.",
    aboutImage: imgSahil,
    bgImage: imgSahil,
    contact: { phone: "+92 333 9876543", email: "sahilkhan536ah@gmail.com" },
    rating: 4.8,
    reviewsCount: 32,
    commonInfo: {
      basicInfo: { shortIntroduction: "Adventurous guide for those who love to explore the wild side of Kohat.", city: "Kohat", category: "Adventure" },
      visitingInfo: { entryFee: "Rs. 2500 / Day", openingTime: "06:00 AM", closingTime: "07:00 PM" }
    }
  }),
  createLandingData({
    id: 3,
    name: "Saqibullah",
    type: "Tour Guide",
    tagline: "Cultural & Culinary Guide",
    about: "Let me take you on a journey through the flavors of Kohat. From the best Chapli Kebab stands to deep historical insights into the local tribal culture.",
    aboutImage: imgSaqibullah,
    bgImage: imgSaqibullah,
    contact: { phone: "+92 345 5554433", email: "saqibullah925@gmail.com" },
    rating: 4.7,
    reviewsCount: 28,
    commonInfo: {
      basicInfo: { shortIntroduction: "Passionate storyteller and foodie who loves sharing Kohat's heritage.", city: "Kohat", category: "Culture & Food" },
      visitingInfo: { entryFee: "Rs. 1500 / Half Day", openingTime: "09:00 AM", closingTime: "10:00 PM" }
    }
  })
];

/* -----------------------------
   TOURISM PROVIDER DASHBOARD DATA
-------------------------------- */
export const Tourism_Provider_Details = [
  {
    id: 1,
    name: "Syed Sahil Shah",
    type: "Tour Guide",
    verificationStatus: "Verified",
    badgeLevel: "Gold",
    profileViews: 1205,
    calls: 45,
    whatsapp: 82,
    requestsCount: 15,
    rating: 4.8,
    reportsCount: 2,
    warningLevel: "Low",
    subscriptionPlan: "Verified Plan",
    subscriptionExpiry: "2026-05-15",
    offerings: [
      { id: 101, title: "Full Day City Tour", desc: "8 hours guided tour of Kohat City & Fort", price: "3000", availability: "Available" },
      { id: 102, title: "Tanda Dam Bird Watching", desc: "4 hours morning session with equipment", price: "1500", availability: "Weekend Only" }
    ],
    requests: [
      { id: 1001, user: "Ali Khan", service: "Full Day City Tour", date: "2026-01-12", status: "Pending", contact: "0300-1234567" },
      { id: 1002, user: "John Doe", service: "Tanda Dam Trip", date: "2026-01-15", status: "Confirmed", contact: "0333-9876543" }
    ],
    reviews: [
      { id: 501, user: "Hamza", rating: 5, comment: "Best guide ever!", date: "2025-12-20", reply: "Thanks Hamza!" },
      { id: 502, user: "Sara", rating: 4, comment: "Good experience but bit late", date: "2025-12-25", reply: "" }
    ],
    reports: [
      { id: 1, reason: "Late Arrival", status: "Resolved", date: "2025-11-10" },
      { id: 2, reason: "Price dispute", status: "Pending", date: "2026-01-05" }
    ]
  }
];
