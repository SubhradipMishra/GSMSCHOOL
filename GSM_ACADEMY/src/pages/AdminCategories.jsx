import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../util/Context';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import AdminSidebar from '../components/admin/AdminSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PRESET_COLORS = [
    '#c9a84c', '#22c55e', '#3b82f6', '#ef4444',
    '#a855f7', '#f97316', '#06b6d4', '#ec4899'
];

const AdminCategories = () => {
    const { session, sessionLoading } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentCat, setCurrentCat] = useState({ name: '', description: '', color: '#c9a84c' });

    useEffect(() => {
        if (!sessionLoading) {
            if (!session || session.role !== 'admin') {
                navigate('/login');
            } else {
                fetchCategories();
            }
        }
    }, [session, sessionLoading, navigate]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await API.get('/admin/categories');
            setCategories(res.data.categories);
        } catch (error) {
            toast.error("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCurrentCat({ ...currentCat, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm(
            modalMode === 'add'
                ? `Create category "${currentCat.name}"?`
                : `Update category "${currentCat.name}"?`
        );
        if (!confirmed) return;

        try {
            if (modalMode === 'add') {
                await API.post('/admin/categories', currentCat);
                toast.success(`Category "${currentCat.name}" created!`);
            } else {
                await API.put(`/admin/categories/${currentCat._id}`, currentCat);
                toast.success(`Category "${currentCat.name}" updated!`);
            }
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
        try {
            await API.delete(`/admin/categories/${id}`);
            toast.success(`Category "${name}" deleted!`);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setCurrentCat({ name: '', description: '', color: '#c9a84c' });
        setShowModal(true);
    };

    const openEditModal = (cat) => {
        setModalMode('edit');
        setCurrentCat(cat);
        setShowModal(true);
    };

    if (sessionLoading || loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            <ToastContainer theme="dark" position="top-right" />
            <AdminSidebar />
            <main className="pt-8 px-6 md:px-16 pb-16 flex-1 ml-64">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-white bg-clip-text text-transparent">
                                Category Management
                            </h1>
                            <p className="text-gray-400 mt-2">Organize courses and departments with categories</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            + Add Category
                        </button>
                    </div>

                    {categories.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <i className="ri-price-tag-3-line text-5xl mb-4 block"></i>
                            <p>No categories yet. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {categories.map((cat, index) => (
                                    <motion.div
                                        key={cat._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md flex items-center justify-between hover:bg-white/10 transition"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: cat.color + '30', border: `2px solid ${cat.color}` }}
                                            >
                                                <i className="ri-price-tag-3-line text-xl" style={{ color: cat.color }}></i>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg" style={{ color: cat.color }}>{cat.name}</h3>
                                                <p className="text-gray-400 text-sm">{cat.description || 'No description'}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => openEditModal(cat)}
                                                className="text-blue-400 hover:text-blue-300 transition text-sm font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat._id, cat.name)}
                                                className="text-red-400 hover:text-red-300 transition text-sm font-semibold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl relative"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
                            <h2 className="text-2xl font-bold text-gold mb-6">
                                {modalMode === 'add' ? 'New Category' : 'Edit Category'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category Name</label>
                                    <input
                                        required
                                        name="name"
                                        value={currentCat.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Science, Arts, Commerce"
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-gold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description (Optional)</label>
                                    <textarea
                                        name="description"
                                        value={currentCat.description}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:border-gold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Color</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {PRESET_COLORS.map(color => (
                                            <button
                                                type="button"
                                                key={color}
                                                onClick={() => setCurrentCat({ ...currentCat, color })}
                                                className="w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0"
                                                style={{
                                                    backgroundColor: color,
                                                    outline: currentCat.color === color ? `3px solid white` : 'none',
                                                    outlineOffset: '2px'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            name="color"
                                            value={currentCat.color}
                                            onChange={handleInputChange}
                                            className="w-10 h-10 rounded cursor-pointer bg-transparent border border-white/10"
                                        />
                                        <span className="text-gray-400 text-sm">Or pick a custom color</span>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div
                                    className="p-3 rounded-lg border flex items-center space-x-3"
                                    style={{ borderColor: currentCat.color, backgroundColor: currentCat.color + '15' }}
                                >
                                    <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: currentCat.color }}>
                                        <i className="ri-price-tag-3-line text-black text-sm"></i>
                                    </div>
                                    <span className="font-semibold" style={{ color: currentCat.color }}>
                                        {currentCat.name || 'Preview'}
                                    </span>
                                </div>

                                <button type="submit" className="w-full mt-2 bg-gradient-to-r from-gold to-yellow-600 text-black py-3 rounded-lg font-bold hover:opacity-90 transition">
                                    {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCategories;
