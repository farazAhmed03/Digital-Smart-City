import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export const BusinessProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ name: "", description: "", price: "", image: "", file: null });
    const [preview, setPreview] = useState("");


    const fetchProducts = async () => {
        try {
            const res = await axios.get('/business/products/get-products', { withCredentials: true });
            if (res.data.success) {
                // Map model fields to local state names if needed, or just use model fields
                const mapped = res.data.products.map(p => ({
                    _id: p._id,
                    name: p.productName,
                    description: p.shortDescription,
                    price: p.price,
                    image: p.productImage
                }));
                setProducts(mapped);
            }
        } catch (err) {

            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', currentProduct.name);
        formData.append('description', currentProduct.description);
        formData.append('price', currentProduct.price);
        if (currentProduct.file) {
            formData.append('image', currentProduct.file);
        } else {
            formData.append('image', currentProduct.image);
        }

        try {
            const res = currentProduct._id
                ? await axios.put(`/business/products/update-product/${currentProduct._id}`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                : await axios.post('/business/products/add-product', formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                fetchProducts();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentProduct({ ...currentProduct, file });
            setPreview(URL.createObjectURL(file));
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            const res = await axios.delete(`/business/products/delete-product/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success("Product deleted");
                fetchProducts();
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    if (loading) return <div>Loading Products...</div>;

    return (
        <div className="fd-card">
            <div className="fd-section-header-flex">
                <h2 className="fd-section-title">Manage Products</h2>
                <button className="fd-btn-primary" onClick={() => {
                    setCurrentProduct({ name: "", description: "", price: "", image: "", file: null });
                    setPreview("");
                    setShowModal(true);
                }}>
                    <FaPlus /> Add Product
                </button>
            </div>


            <div className="fd-menu-list">
                {products.map(p => (
                    <div className="fd-menu-item" key={p._id}>
                        <img src={p.image || "https://via.placeholder.com/100"} alt={p.name} className="fd-menu-img" />
                        <div className="fd-menu-details">
                            <h4>{p.name}</h4>
                            <p>{p.description}</p>
                            <span className="fd-price-tag">Rs. {p.price}</span>
                        </div>
                        <div className="fd-menu-btns">
                            <button className="fd-btn-edit" onClick={() => {
                                setCurrentProduct(p);
                                setPreview(p.image);
                                setShowModal(true);
                            }}><FaEdit /> Edit</button>
                            <button className="fd-btn-delete" onClick={() => handleDelete(p._id)}><FaTrash /> Delete</button>
                        </div>

                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fd-modal-overlay">
                    <div className="fd-modal-content">
                        <h3>{currentProduct._id ? "Edit Product" : "Add New Product"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" className="fd-input" placeholder="Product Name" value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} required />
                            <textarea className="fd-textarea" placeholder="Description" value={currentProduct.description} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} required />
                            <input type="number" className="fd-input" placeholder="Price" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })} required />

                            <div className="fd-upload-group" style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Image</label>
                                <input type="file" className="fd-input" accept="image/*" onChange={handleFileChange} />
                                {preview && (
                                    <div className="fd-preview" style={{ marginTop: '10px' }}>
                                        <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </div>

                            <div className="fd-menu-btns">
                                <button type="submit" className="fd-btn-primary">Save</button>
                                <button type="button" className="fd-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};
