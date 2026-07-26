// Central store for Hospital-related categories and details
// Exports lists for sidebar, card data for listing, and detailed objects for SingleLandingPage

// ========================================
// HEALTH HOME - Specialists , Pharmacies & Emergency
// ========================================
export const healthCategories = [
    {
        title: "Specialists",
        link: "specialists",
        description:
            "Find experienced medical specialists across multiple fields including cardiology, dermatology, orthopedics and more. Explore doctor profiles, qualifications, experience, and book appointments easily.",
        btn: "Find Specialists",
        image:
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80"
    },
    {
        title: "Pharmacies",
        link: "pharmacies",
        description:
            "Locate trusted pharmacies, browse available medicines, check pharmacy services, and find nearby medical stores for quick and reliable healthcare support.",
        btn: "Coming Soon",
        image:
            "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80"
    },
    {
        title: "Emergency",
        link: "emergency",
        description:
            "Emergency healthcare services including ambulance support, urgent care facilities, and nearby emergency medical centers will be available here soon.",
        btn: "Coming Soon",
        image:
            "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
    },
];


export const Hospitals = [
  { HospitalName: "Kohat General Hospital", id: 1 },
  { HospitalName: "City Care Hospital", id: 2 },
  { HospitalName: "St. Mary Medical Center", id: 3 }
];

export const HospitalCardDta = [
  { img: "https://images.pexels.com/photos/416754/pexels-photo-416754.jpeg", InstName: "Kohat General Hospital", Desc: "General & emergency care with modern facilities.", id: "1", btn_txt: "Read More" },
  { img: "https://images.pexels.com/photos/40568/hospital-medical-healthcare-doctor-40568.jpeg", InstName: "City Care Hospital", Desc: "24/7 emergency and outpatient services.", id: "2", btn_txt: "Read More" },
  { img: "https://images.pexels.com/photos/263402/healthcare-doctor-medicine-health-263402.jpeg", InstName: "St. Mary Medical Center", Desc: "Specialist departments and diagnostics.", id: "3", btn_txt: "Read More" }
];

export const Hospital_Details = [
  {
    id: 1,
    type: "Hospital",
    name: "Kohat General Hospital",
    tagline: "Comprehensive healthcare for the community.",
    about: "Kohat General Hospital provides emergency, surgical, and inpatient care with a focus on accessible services for all residents.",
    aboutImage: "https://images.pexels.com/photos/416754/pexels-photo-416754.jpeg",
    staff: [
      { name: "Dr. Aftab", description: "Chief Surgeon", image: "https://images.pexels.com/photos/3845767/pexels-photo-3845767.jpeg" },
      { name: "Dr. Samina", description: "Head of Pediatrics", image: "https://images.pexels.com/photos/5212325/pexels-photo-5212325.jpeg" }
    ],
    events: [{ title: "Free Health Camp", description: "Monthly community health camp.", icon: "MdScience" }],
    quickInfo: {
      basicProfile: { name: "Kohat General Hospital", location: "Kohat", type: "Public" },
      administration: { principal: "Dr. Liaqat", adminOffice: "0300-1112223", phone: "092-92123452", email: "info@kohathospital.pk", website: "https://kohathospital.example" },
      studentsStaff: { totalStaff: "120+", totalDoctors: "40+" },
      facilities: ["Emergency", "Imaging", "Laboratory", "Pharmacy"],
      fees: { consultation: "Varies" },
      resultsPerformance: { passPercentage: "N/A" },
      timings: { timing: "24/7", break: "N/A", seasonalSchedules: false },
      extraActivities: ["Health Camps"],
      parentReviews: ["Reliable emergency services."]
    },
    gallery: ["https://images.pexels.com/photos/416754/pexels-photo-416754.jpeg"],
    contact: { email: "contact@kohathospital.pk", phone: "+92 300 1234567", website: "https://kohathospital.example" }
  },
  {
    id: 2,
    type: "Hospital",
    name: "City Care Hospital",
    tagline: "Quality outpatient and diagnostic services.",
    about: "City Care is known for quick diagnostics, outpatient clinics, and compassionate care.",
    aboutImage: "https://images.pexels.com/photos/40568/hospital-medical-healthcare-doctor-40568.jpeg",
    staff: [{ name: "Dr. Naveed", description: "Physician", image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" }],
    events: [],
    quickInfo: { basicProfile: { name: "City Care Hospital", location: "Kohat", type: "Private" }, administration: { principal: "Dr. Asif", adminOffice: "0300-2223334", phone: "092-92123453", email: "info@citycare.example", website: "https://citycare.example" }, studentsStaff: {}, facilities: ["OPD", "Diagnostics"], fees: {}, resultsPerformance: {}, timings: { timing: "8:00 AM - 10:00 PM" }, extraActivities: [], parentReviews: [] },
    gallery: ["https://images.pexels.com/photos/40568/hospital-medical-healthcare-doctor-40568.jpeg"],
    contact: { email: "info@citycare.example", phone: "+92 300 7654321", website: "https://citycare.example" }
  },
  {
    id: 3,
    type: "Hospital",
    name: "St. Mary Medical Center",
    tagline: "Specialized care with experienced teams.",
    about: "St. Mary offers cardiology, orthopedics, and maternal care with modern equipment.",
    aboutImage: "https://images.pexels.com/photos/263402/healthcare-doctor-medicine-health-263402.jpeg",
    staff: [],
    events: [],
    quickInfo: { basicProfile: { name: "St. Mary Medical Center", location: "Kohat", type: "Private" }, administration: {}, studentsStaff: {}, facilities: ["Cardiology", "Maternity", "Orthopedics"], fees: {}, resultsPerformance: {}, timings: { timing: "24/7" }, extraActivities: [], parentReviews: [] },
    gallery: ["https://images.pexels.com/photos/263402/healthcare-doctor-medicine-health-263402.jpeg"],
    contact: { email: "contact@stmary.example", phone: "+92 300 9988776", website: "https://stmary.example" }
  }
];

// Clinics
export const Clinics = [
  { ClinicName: "Downtown Clinic", id: 1 },
  { ClinicName: "Family Health Center", id: 2 }
];

export const ClinicCardDta = [
  { img: "https://images.pexels.com/photos/433267/pexels-photo-433267.jpeg", InstName: "Downtown Clinic", Desc: "Primary care and specialist consultations.", id: "1", btn_txt: "Read More" },
  { img: "https://images.pexels.com/photos/1170976/pexels-photo-1170976.jpeg", InstName: "Family Health Center", Desc: "Family medicine and preventive care.", id: "2", btn_txt: "Read More" }
];

export const Clinic_Details = [
  { id: 1, type: "Clinic", name: "Downtown Clinic", tagline: "Accessible primary care.", about: "Friendly clinic with GP consultations.", aboutImage: "", staff: [], events: [], quickInfo: { basicProfile: { name: "Downtown Clinic", location: "Kohat", type: "Clinic" }, administration: {}, studentsStaff: {}, facilities: [], fees: {}, resultsPerformance: {}, timings: { timing: "9:00 AM - 6:00 PM" } }, gallery: [], contact: { email: "info@downtownclinic.example", phone: "+92 300 1112223", website: "" } },
  { id: 2, type: "Clinic", name: "Family Health Center", tagline: "Comprehensive family care.", about: "Preventive and routine healthcare for families.", aboutImage: "", staff: [], events: [], quickInfo: {}, gallery: [], contact: {} }
];

// Pharmacies
export const Pharmacies = [ { PharmacyName: "Central Pharmacy", id: 1 } ];
export const PharmacyCardDta = [ { img: "https://images.pexels.com/photos/5938/healthcare-medicine-doctor-nurse.jpg", InstName: "Central Pharmacy", Desc: "Open late with delivery service.", id: "1", btn_txt: "Read More" } ];
export const Pharmacy_Details = [ { id: 1, type: "Pharmacy", name: "Central Pharmacy", tagline: "Medicine & supplies.", about: "Local pharmacy providing medicines and basic healthcare supplies.", aboutImage: "", staff: [], events: [], quickInfo: {}, gallery: [], contact: { phone: "+92 300 2223334", email: "pharmacy@example" } } ];

// Diagnostics
export const Diagnostics = [ { DiagnosticName: "Advanced Diagnostics", id: 1 } ];
export const DiagnosticCardDta = [ { img: "https://images.pexels.com/photos/416754/pexels-photo-416754.jpeg", InstName: "Advanced Diagnostics", Desc: "Lab & imaging services.", id: "1", btn_txt: "Read More" } ];
export const Diagnostic_Details = [ { id: 1, type: "Diagnostic", name: "Advanced Diagnostics", tagline: "Accurate lab and imaging.", about: "Full-service laboratory and imaging center.", aboutImage: "", staff: [], events: [], quickInfo: {}, gallery: [], contact: {} } ];

// Ambulance
export const Ambulance = [ { ServiceName: "24/7 Ambulance", id: 1 } ];
export const AmbulanceCardDta = [ { img: "https://images.pexels.com/photos/54266/pexels-photo-54266.jpeg", InstName: "24/7 Ambulance", Desc: "Fast emergency transport.", id: "1", btn_txt: "Call" } ];
export const Ambulance_Details = [ { id: 1, type: "Ambulance", name: "24/7 Ambulance", tagline: "Emergency transport services.", about: "Rapid response ambulance services with trained staff.", aboutImage: "", staff: [], events: [], quickInfo: {}, gallery: [], contact: { phone: "+92 300 4445556" } } ];

// Specialists
export const Specialists = [ { SpecialistName: "Cardiology", id: 1 }, { SpecialistName: "Orthopedics", id: 2 } ];
export const SpecialistCardDta = [ { img: "https://images.pexels.com/photos/532758/doctor-medicine-healthcare-health-532758.jpeg", InstName: "Cardiology Clinic", Desc: "Expert heart care specialists.", id: "1", btn_txt: "Read More" } ];
export const Specialist_Details = [ { id: 1, type: "Specialist", name: "Cardiology Clinic", tagline: "Heart specialists and diagnostics.", about: "Expert cardiologists providing diagnostics and treatment.", aboutImage: "", staff: [], events: [], quickInfo: {}, gallery: [], contact: {} } ];

export default {
  Hospitals,
  HospitalCardDta,
  Hospital_Details,
  Clinics,
  ClinicCardDta,
  Clinic_Details,
  Pharmacies,
  PharmacyCardDta,
  Pharmacy_Details,
  Diagnostics,
  DiagnosticCardDta,
  Diagnostic_Details,
  Ambulance,
  AmbulanceCardDta,
  Ambulance_Details,
  Specialists,
  SpecialistCardDta,
  Specialist_Details
};
