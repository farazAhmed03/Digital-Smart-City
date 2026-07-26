import "./Staff.css";
import "../ScholAndColDshbrdComp.css";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
    SendStaffAndStudentDataToDb,
    SendResAndPrfumncDataToDb,
    saveStaffInfo,
    maniURL
} from "../../../../../ApiCalls/DashBoardApiCalls";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const DEFAULT_STAFF_IMAGE =
    "https://images.pexels.com/photos/18272659/pexels-photo-18272659.jpeg";

const slugify = (text) =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

export const StaffMangingForm = ({ dashboardData }) => {

    // ===================== 
    // STAFF SECTION 
    // ======================
    // Setting the Db Data if any, instead of default data
    const [staff, setStaff] = useState(dashboardData?.staff || [{ image: "", name: "", description: "" }]);

    // Tracking changes
    const [staffSecChanged, setstaffSecChanged] = useState(false);

    // Deciding which kind of staffImage is:
    const resolveStaffImage = (image) => {
        if (image instanceof File) return URL.createObjectURL(image);
        if (typeof image === "string" && image.trim() !== "") return image;
        return DEFAULT_STAFF_IMAGE;
    };

    // Handling the data entry
    const handleStaffChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...staff];
        updated[index][name] = value || "";
        setStaff(updated);
        setstaffSecChanged(true);
    };

    // Handling the change in staff images
    const handleStaffImageChange = (index, file) => {
        const updated = [...staff];
        updated[index].image = file || DEFAULT_STAFF_IMAGE;
        setStaff(updated);
        setstaffSecChanged(true);
    };

    // Adding new staff
    const addStaffCard = () => {
        setStaff([
            ...staff,
            { image: "", name: "", description: "" }
        ])
        setstaffSecChanged(true);
    };

    // Deleting the staff image from cloudinary and Staff data
    const deleteStaffCard = (index) => {
        alert("Save the changes other , to see the output");
        const staffToDelete = staff[index];
        if (staffToDelete.image && typeof staffToDelete.image === "string") {
            axios.post(`${maniURL}/DeleteImage`, { imageUrl: staffToDelete.image }, { withCredentials: true })
                .then(res => console.log(res.data))
                .catch(err => console.error(err));
        }
        setStaff(staff.filter((_, i) => i !== index));
        setstaffSecChanged(true);
    };

    // %%%%%% Form Submission of "STAFF INFO" Section %%%%%%%
    const saveStaff = (e) => {
        e.preventDefault();
        saveStaffInfo(staff, setstaffSecChanged);
    };

    // ==========================
    // STAFF & STUDENTS (SandS) 
    // ==========================
    // Setting the Db Data if any, instead of default data
    const [staffAndStudnt, setStaffAndStudnt] = useState(
        dashboardData?.StaffAndStudent || {
            Total_Students: "",
            Total_Teachers: "",
            Qualification: "",
            Ratio: "",
            Medium: "",
            others: []
        }
    );


    // Tracking changes
    const [staffAndStudSecChanged, setStaffAndStudSecChanged] = useState(false);

    const handleSandSDynamicChange = (index, value) => {
        setStaffAndStudnt(prev => ({
            ...prev,
            others: prev.others?.map((f, i) => i === index ? { ...f, value } : f)
        }));
        setStaffAndStudSecChanged(true);
    };


    // Handling the data entry
    const hndlStfAndStudntChng = (e) => {
        const { name, value } = e.target;
        setStaffAndStudnt({ ...staffAndStudnt, [name]: value || "" });
        setStaffAndStudSecChanged(true);
    };

    // Adding new field in Staff and Student Section
    const AddNewField = () => {
        const label = prompt("Enter the field name. If it has two words, separate them with an underscore, e.g., First_Name.");
        if (!label) return;
        const key = slugify(label);

        if (staffAndStudnt.others?.some(f => f.key === key)) return alert("Field already exists.");

        setStaffAndStudnt(prev => ({
            ...prev,
            others: [...prev.others, { key, label, value: "" }]
        }));
        setStaffAndStudSecChanged(true);
    };


    // Deleting the staff and student sec field;
    const delTheSandSSecfield = (index) => {
        setStaffAndStudnt(prev => ({
            ...prev,
            others: prev.others.filter((_, i) => i !== index)
        }));
        setStaffAndStudSecChanged(true);
    };



    // %%%%%% Form Submission of "STAFF & STUDENTS" Section %%%%%%%
    const saveStaffAndStudent = (e) => {
        e.preventDefault();
        SendStaffAndStudentDataToDb(staffAndStudnt, setStaffAndStudSecChanged);
    };

    //  ============================ 
    // RESULT & PERFORMANCE (RandP) 
    // =============================

    // Setting the Db Data if any, instead of default data
    const [ResAndPrfrmnc, setResAndPrfrmnc] = useState(
        dashboardData?.ResultAndPerformance || {
            Pass_Precentage: "",
            Top_Achievers: "",
            Board_Result: "",
            MDCAT_Performance: "",
            others: []
        }
    );

    // Tracking changes
    const [resAndPrfSecChanged, setResAndPrfSecChanged] = useState(false);

    // Handling the data entry
    const hndlResAndPrfrmncChng = (e) => {
        const { name, value } = e.target;
        setResAndPrfrmnc({ ...ResAndPrfrmnc, [name]: value || "" });
        setResAndPrfSecChanged(true);
    };

    const handleRandPDynamicChange = (index, value) => {
        setResAndPrfrmnc(prev => ({
            ...prev,
            others: prev.others.map((f, i) => i === index ? { ...f, value } : f)
        }));
        setResAndPrfSecChanged(true);
    };


    // Adding new field in Result and preformance Section
    const AddNewRandPField = () => {
        const label = prompt("Enter the field name. If it has two words, separate with an underscore, e.g., First_Name.");
        if (!label) return;
        const key = slugify(label);

        if (ResAndPrfrmnc.others.some(f => f.key === key)) return alert("Field already exists.");

        setResAndPrfrmnc(prev => ({
            ...prev,
            others: [...prev.others, { key, label, value: "" }]
        }));
        setResAndPrfSecChanged(true);
    };

    // Deleting the Result and preformance sec field;
    const delTheRandPSecfield = (index) => {
        setResAndPrfrmnc(prev => ({
            ...prev,
            others: prev.others.filter((_, i) => i !== index)
        }));
        setResAndPrfSecChanged(true);
    };

    // %%%%%% Form Submission of "RESULT & PERFORMANCE" Section %%%%%%%
    const saveResAndPrfumnce = (e) => {
        e.preventDefault();
        SendResAndPrfumncDataToDb(ResAndPrfrmnc, setResAndPrfSecChanged);
    };

    return (
        <section className="form-area">
            <ToastContainer />
            {/* STAFF INFO */}
            <form onSubmit={saveStaff}>
                <h2>Staff Info</h2>
                <div style={{
                    backgroundColor: "#e7f3ef",
                    color: "#1f8e5c",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "0.9rem",
                    borderLeft: "4px solid #1f8e5c"
                }}>
                    <strong>Tip:</strong> For the best performance and to avoid timeouts, we recommend adding or updating staff members in batches of 3 at a time.
                </div>
                <div className="DshbrdstaffCrd_Cont">
                    {staff.map((crdData, i) => (
                        <div className="DshbrdstaffCrd" key={i}>
                            <span className="StaffCrdDeltr" onClick={() => deleteStaffCard(i)}><FaTrash /></span>
                            <div className="imageAndPen">
                                <img src={resolveStaffImage(crdData.image)} className="DshbrdstaffImg" alt={crdData.name || "Staff"} />
                                <label className="StaffImgEditor">
                                    📤
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleStaffImageChange(i, e.target.files[0])}
                                    />
                                </label>
                            </div>
                            <input
                                className="StaffName"
                                name="name"
                                value={crdData.name || ""}
                                onChange={(e) => handleStaffChange(i, e)}
                                placeholder="Mr. John"
                                required
                            />
                            <textarea
                                className="StaffDesc"
                                name="description"
                                value={crdData.description || ""}
                                onChange={(e) => handleStaffChange(i, e)}
                                placeholder="Math Teacher"
                                required
                            />
                        </div>
                    ))}
                    <div className="DshbrdstaffCrd staffAdderCrd" onClick={addStaffCard}>
                        <div className="glassAndDarkDiv">
                            <div className="StaffAddIcon">+</div>
                        </div>
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={!staffSecChanged} className="save-btn">Save Staff</button>
                </div>
            </form>

            {/* STAFF & STUDENTS */}
            <br /><br />
            <form onSubmit={saveStaffAndStudent}>
                <h2>Staff & Students</h2>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label>Total Students</label>
                        <input type="number" name="Total_Students" value={staffAndStudnt.Total_Students || ""} onChange={hndlStfAndStudntChng} required />
                    </div>
                    <div className="form-group">
                        <label>Total Teachers</label>
                        <input type="number" name="Total_Teachers" value={staffAndStudnt.Total_Teachers || ""} onChange={hndlStfAndStudntChng} required />
                    </div>
                </div>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label>Qualification</label>
                        <input type="text" name="Qualification" value={staffAndStudnt.Qualification || ""} onChange={hndlStfAndStudntChng} required />
                    </div>
                    <div className="form-group">
                        <label>Student & Staff Ratio</label>
                        <input type="text" name="Ratio" value={staffAndStudnt.Ratio || ""} onChange={hndlStfAndStudntChng} required />
                    </div>
                </div>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label>Medium</label>
                        <input type="text" name="Medium" value={staffAndStudnt.Medium || ""} onChange={hndlStfAndStudntChng} required />
                    </div>
                </div>
                {
                    staffAndStudnt.others?.map((fieldObj, index) => (
                        <div className="smallInputCont" key={index}>
                            <div className="form-group">
                                <label>{fieldObj.label}</label>
                                <input
                                    type="text"
                                    name={fieldObj.key}
                                    value={fieldObj.value}
                                    onChange={(e) =>
                                        handleSandSDynamicChange(index, e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <span
                                className="deleteField"
                                onClick={() => delTheSandSSecfield(index)}
                            >
                                <FaTrash />
                            </span>
                        </div>
                    ))
                }

                <div className="form-group">
                    <span className="AddField" title="Add more fields" onClick={AddNewField}>
                        +
                    </span>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={!staffAndStudSecChanged} className="save-btn">Save</button>
                </div>
            </form>

            {/* RESULT & PERFORMANCE */}
            <br /><br />
            <form onSubmit={saveResAndPrfumnce}>
                <h2>Result & Performance</h2>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label>Pass Percentage (%)</label>
                        <input type="number" name="Pass_Precentage" value={ResAndPrfrmnc.Pass_Precentage || ""} onChange={hndlResAndPrfrmncChng} required />
                    </div>
                    <div className="form-group">
                        <label>Top Achievers</label>
                        <input type="number" name="Top_Achievers" value={ResAndPrfrmnc.Top_Achievers || ""} onChange={hndlResAndPrfrmncChng} required />
                    </div>
                </div>
                <div className="smallInputCont">
                    <div className="form-group">
                        <label>Board Performance</label>
                        <input type="text" name="Board_Result" value={ResAndPrfrmnc.Board_Result || ""} onChange={hndlResAndPrfrmncChng} required />
                    </div>
                    <div className="form-group">
                        <label>ETEA Performance</label>
                        <input type="text" name="MDCAT_Performance" value={ResAndPrfrmnc.MDCAT_Performance || ""} onChange={hndlResAndPrfrmncChng} required />
                    </div>
                </div>
                {
                    ResAndPrfrmnc.others?.map((fieldObj, index) => (
                        <div className="smallInputCont" key={index}>
                            <div className="form-group">
                                <label>{fieldObj.label}</label>
                                <input
                                    type="text"
                                    value={fieldObj.value}
                                    onChange={(e) =>
                                        handleRandPDynamicChange(index, e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <span
                                className="deleteField"
                                onClick={() => delTheRandPSecfield(index)}
                            >
                                <FaTrash />
                            </span>
                        </div>
                    ))
                }
                <div className="form-group">
                    <span className="AddField" title="Add more fields" onClick={AddNewRandPField}>
                        +
                    </span>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={!resAndPrfSecChanged} className="save-btn">Save</button>
                </div>
            </form>
        </section >
    );
};
