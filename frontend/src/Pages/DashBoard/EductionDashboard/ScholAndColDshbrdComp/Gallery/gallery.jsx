import "./gallery.css";
import "../ScholAndColDshbrdComp.css";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { maniURL, SaveGalleryImgs } from "../../../../../ApiCalls/DashBoardApiCalls";

export const GalleryForm = ({ dashboardData }) => {
    // Getting the new fields if any added by admin.
    const [galleryImgs, setGalleryImgs] = useState([]);
    useEffect(() => {
        if (Array.isArray(dashboardData?.gallery) && dashboardData.gallery.length > 0) {
            const imgsFromDb = dashboardData.gallery.map((url) => ({
                preview: url,
                file: null
            }));
            setGalleryImgs(imgsFromDb);
        } else {
            setGalleryImgs([
                {
                    preview: "https://images.pexels.com/photos/18272659/pexels-photo-18272659.jpeg",
                    file: null
                }
            ]);
        }
    }, []);

    // Tracking changes
    const [GalleryChanged, setGalleryChanged] = useState(false);

    // Handling Image Uploads
    const handleImgUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        const updatedArr = [...galleryImgs];
        updatedArr[index] = {
            preview: URL.createObjectURL(file),
            file: file
        };
        setGalleryImgs(updatedArr);
        setGalleryChanged(true);
    };

    // Deleting Images from cloudinary
    const deleteGalleryImage = (index) => {
        alert("Save the changes to reflect them on landing page");
        const imgToDelete = galleryImgs[index];
        if (imgToDelete.preview && typeof imgToDelete.preview === "string" && !imgToDelete.file) {
            axios.post(
                `${maniURL}/DeleteImage`,
                { imageUrl: imgToDelete.preview },
                { withCredentials: true }
            )
                .then(res => console.log(res.data))
                .catch(err => alert("This is default image"));
        }
        setGalleryImgs(galleryImgs.filter((_, i) => i !== index));
        setGalleryChanged(true);
    };


    // Adding new image
    const IncreaseTheImg = () => {
        setGalleryImgs([...galleryImgs, { preview: "https://images.pexels.com/photos/18272659/pexels-photo-18272659.jpeg", file: null }])
    }

    // %%%%%% Form Submission %%%%%%%
    const GalleryFormSubmitted = (e) => {
        e.preventDefault();
        const fd = new FormData();
        galleryImgs.forEach((img, index) => {
            if (img.file) {
                fd.append("galleryImages", img.file);
            } else {
                fd.append("existingImages", img.preview);
            }
        });
        SaveGalleryImgs(fd, setGalleryChanged);
    }

    return (
        <section className="form-area">
            {/* To show notification */}
            <ToastContainer />
            <form onSubmit={(e) => GalleryFormSubmitted(e)}>
                <h2>Gallery</h2>
                <div style={{
                    backgroundColor: "#e7f3ef",
                    color: "#1f8e5c",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    fontSize: "0.9rem",
                    borderLeft: "4px solid #1f8e5c"
                }}>
                    <strong>Tip:</strong> To ensure the best performance and avoid timeouts, we recommend updating your gallery in small batches (3-5 images at a time).
                </div>
                <p className="addressingPara galleryAdrsPara">It is adviced to upload atleast 06 images to your survice gallery.</p>
                <div className="dshbrdGalryImgsheadCont">
                    {galleryImgs.map((v, i) => {
                        const inputId = `hiddenFileField-${i}`;

                        return (
                            <div className="dshbrdGalryImgCont" key={i}>
                                <span className="StaffCrdDeltr" onClick={() => deleteGalleryImage(i)}><FaTrash /></span>
                                <img src={v.preview} className="dshbrdGalryImg" />

                                <div className="dshbordGalryImgGlassLyr">
                                    <label
                                        htmlFor={inputId}
                                        className="dshbordGalryImgAdder"
                                    >
                                        +
                                    </label>

                                    <input
                                        type="file"
                                        id={inputId}
                                        hidden
                                        onChange={(e) => handleImgUpload(e, i)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <div className="GalryCrdIncreaserCrd">
                        <span className="dshbordGalryImgAdder" onClick={() => IncreaseTheImg()}>
                            +
                        </span>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={!GalleryChanged} className="save-btn">Save</button>
                </div>
            </form>
        </section>
    );
};