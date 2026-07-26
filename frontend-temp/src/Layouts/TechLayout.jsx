import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar/Navbar"
import Footer from "../components/footer/Footer"

export const TechLayout = () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                {/* Children Pages Will Render here */}
                <Outlet />
            </main>
            <Footer />
        </>
    )
}