import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export const EduLayout = () => {
    const location = useLocation();

    const isDashboard = location.pathname.includes("dashboard");
    return (
        <>
            <header>
                <Navbar variant={isDashboard ? "dashboard" : "public"} />
            </header>
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}