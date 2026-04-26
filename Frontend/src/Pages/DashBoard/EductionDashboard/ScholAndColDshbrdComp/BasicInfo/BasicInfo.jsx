import { useState } from "react";
import "./BasicInfo.css";
import "../ScholAndColDshbrdComp.css";
import { toast, ToastContainer } from "react-toastify";
import { saveBasicInfoApi } from "../../../../../ApiCalls/DashBoardApiCalls";
export const BasicInfoForm = ({ dashboardData }) => {
    // Setting the Db Data if any, instead of default data
    let [formData, setFormData] = useState({
        bannerUrl: dashboardData.basicInfo?.bannerUrl || null,
        tagline: dashboardData.basicInfo?.tagline || "",
        about: dashboardData.basicInfo?.about || "",
        aboutImgUrl: dashboardData.basicInfo?.aboutImgUrl || null
    });

    // Tracking changes
    const [BasicInfoChanged, setBasicInfoChanged] = useState(false);

    // Setting images of Db if any to preiew or setting default images;
    const [preview, setPreview] = useState({
        bannerUrl: dashboardData.basicInfo?.bannerUrl || "https://images.pexels.com/photos/18272659/pexels-photo-18272659.jpeg",
        aboutImgUrl: dashboardData.basicInfo?.aboutImgUrl || "https://images.pexels.com/photos/18272659/pexels-photo-18272659.jpeg"
    });
    
    // Handling the data entry
    const handleInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setFormData(({ ...formData, [name]: value }));
        setBasicInfoChanged(true);
    }

    // Handling the image upload
    const handleFileUpload = (file, field) => {
        if (!file) return;
        setFormData(prev => ({
            ...prev,
            [field]: file
        }));
        setPreview(prev => ({
            ...prev,
            [field]: URL.createObjectURL(file)
        }));
        setBasicInfoChanged(true);
    };

    // %%%%%% Form Submission Function %%%%%%%
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            saveBasicInfoApi(formData, setBasicInfoChanged);
        } catch (err) {
            toast.error("Failed to save basic info");
        }
    };

    return (
        <section className="form-area">
            {/* To show notification */}
            <ToastContainer />
            <form onSubmit={(e) => { handleSubmit(e) }}>
                <h2>Basic Info</h2>
                <div className="form-group">
                    <label htmlFor="hiddenFileField" className="placeholder imageCont">
                        <input
                            type="file"
                            id="hiddenFileField"
                            onChange={(e) => { handleFileUpload(e.target.files[0], "bannerUrl") }}
                        />
                        <img
                            src={preview.bannerUrl}
                            alt="School Banner"
                            className="bannerImage"
                        />
                        <span className="pluseAndChangeText">
                            <p className="pluseIcn">+</p>
                            <i className="changeText">Change Banner</i>
                        </span>
                    </label>
                </div>
                <div className="form-group">
                    <label>About {dashboardData.Type || dashboardData.ServiceType}</label>
                    <div className="aboutTextareaAndImg">
                        <textarea
                            value={formData.about}
                            name="about"
                            onChange={e => handleInputChange(e)}
                            rows={12}
                            className="input-full"
                        />
                        <label className="AboutImgAndUpload">
                            <input
                                type="file"
                                id="hiddenFileField"
                                onChange={(e) => { handleFileUpload(e.target.files[0], "aboutImgUrl") }}
                            />
                            <img src={preview.aboutImgUrl} alt="Insert Image" className="aboutusImg" />

                            <div className="glassLayer">
                                <span className="pluseCont">+</span>
                                <span className="AddAboutImgTxt">Upload About Us Image</span>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-group">
                        <label>Tagline</label>
                        <input
                            type="text"
                            value={formData.tagline}
                            name="tagline"
                            onChange={e => handleInputChange(e)}
                            className="input-md"
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={!BasicInfoChanged} className="save-btn">Save</button>
                </div>
            </form>
        </section>
    )
}