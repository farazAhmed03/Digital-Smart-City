import React, { useState } from "react";

const ManageGallery = ({ data }) => {
    const [gallery, setGallery] = useState(data.Gallery || []);

    const handleUpload = () => {
        alert("Gallery upload functionality integration coming soon!");
    };

    const handleDelete = (url) => {
        if (window.confirm("Remove this image?")) {
            setGallery(gallery.filter(item => item !== url));
        }
    };

    return (
        <div className="hlth-ds-tab-content">
            <div className="hlth-ds-tab-header">
                <h3>Pharmacy Gallery</h3>
                <button className="hlth-ds-btn-add" onClick={handleUpload}>+ Upload Image</button>
            </div>

            <div className="hlth-ds-gallery-grid">
                {gallery.length > 0 ? gallery.map((img, index) => (
                    <div key={index} className="hlth-ds-gallery-item">
                        <img src={img} alt={`Gallery ${index}`} />
                        <button onClick={() => handleDelete(img)} className="remove-overlay">Remove</button>
                    </div>
                )) : <p className="hlth-ds-empty">No images in gallery yet.</p>}
            </div>
        </div>
    );
};

export default ManageGallery;
