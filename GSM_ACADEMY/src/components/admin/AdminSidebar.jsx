import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../util/Context';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
    const { setSession } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setSession(null);
        navigate('/login');
    };

    return (
        <motion.div 
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="w-64 bg-gray-900 border-r border-white/10 h-screen fixed top-0 left-0 pt-8 pb-6 flex flex-col justify-between"
        >
            <div>
                <div className="px-6 mb-8 text-gold font-bold text-xl tracking-wider">
                    ADMIN MENU
                </div>
                <nav className="space-y-2 px-4">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                                isActive ? 'bg-gold text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <i className="ri-user-star-line mr-3 text-lg"></i> Teachers
                    </NavLink>
                    <NavLink
                        to="/admin/departments"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                                isActive ? 'bg-gold text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <i className="ri-building-line mr-3 text-lg"></i> Departments
                    </NavLink>
                    <NavLink
                        to="/admin/courses"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                                isActive ? 'bg-gold text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <i className="ri-book-open-line mr-3 text-lg"></i> Courses
                    </NavLink>
                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                                isActive ? 'bg-gold text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <i className="ri-price-tag-3-line mr-3 text-lg"></i> Categories
                    </NavLink>
                </nav>
            </div>
            
            <div className="px-4">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-red-400 border border-red-400/30 hover:bg-red-500/10 transition-colors"
                >
                    <i className="ri-logout-box-r-line mr-2"></i> Logout
                </button>
            </div>
        </motion.div>
    );
};

export default AdminSidebar;
