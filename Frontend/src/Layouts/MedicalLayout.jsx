import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export const MedicalLayout = () => {
    const location = useLocation();

    const isDashboard = location.pathname.includes("dashboard") || 
                       location.pathname.includes("consultation") ||
                       location.pathname.includes("doctor") ||
                       location.pathname.includes("patient") ||
                       location.pathname.includes("admin");
    
    return (
        <>
            <header>
                <Navbar variant={isDashboard ? "dashboard" : "public"} />
            </header>
            <main>
                <Outlet />
            </main>
            {!isDashboard && <Footer />}
        </>
    )
}
