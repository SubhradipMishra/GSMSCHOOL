import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../util/Context';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminDashboard = () => {
    const { session, sessionLoading } = useAuth();
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentTeacher, setCurrentTeacher] = useState({
        fullname: '', email: '', mobile: '', gender: '', adharNo: '', password: '', department: '', specialty: '', experience: '', address: ''
    });

    useEffect(() => {
        if (!sessionLoading) {
            if (!session || session.role !== 'admin') {
                navigate('/login');
            } else {
                fetchTeachers();
                fetchDepartments();
            }
        }
    }, [session, sessionLoading, navigate]);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await API.get('/admin/teachers');
            setTeachers(res.data.teachers);
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await API.get('/admin/departments');
            setDepartments(res.data.departments);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        }
    };

    const handleInputChange = (e) => {
        setCurrentTeacher({ ...currentTeacher, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await API.post('/admin/teachers', currentTeacher);
            } else {
                await API.put(`/admin/teachers/${currentTeacher._id}`, currentTeacher);
            }
            setShowModal(false);
            fetchTeachers();
        } catch (error) {
            alert(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this teacher?")) {
            try {
                await API.delete(`/admin/teachers/${id}`);
                fetchTeachers();
            } catch (error) {
                alert(error.response?.data?.message || "Failed to delete");
            }
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setCurrentTeacher({ fullname: '', email: '', mobile: '', gender: '', adharNo: '', password: '', department: '', specialty: '', experience: '', address: '' });
        setShowModal(true);
    };

    const openEditModal = (teacher) => {
        setModalMode('edit');
        setCurrentTeacher({ ...teacher, password: '' }); // Don't show existing password
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
                                Teachers Management
                            </h1>
                            <p className="text-gray-400 mt-2">Manage your institution's teachers and staff</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            + Add Teacher
                        </button>
                    </div>

                    {/* Teacher List */}
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-gold text-sm uppercase tracking-wider">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Mobile</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teachers.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500">No teachers found.</td>
                                        </tr>
                                    ) : (
                                        teachers.map((teacher, index) => (
                                            <motion.tr 
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={teacher._id} 
                                                className="border-b border-white/5 hover:bg-white/10 transition duration-200"
                                            >
                                                <td className="p-4 font-medium">{teacher.fullname}</td>
                                                <td className="p-4 text-gray-300">{teacher.email}</td>
                                                <td className="p-4 text-gray-300">{teacher.mobile}</td>
                                                <td className="p-4 flex justify-center space-x-4">
                                                    <button onClick={() => openEditModal(teacher)} className="text-blue-400 hover:text-blue-300 transition">
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(teacher._id)} className="text-red-400 hover:text-red-300 transition">
                                                        Delete
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
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
                            <h2 className="text-2xl font-bold text-gold mb-6">{modalMode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                    <input required name="fullname" value={currentTeacher.fullname} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                                        <input required type="email" name="email" value={currentTeacher.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Mobile</label>
                                        <input required name="mobile" value={currentTeacher.mobile} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Gender</label>
                                        <select required name="gender" value={currentTeacher.gender} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold">
                                            <option value="" disabled className="text-black">Select Gender</option>
                                            <option value="male" className="text-black">Male</option>
                                            <option value="female" className="text-black">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Aadhar No</label>
                                        <input required name="adharNo" value={currentTeacher.adharNo} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Department</label>
                                        <select required name="department" value={currentTeacher.department} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold">
                                            <option value="" disabled className="text-black">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept._id} value={dept.name} className="text-black">{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Specialty</label>
                                        <input required name="specialty" value={currentTeacher.specialty} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Experience (Years)</label>
                                        <input required name="experience" value={currentTeacher.experience} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Address / Contact Info</label>
                                        <input required name="address" value={currentTeacher.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>
                                {modalMode === 'add' && (
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                                        <input required type="password" name="password" value={currentTeacher.password} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                )}
                                <button type="submit" className="w-full mt-6 bg-gradient-to-r from-gold to-yellow-600 text-black py-3 rounded font-bold hover:opacity-90 transition">
                                    {modalMode === 'add' ? 'Create Teacher' : 'Save Changes'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
