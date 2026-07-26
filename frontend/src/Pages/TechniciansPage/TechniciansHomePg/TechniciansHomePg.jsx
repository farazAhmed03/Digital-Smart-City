import { useEffect, useState } from "react";
import "../../CatagoriesHomePgs.css";
import "./TechniciansHomePg.css";
import "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ServiceProviderRegForm } from "../../../components/Forms/SPRegForm/SPRegForm";
import { Techicians_categories } from "../../../Store/Techcn_Store";
export const TechniciansHomePg = () => {

    // To show page from the top:
    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    // Navigate use to redirect to other pages:
    const navigate = useNavigate();

    // useState to open the Form
    let [showForm, setShowform] = useState(false);

    return (
        <>
            {
                (showForm)
                    ?
                    //  Registration Form
                    <ServiceProviderRegForm setShowform={setShowform} />
                    :
                    // Home Page
                    <section className="Tech-pg-sec">
                        {/* Registartion Button */}
                        <button onClick={() => { setShowform(true) }} className="rsgrt-btn">Registration</button>
                        {/* Techicians Catagories */}
                        <div className="content-cont">
                            <h1>Let's Find your wanted <strong>Technicians</strong></h1>
                            <p className="pg-desc">Find the right technician for your needs with ease. Our platform connects you to trusted professionals ready to handle electrical work, plumbing, repairs, installations, and much more. Whether you need quick assistance or expert service, we ensure reliable technicians are always within reach.</p>
                            <div className="card-Container">
                                {Techicians_categories.map((v, i) => {
                                    return (
                                        <div className="card tech-cards" key={i}>
                                            <div className="crd-img-title-div" style={{ flexDirection: "column" }}>
                                                <img src={v.img} />
                                                <h2>{v.title}</h2>
                                            </div>
                                            <p>{v.description}</p>
                                            <button className="pg-crd-btn" onClick={() => navigate(v.link)}>{v.btn}</button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
            }
        </>
    )
}