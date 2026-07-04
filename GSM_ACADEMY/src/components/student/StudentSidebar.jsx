import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../util/Context';
import { motion } from 'framer-motion';

const StudentSidebar = () => {
    const { session, setSession } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setSession(null);
        navigate('/login');
    };

    const initial = session?.fullname?.charAt(0)?.toUpperCase() || 'S';

    return (
        <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="w-72 h-screen fixed top-0 left-0 flex flex-col justify-between z-40"
            style={{
                background: 'linear-gradient(180deg, #0a0f0d 0%, #0d1a14 50%, #0a0f0d 100%)',
                borderRight: '1px solid rgba(201,168,76,0.08)',
            }}
        >
            {/* Top Section */}
            <div>
                {/* Branding */}
                <div className="px-6 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
                                border: '1px solid rgba(201,168,76,0.15)',
                            }}
                        >
                            <i className="ri-graduation-cap-line text-xl" style={{ color: '#c9a84c' }} />
                        </div>
                        <div>
                            <p className="text-sm font-bold tracking-wider" style={{ color: '#c9a84c' }}>GSM ACADEMY</p>
                            <p className="text-[10px] tracking-[0.2em]" style={{ color: 'rgba(201,168,76,0.4)' }}>STUDENT PORTAL</p>
                        </div>
                    </div>
                </div>

                {/* Profile card */}
                <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                    <div
                        className="p-4 rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
                            border: '1px solid rgba(201,168,76,0.1)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                                style={{
                                    background: 'linear-gradient(135deg, #c9a84c, #a08030)',
                                    color: '#0a0f0d',
                                    boxShadow: '0 4px 20px rgba(201,168,76,0.25)',
                                }}
                            >
                                {initial}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{session?.fullname || 'Student'}</p>
                                <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{session?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="px-4 pt-4 space-y-1">
                    <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(201,168,76,0.35)' }}>
                        Learning
                    </p>
                    <NavLink
                        to="/student/dashboard"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                                isActive
                                    ? 'font-semibold'
                                    : 'hover:bg-white/[0.03]'
                            }`
                        }
                        style={({ isActive }) => ({
                            background: isActive ? 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))' : 'transparent',
                            color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.45)',
                            border: isActive ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
                            boxShadow: isActive ? '0 0 20px rgba(201,168,76,0.08)' : 'none',
                        })}
                    >
                        <i className="ri-dashboard-line text-lg" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/student/dashboard"
                        end={false}
                        className={() => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 hover:bg-white/[0.03]`}
                        style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid transparent' }}
                        onClick={(e) => { e.preventDefault(); navigate('/#courses'); }}
                    >
                        <i className="ri-compass-discover-line text-lg" />
                        <span>Explore Courses</span>
                    </NavLink>

                    <p className="px-3 pt-5 pb-2 text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(201,168,76,0.35)' }}>
                        Account
                    </p>

                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm cursor-default"
                        style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid transparent' }}
                    >
                        <i className="ri-settings-4-line text-lg" />
                        <span>Settings</span>
                        <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/20 font-semibold">Soon</span>
                    </div>
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="px-4 pb-6 space-y-3">
                {/* Home button */}
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-300"
                    style={{
                        color: 'rgba(255,255,255,0.5)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        background: 'rgba(255,255,255,0.02)',
                    }}
                >
                    <i className="ri-home-4-line" />
                    <span>Back to Home</span>
                </button>
                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-300"
                    style={{
                        color: '#f87171',
                        border: '1px solid rgba(248,113,113,0.12)',
                        background: 'rgba(248,113,113,0.04)',
                    }}
                >
                    <i className="ri-logout-box-r-line" />
                    <span>Logout</span>
                </button>
            </div>
        </motion.aside>
    );
};

export default StudentSidebar;
