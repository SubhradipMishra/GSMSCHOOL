import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../util/Context';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminDepartments = () => {
    const { session, sessionLoading } = useAuth();
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentDept, setCurrentDept] = useState({ name: '', departmentCode: '', description: '', headOfDepartment: '', category: '' });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState(null);

    useEffect(() => {
        if (!sessionLoading) {
            if (!session || session.role !== 'admin') {
                navigate('/login');
            } else {
                fetchDepartments();
            }
        }
    }, [session, sessionLoading, navigate]);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const [deptRes, catRes] = await Promise.all([
                API.get('/admin/departments'),
                API.get('/admin/categories')
            ]);
            setDepartments(deptRes.data.departments);
            setCategories(catRes.data.categories);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCurrentDept({ ...currentDept, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'thumbnail') {
            setThumbnailFile(e.target.files[0]);
        } else if (e.target.name === 'gallery') {
            setGalleryFiles(e.target.files);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', currentDept.name);
            formData.append('departmentCode', currentDept.departmentCode);
            formData.append('description', currentDept.description);
            formData.append('headOfDepartment', currentDept.headOfDepartment);
            formData.append('category', currentDept.category);

            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }
            if (galleryFiles) {
                for (let i = 0; i < galleryFiles.length; i++) {
                    formData.append('gallery', galleryFiles[i]);
                }
            }

            if (modalMode === 'add') {
                await API.post('/admin/departments', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await API.put(`/admin/departments/${currentDept._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowModal(false);
            fetchDepartments();
        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this department?")) {
            try {
                await API.delete(`/admin/departments/${id}`);
                fetchDepartments();
            } catch (error) {
                alert(error.response?.data?.message || "Failed to delete");
            }
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setCurrentDept({ name: '', departmentCode: '', description: '', headOfDepartment: '', category: '' });
        setThumbnailFile(null);
        setGalleryFiles(null);
        setShowModal(true);
    };

    const openEditModal = (dept) => {
        setModalMode('edit');
        setCurrentDept({ ...dept, departmentCode: dept.departmentCode || '', category: dept.category || '' });
        setThumbnailFile(null);
        setGalleryFiles(null);
        setShowModal(true);
    };

    if (sessionLoading || loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black flex">
            <AdminSidebar />
            <main className="pt-8 px-6 md:px-16 pb-16 flex-1 ml-64">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-white bg-clip-text text-transparent">
                                Departments Management
                            </h1>
                            <p className="text-gray-400 mt-2">Manage academic and administrative departments</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            + Add Department
                        </button>
                    </div>

                    {/* Department List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {departments.length === 0 ? (
                                <p className="text-gray-500 col-span-3">No departments found.</p>
                            ) : (
                                departments.map((dept, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={dept._id}
                                        className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between"
                                    >
                                        <div>
                                            {dept.thumbnail && (
                                                <div className="w-full h-40 bg-white/5 mb-4 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                                                    <img src={`http://localhost:7070${dept.thumbnail}`} alt={dept.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-bold text-gold">{dept.name}</h3>
                                                <span className="bg-white/10 text-xs px-2 py-1 rounded text-white border border-white/20">{dept.departmentCode}</span>
                                            </div>
                                            {dept.gallery && dept.gallery.length > 0 && (
                                                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                                                    {dept.gallery.map((img, i) => (
                                                        <img key={i} src={`http://localhost:7070${img}`} alt={`Gallery ${i}`} className="h-16 w-16 object-cover rounded border border-white/20 flex-shrink-0" />
                                                    ))}
                                                </div>
                                            )}
                                            {dept.headOfDepartment && (
                                                <p className="text-sm text-gray-300 mb-4">
                                                    <span className="font-semibold text-white/50">Head:</span> {dept.headOfDepartment}
                                                </p>
                                            )}
                                            <p className="text-gray-400 text-sm line-clamp-3">{dept.description || 'No description provided.'}</p>
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button onClick={() => openEditModal(dept)} className="text-blue-400 hover:text-blue-300 transition text-sm">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(dept._id)} className="text-red-400 hover:text-red-300 transition text-sm">
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <h2 className="text-2xl font-bold text-gold mb-6">{modalMode === 'add' ? 'Add New Department' : 'Edit Department'}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Department Name</label>
                                    <input required name="name" value={currentDept.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Department Code</label>
                                    <input required name="departmentCode" value={currentDept.departmentCode} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" placeholder="e.g. CS101" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Head of Department (Optional)</label>
                                    <input name="headOfDepartment" value={currentDept.headOfDepartment} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select name="category" value={currentDept.category} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold">
                                        <option value="" className="text-black">No Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name} className="text-black">{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Thumbnail Image</label>
                                        <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="w-full bg-white/5 border border-white/10 p-2 rounded text-white focus:outline-none focus:border-gold text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gold file:text-black hover:file:bg-yellow-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Gallery Images</label>
                                        <input type="file" name="gallery" multiple accept="image/*" onChange={handleFileChange} className="w-full bg-white/5 border border-white/10 p-2 rounded text-white focus:outline-none focus:border-gold text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gold file:text-black hover:file:bg-yellow-600" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                                    <textarea name="description" value={currentDept.description} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>
                                <button type="submit" className="w-full mt-6 bg-gradient-to-r from-gold to-yellow-600 text-black py-3 rounded font-bold hover:opacity-90 transition">
                                    {modalMode === 'add' ? 'Create Department' : 'Save Changes'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDepartments;
