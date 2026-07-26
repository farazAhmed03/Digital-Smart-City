import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt, FaClock, FaHiking, FaHistory, FaShieldAlt,
  FaBus, FaCar, FaStar, FaLeaf, FaExternalLinkAlt, FaDollarSign,
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaWalking,
  FaCamera, FaShoppingBag, FaUsers, FaArrowLeft, FaSuitcase, FaMap, FaLocationArrow, FaDirections, FaWhatsapp
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "../../../utils/fixLeafletIcon";
import "./SingleLandingPage.css";
import { BookingForm } from "./BookingForm";

// --- Custom Routing Control Component ---
const MapRoutingControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end || !map) return;

    // Create the routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#027646", weight: 5, opacity: 0.9 }]
      },
      createMarker: function (i, waypoint, n) {
        // Use default markers or custom ones - passing null to use default for now
        // or effectively relying on the map's existing markers if we wanted to hide these.
        // For clarity, we'll let it create default markers for start/end of route.
        return L.marker(waypoint.latLng, {
          draggable: false,
          icon: new L.Icon.Default()
        });
      },
      addWaypoints: false // Disable adding new waypoints by dragging line (optional)
    }).addTo(map);

    return () => {
      // Cleanup routing control on unmount or update
      if (map && routingControl) {
        try {
          map.removeControl(routingControl);
        } catch (e) {
          console.warn("Routing control cleanup error", e);
        }
      }
    };
  }, [start, end, map]);

  return null;
};

// Helper component to recenter map
const MapRecenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13);
    }
  }, [position, map]);
  return null;
};

// Helper: Extract Lat/Lng from Google Maps URL
const extractCoordsFromUrl = (url) => {
  if (!url) return null;

  // Patterns for different Google Maps URL formats
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,        // @lat,lng
    /q=(-?\d+\.\d+),(-?\d+\.\d+)/,        // q=lat,lng
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,     // !3dlat!4dlng (embed/data style)
    /search\/(-?\d+\.\d+),(-?\d+\.\d+)/   // search/lat,lng
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
  }
  return null;
};

export const TourismLandingPage = ({ listing: propListing }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // Accept listing from either props (Guide sidebar) or state (category cards)
  const listing = propListing || state?.listing;

  if (!listing) return <div className="no-data"><FaExclamationTriangle /> <h2>Data not found. Please browse from categories.</h2><button onClick={() => navigate("/tourism")}>Back to Tourism</button></div>;

  const info = listing.commonInfo || {};
  const {
    basicInfo: basic = {},
    locationNavigation: locationNav = {},
    visitingInfo: visit = {},
    educationalInfo: edu = {},
    safetyInfo: safety = {},
    budgetInfo: budget = {},
    dosAndDonts = {},
    nearbyAttractions = [],
    thingsToDo = [],
    facilities = [],
    media = {}
  } = info;

  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  // Calculate destination coords from google map link or use default
  const destinationCoords = useMemo(() => {
    const extracted = extractCoordsFromUrl(locationNav.googleMap);
    return extracted || [33.5889, 71.4429]; // Default to Kohat Center
  }, [locationNav.googleMap]);

  const handleGetLocation = () => {
    setLocationStatus("Locating...");
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLocationStatus("Location Found!");
      },
      (error) => {
        console.error(error);
        setLocationStatus("Unable to retrieve location");
      }
    );
  };

  const handleGetDirections = () => {
    if (userLocation) {
      setIsNavigating(true);
      setLocationStatus("Calculating Route...");
    } else {
      setLocationStatus("Please use 'Use My Location' first.");
    }
  };

  return (
    <section className="S_main_Sec">
      {/* GLASSMORPHISM HERO */}
      <section className="GlassHeroBG" style={{ backgroundImage: `url(${listing.bgImage || listing.img})` }}>
        <div className="GlassHeroBG-content">
          <span className="category-badge">{basic.category || listing.type}</span>
          <h1>Explore <strong>{listing.name}</strong></h1>
          <p className="GlassHeroBG-sub">{listing.tagline}</p>
          <div className="hero-rating-meta">
            <FaStar className="star-icon" /> {listing.rating} ({listing.reviewsCount} Reviews)
          </div>
          <div className="hero-action-buttons">
            <button className="GlassHeroBG-btn" onClick={() => { navigate(-1) }}> <FaArrowLeft /> Go Back</button>
            <button className="GlassHeroBG-btn contact-btn" onClick={() => {
              // Use WhatsApp number from listing or default to a dummy one
              const phone = listing.contact?.phone?.replace(/\D/g, '') || "923000000000";
              const message = `Hello, I saw your listing for ${listing.name} on Digital Kohat and want to know more.`;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
            }}> <FaWhatsapp /> Contact Service Provider</button>
          </div>
        </div>
        <div className="blurShape s1"></div>
        <div className="blurShape s2"></div>
      </section>

      {/* ABOUT SECTION */}
      <section id="S_about" className="S_about">
        <div className="S_about-content">
          <h2 className="SP_Sec_hd">About Destination</h2>
          <p>{basic.shortIntroduction || listing.about}</p>
        </div>
        <img src={listing.aboutImage} alt={listing.name} />
      </section>

      {/* QUICK INFO DASHBOARD (Mapping 11 fields) */}
      <section className="QI-dashboard SP_Sec">
        <h2 className="dash-title SP_Sec_hd">Tourism Information Dashboard</h2>
        <div className="dash-grid">
          {/* 1. Basic Profile */}
          <div className="dash-card">
            <h2>📍 Basic Information</h2>
            <ul>
              <li><strong>Name:</strong> {listing.name}</li>
              <li><strong>City/Area:</strong> {basic.city}</li>
              <li><strong>Category:</strong> {basic.category || listing.type}</li>
            </ul>
          </div>

          {/* 2 & 3. Location & Timings */}
          <div className="dash-card">
            <h2>⏰ Visiting Info</h2>
            <ul>
              <li><strong>Timings:</strong> {visit.openingTime} - {visit.closingTime}</li>
              <li><strong>Best Time:</strong> {visit.bestTimeOfDay}</li>
              <li><strong>Best Season:</strong> {visit.bestSeason}</li>
            </ul>
          </div>

          {/* Fees Structure */}
          <div className="dash-card">
            <h2>🎫 Entry & Fees</h2>
            <ul>
              <li><strong>Entry Fee:</strong> {visit.entryFee}</li>
              <li><strong>Budget Trip:</strong> {budget.familyVisitEstimate}</li>
            </ul>
          </div>

          {/* Location Navigation */}
          <div className="dash-card">
            <h2>🚗 How To Reach</h2>
            <ul>
              <li><strong>By Car:</strong> {locationNav.howToReach?.byCar}</li>
              <li><strong>Public:</strong> {locationNav.howToReach?.byPublicTransport}</li>
              <li><strong>Distance:</strong> {locationNav.distanceFromCityCenter}</li>
            </ul>
          </div>

          {/* Facilities */}
          <div className="dash-card">
            <h2>🏨 Facilities</h2>
            <ul className="scrollable-list">
              {facilities.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
          </div>

          {/* Safety Information */}
          <div className="dash-card">
            <h2>🛡 Safety & Rules</h2>
            <ul className="scrollable-list">
              <li><strong>Swimming:</strong> {safety.swimmingAllowed}</li>
              <li><strong>Warnings:</strong> {safety.warnings}</li>
            </ul>
          </div>

          {/* Educational Information */}
          <div className="dash-card">
            <h2>📖 Educational</h2>
            <ul className="scrollable-list">
              <li><strong>History:</strong> {edu.historicalBackground}</li>
              <li><strong>Significance:</strong> {edu.whyItMatters}</li>
            </ul>
          </div>

          {/* Nearby Attractions */}
          <div className="dash-card">
            <h2>🗺 Nearby Spots</h2>
            <ul className="scrollable-list">
              {nearbyAttractions.map((att, i) => <li key={i}>{att.name} ({att.distance})</li>)}
            </ul>
          </div>

          {/* Dos & Don'ts */}
          <div className="dash-card">
            <h2>⭐ Visitor Feedback</h2>
            <blockquote className="scrollable-list">
              "One of the best places in Kohat. Highly recommended!"
            </blockquote>
          </div>
        </div>
      </section>

      {/* THINGS TO DO (EVENTS STYLE) */}
      <section className="S_events SP_Sec">
        <h2 className="SP_Sec_hd">Things To Do</h2>
        <div className="S_event-list">
          {thingsToDo.map((act, index) => (
            <div key={index} className="S_event-card">
              <FaWalking className="SP_Icon" />
              <h3>{act}</h3>
              <p>Enjoy {act.toLowerCase()} at {listing.name}.</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="S_gallery" className="S_gallery SP_Sec">
        <h2 className="SP_Sec_hd">Gallery</h2>
        <div className="S_gallery-flex">
          {listing.gallery?.map((img, index) => <img key={index} src={img} alt="" />)}
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="S_map_Sec SP_Sec">
        <h2 className="SP_Sec_hd">Discover in Kohat</h2>

        {/* Location Controls */}
        <div className="map-controls-panel">
          <div className="location-status">
            {locationStatus && <span className="status-badge">{locationStatus}</span>}
          </div>
          <div className="control-buttons">
            <button className="control-btn locate-btn" onClick={handleGetLocation}>
              <FaLocationArrow /> Use My Location
            </button>
            <button className="control-btn navigate-btn" onClick={handleGetDirections}>
              <FaDirections /> Get Directions
            </button>
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer center={destinationCoords} zoom={13} scrollWheelZoom={false} className="leaflet-container-landing">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Destination Marker */}
            <Marker position={destinationCoords}>
              <Popup>
                <strong>{listing.name}</strong> <br />
                {basic.city}, Pakistan
              </Popup>
            </Marker>

            {/* User Location Marker */}
            {userLocation && (
              <>
                <Marker position={userLocation}>
                  <Popup>
                    <strong>You are here</strong>
                  </Popup>
                </Marker>
                {!isNavigating && <MapRecenter position={userLocation} />}
              </>
            )}

            {/* In-Map Navigation */}
            {isNavigating && userLocation && (
              <MapRoutingControl start={userLocation} end={destinationCoords} />
            )}
          </MapContainer>
        </div>
      </section>

      {/* BOOKING FORM (Only for Hotels/Stays) */}
      {(basic.category?.toLowerCase().includes("hotel") || listing.type?.toLowerCase().includes("hotel") || basic.category?.toLowerCase().includes("stay") || basic.category?.toLowerCase().includes("guest house")) && (
        <BookingForm hotelName={listing.name} />
      )}

      {/* REACH US */}
      <section className="S_reach-us SP_Sec">
        <h2 className="SP_Sec_hd">Connect With Us</h2>
        <div className="S_contact-cards">
          <div className="S_card">
            <i><FaMapMarkerAlt /></i>
            <h3>Exact Location</h3>
            <p>{locationNav.exactLocation}</p>
          </div>
          <div className="S_card">
            <i><FaExternalLinkAlt /></i>
            <h3>Navigation</h3>
            <a href={locationNav.googleMap} target="" rel="noreferrer">Open in Google Maps</a>
          </div>
          <div className="S_card">
            <i><FaUsers /></i>
            <h3>Official Site</h3>
            <p>visit-kohat.gov.pk</p>
          </div>
        </div>
      </section>
    </section>
  );
};
