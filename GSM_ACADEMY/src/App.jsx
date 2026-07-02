import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/home/Navbar'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { motion, AnimatePresence } from 'framer-motion'
import Context from './util/Context'
import API from './api/api'
import StudentDashboard from './pages/StudentDahboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminDepartments from './pages/AdminDepartments'
import AdminCourses from './pages/AdminCourses'
import AdminCategories from './pages/AdminCategories'
// Scroll to top button
const ScrollToTop = () => {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          id="scroll-to-top"
          aria-label="Scroll to top"
        >
          <i className="ri-arrow-up-line text-xl" style={{ color: 'var(--deep-green)' }} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function App() {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const getSession = async () => {
    try {
      setSessionLoading(true);
      const { data } = await API.get('/auth/session');
      setSession(data);
    }
    catch {
      setSession(null);
    }
    finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <Context.Provider value={{ session, sessionLoading, setSession, setSessionLoading }}>
      <Routes>
        <Route path="/" element={<><Navbar /><HomePage /><ScrollToTop /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/student/dashboard' element={<StudentDashboard />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/departments' element={<AdminDepartments />} />
        <Route path='/admin/courses' element={<AdminCourses />} />
        <Route path='/admin/categories' element={<AdminCategories />} />
      </Routes>
    </Context.Provider>
  )
}

export default App
