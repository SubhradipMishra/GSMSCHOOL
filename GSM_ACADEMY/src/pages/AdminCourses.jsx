import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../util/Context';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import AdminSidebar from '../components/admin/AdminSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCourses = () => {
    const { session, sessionLoading } = useAuth();
    const navigate = useNavigate();
    
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    
    const [currentCourse, setCurrentCourse] = useState({ title: '', description: '', department: '', assignedTeacher: '', category: '', price: '', tag: '', discount: '', duration: '' });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState(null);

    useEffect(() => {
        if (!sessionLoading) {
            if (!session || session.role !== 'admin') {
                navigate('/login');
            } else {
                fetchData();
            }
        }
    }, [session, sessionLoading, navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [courseRes, deptRes, teachRes, catRes] = await Promise.all([
                API.get('/admin/courses'),
                API.get('/admin/departments'),
                API.get('/admin/teachers'),
                API.get('/admin/categories')
            ]);
            setCourses(courseRes.data.courses);
            setDepartments(deptRes.data.departments);
            setTeachers(teachRes.data.teachers);
            setCategories(catRes.data.categories);
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCurrentCourse({ ...currentCourse, [e.target.name]: e.target.value });
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
            formData.append('title', currentCourse.title);
            formData.append('description', currentCourse.description);
            formData.append('department', currentCourse.department);
            formData.append('assignedTeacher', currentCourse.assignedTeacher);
            formData.append('category', currentCourse.category);
            formData.append('price', currentCourse.price || 0);
            formData.append('tag', currentCourse.tag || '');
            formData.append('discount', currentCourse.discount || 0);
            formData.append('duration', currentCourse.duration || '');

            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }
            if (galleryFiles) {
                for (let i = 0; i < galleryFiles.length; i++) {
                    formData.append('gallery', galleryFiles[i]);
                }
            }

            if (modalMode === 'add') {
                await API.post('/admin/courses', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Course created successfully!");
            } else {
                await API.put(`/admin/courses/${currentCourse._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Course updated successfully!");
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this course?")) {
            try {
                await API.delete(`/admin/courses/${id}`);
                toast.success("Course deleted successfully!");
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete course");
            }
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setCurrentCourse({ title: '', description: '', department: '', assignedTeacher: '', category: '', price: '', tag: '', discount: '', duration: '' });
        setThumbnailFile(null);
        setGalleryFiles(null);
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setModalMode('edit');
        setCurrentCourse(course);
        setThumbnailFile(null);
        setGalleryFiles(null);
        setShowModal(true);
    };

    if (sessionLoading || loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black flex">
            <ToastContainer theme="dark" />
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
                                Courses Management
                            </h1>
                            <p className="text-gray-400 mt-2">Manage academic courses, instructors, and content</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            + Add Course
                        </button>
                    </div>

                    {/* Course List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {courses.length === 0 ? (
                                <p className="text-gray-500 col-span-3">No courses found.</p>
                            ) : (
                                courses.map((course, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={course._id}
                                        className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between"
                                    >
                                        <div>
                                            {course.thumbnail && (
                                                <div className="w-full h-40 bg-white/5 mb-4 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                                                    <img src={`http://localhost:7070${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <h3 className="text-2xl font-bold text-gold mb-2">{course.title}</h3>
                                            
                                            {course.gallery && course.gallery.length > 0 && (
                                                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                                                    {course.gallery.map((img, i) => (
                                                        <img key={i} src={`http://localhost:7070${img}`} alt={`Gallery ${i}`} className="h-12 w-12 object-cover rounded border border-white/20 flex-shrink-0" />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="text-sm text-gray-300 mb-4 space-y-1">
                                                <p><span className="font-semibold text-white/50">Department:</span> {course.department}</p>
                                                <p><span className="font-semibold text-white/50">Instructor:</span> {course.assignedTeacher}</p>
                                            </div>
                                            
                                            <p className="text-gray-400 text-sm line-clamp-3">{course.description}</p>
                                        </div>
                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button onClick={() => openEditModal(course)} className="text-blue-400 hover:text-blue-300 transition text-sm">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(course._id)} className="text-red-400 hover:text-red-300 transition text-sm">
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
                            className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <h2 className="text-2xl font-bold text-gold mb-6">{modalMode === 'add' ? 'Add New Course' : 'Edit Course'}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Course Title</label>
                                    <input required name="title" value={currentCourse.title} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Department</label>
                                        <select required name="department" value={currentCourse.department} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold">
                                            <option value="" disabled className="text-black">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept._id} value={dept.name} className="text-black">{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Assigned Teacher</label>
                                        <select required name="assignedTeacher" value={currentCourse.assignedTeacher} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold">
                                            <option value="" disabled className="text-black">Select Teacher</option>
                                            {teachers.map(teacher => (
                                                <option key={teacher._id} value={teacher.fullname} className="text-black">{teacher.fullname} ({teacher.department || 'No Dept'})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select name="category" value={currentCourse.category} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold">
                                        <option value="" className="text-black">No Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat.name} className="text-black">{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                                        <input type="number" name="price" value={currentCourse.price} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" placeholder="0" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Discount Amount (₹)</label>
                                        <input type="number" name="discount" value={currentCourse.discount} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" placeholder="0" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Tag (e.g. Best Seller, New)</label>
                                        <input type="text" name="tag" value={currentCourse.tag} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" placeholder="e.g. Popular" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Duration (e.g. 6 Weeks, 3 Months)</label>
                                        <input type="text" name="duration" value={currentCourse.duration} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" placeholder="e.g. 3 Months" />
                                    </div>
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
                                    <textarea required name="description" value={currentCourse.description} onChange={handleInputChange} rows={4} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>
                                <button type="submit" className="w-full mt-6 bg-gradient-to-r from-gold to-yellow-600 text-black py-3 rounded font-bold hover:opacity-90 transition">
                                    {modalMode === 'add' ? 'Create Course' : 'Save Changes'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCourses;
