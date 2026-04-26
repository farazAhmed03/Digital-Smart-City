import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Hero2 from "./components/hero2/Hero2";
import Cards from "./components/cards/Cards";
import WhyChooseUs from "./components/whychooseus/Whychooseus";
import Location from "./components/location/Location";
import Footer from "./components/footer/Footer";
import Hero1 from "./components/hero1/Hero1";
import Vision from "./components/vision/Vision";
import Freq from "./components/freq/Freq";


function App() {
  return (
    <>
      <header>
        <Navbar />
        <Hero1 />
        <Vision/>
      </header>
      <main>
        <Cards />
        <WhyChooseUs />
        <Hero2 />
       <Freq/>
        <Location />
      </main>
      <Footer />
    </>
  );
}

export default App;
