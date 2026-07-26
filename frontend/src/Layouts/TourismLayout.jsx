// src/Layouts/TourismLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export const TourismLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet /> {/* This will render TourismHome or other tourism child pages */}
      </main>
      <Footer />
    </>
  );
};
