import { useEffect, useState, useContext } from "react";
import "./SignUpForm.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { AppContext } from "../../Store/AppContext";
export const SignUpForm = () => {
    const { userData } = useContext(AppContext);
    // State that store data
    let [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        Catagory: "",
        program: "",
        address: "",
        duration: "",
        catagoryTitle: ""
    });

    useEffect(() => {
        if (userData) {
            setData((prev) => ({
                ...prev,
                name: userData.fullName || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || ""
            }));
        }
    }, [userData]);

    // Storing data while typing:
    const changeHandler = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setData(prev => ({ ...prev, [name]: value }))
    }

    // Form data after Submission
    const formSubmission = (e) => {
        e.preventDefault();
        if (data.Catagory !== "" && data.Catagory !== "Catagory") {
            if (data.Catagory === "Online Course" || data.Catagory === "Online Training") {
                data.address = "";
                data.program = "";
                clearFun();
            } else if (data.Catagory !== "University") {
                data.duration = ""
                data.program = ""
                clearFun();
            } else {
                clearFun();
            }
        } else {
            alert("Please first select any catagory")
        }
    }

    // Clearing form;
    const clearFun = () => {
        setData({
            name: "",
            email: "",
            phone: "",
            Catagory: "",
            program: "",
            address: "",
            duration: "",
            catagoryTitle: ""
        })
    }

    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <section>
                    <div className="form-cont">
                        <form onSubmit={(e) => formSubmission(e)} className="rgstr-form">
                            <h2 className="rgstr-frm-heading">Registration Form:</h2>
                            {/* Permanent Fields */}
                            <div className="label-cont">
                                <label htmlFor="name" className="formLabel">Full name</label>
                                <input id="name" name="name" type="text" placeholder="Jane Doe" value={data.name} onChange={(e) => changeHandler(e)} required />
                            </div>
                            <div className="label-cont">
                                <label htmlFor="phone" className="formLabel">Phone</label>
                                <input id="phone" name="phone" type="tel" min={10} placeholder="+92 300 0000000" value={data.phone} onChange={(e) => changeHandler(e)} required />
                            </div>

                            <div className="label-cont">
                                <label htmlFor="email" className="formLabel">Email</label>
                                <input id="email" name="email" type="email" placeholder="jane@example.com" value={data.email} onChange={(e) => changeHandler(e)} required />
                            </div>

                            <div className="label-cont">
                                <label htmlFor="payment" className="formLabel">Select Catagory</label>
                                <select id="payment" name="Catagory" value={data.Catagory} onChange={(e) => { changeHandler(e) }}>
                                    <option>Catagory</option>
                                    <option>School</option>
                                    <option>College</option>
                                    <option>University</option>
                                    <option>Tutor</option>
                                    <option>Online Course</option>
                                    <option>Online Training</option>
                                </select>
                            </div>
                            {/* Dynamic Fields */}
                            {(data.Catagory === "" || data.Catagory === "Catagory")
                                ?
                                <></>
                                :
                                <div className="label-cont">
                                    <label htmlFor="catagoryTitle" className="formLabel">{data.Catagory} Name :</label>
                                    <input id="catagoryTitle" name="catagoryTitle" type="text" placeholder={`${data.Catagory} name`} value={data.catagoryTitle} onChange={(e) => changeHandler(e)} required />
                                    <br></br>
                                    {(data.Catagory === "Online Course" || data.Catagory === "Online Training") ?
                                        <>
                                            {/* ONLINE COURSES AND ONLINE TRAINING (OC & OT)*/}
                                            <label htmlFor="duration" className="formLabel">Enrolling Date :</label>
                                            <input id="duration" name="duration" type="date" value={data.duration} onChange={(e) => changeHandler(e)} required />
                                        </>
                                        :
                                        <>
                                            {/* OTHER THAN OC & OT */}
                                            <label htmlFor="Address" className="formLabel">Address :</label>
                                            <input id="Address" name="address" type="text" placeholder="street , city , district, kp pakistan" value={data.address} onChange={(e) => changeHandler(e)} required />
                                            <br></br>
                                            {(data.Catagory === "University")
                                                ?
                                                <>
                                                    {/* FOR UNIVERSITY */}
                                                    <label htmlFor="progrm" className="formLabel">Enter the Program Name :</label>
                                                    <input id="progrm" name="program" type="text" placeholder="Computer Science" value={data.program} onChange={(e) => changeHandler(e)} required />
                                                </>
                                                :
                                                <></>
                                            }
                                        </>
                                    }
                                </div>
                            }
                            <div className="button-group">
                                <button type="submit" className="rgstr-pg-sbmt-btn">Submit</button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}