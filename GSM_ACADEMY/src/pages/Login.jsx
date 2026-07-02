import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import API from '../api/api';
import Context from '../util/Context';
import heritageBg from '../assets/heritage.png';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setSession } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/login', formData);
      const { data } = await API.get('/auth/session');
      console.log(data);
      setSession(data);

      // Redirect based on role
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-green font-outfit relative flex items-center justify-center overflow-hidden py-12 px-4">

      {/* Background Texture & Glow */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url(${heritageBg})`, backgroundSize: '300px' }}
      />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-dark/10 blur-[120px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-dark rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-black/50 relative overflow-hidden border border-gold/20">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="mb-10 text-center">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center bg-deep-green shadow-inner"
              >
                <img src={logo} alt="GSM Logo" className="h-12 w-auto drop-shadow-[0_0_15px_rgba(201,168,76,0.5)]" />
              </motion.div>
            </Link>
            <h1 className="font-playfair text-4xl font-bold text-cream mb-3 tracking-tight">
              Welcome <span className="text-gold">Back</span>
            </h1>
            <p className="text-cream/60 tracking-widest uppercase text-[10px] font-bold">
              Continue your journey in cultural excellence
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm border border-red-500/20 font-medium text-center backdrop-blur-md"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-2 ml-1 group-focus-within:text-gold transition-colors">Email or Mobile</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cream/30 group-focus-within:text-gold transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm font-medium"
                  placeholder="Enter your email or mobile"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-2 ml-1 group-focus-within:text-gold transition-colors">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cream/30 group-focus-within:text-gold transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm font-medium"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full btn-primary py-4 rounded-xl flex justify-center items-center gap-2 disabled:opacity-70 font-bold uppercase tracking-widest text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </motion.button>
            </div>
          </form>

          <p className="mt-8 text-center text-cream/40 text-[10px] font-bold uppercase tracking-widest">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold font-bold hover:text-gold-light transition-colors ml-1">
              Enroll Now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
