import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, CreditCard, FileText, Image as ImageIcon, Users, ArrowRight, Loader2, UploadCloud, Link as LinkIcon, KeyRound } from 'lucide-react';
import API from '../api/api';
import heritageBg from '../assets/heritage.png';
import logo from '../assets/logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobile: '',
    password: '',
    gender: 'male',
    profilePic: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    bio: '',
    adharNo: '',
    adharPic: '',
    parentName: '',
    parentMobileNo: ''
  });
  
  const [adharFile, setAdharFile] = useState(null);
  const [adharUploadType, setAdharUploadType] = useState('file');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!showOtp) {
        // Step 1: Request OTP
        await API.post('/auth/send-otp', { email: formData.email });
        setShowOtp(true);
      } else {
        // Step 2: Verify OTP and submit form
        const data = new FormData();
        Object.keys(formData).forEach(key => {
          data.append(key, formData[key]);
        });
        if (adharUploadType === 'file' && adharFile) {
          data.append('adharPicFile', adharFile);
        }
        data.append('otp', otp);
        
        await API.post('/enrollment', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAdharFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-deep-green font-outfit relative overflow-hidden py-12">
      {/* Dynamic Background Effects */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${heritageBg})`, backgroundSize: '400px' }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold-dark/10 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-10">
            <Link to="/">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center bg-deep-green shadow-inner"
              >
                <img src={logo} alt="GSM Logo" className="h-12 w-auto drop-shadow-[0_0_15px_rgba(201,168,76,0.5)]" />
              </motion.div>
            </Link>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-cream mb-3 tracking-tight">
              Forge Your <span className="text-gold">Legacy</span>
            </h1>
            <p className="text-cream/60 tracking-widest uppercase text-xs font-semibold max-w-lg mx-auto">
              Enroll now to join our prestigious academy of classical arts
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="glass-dark rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/50 relative overflow-hidden"
          >
            {/* subtle top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-8 text-sm border border-red-500/20 font-medium text-center backdrop-blur-md"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/10 text-green-400 p-8 rounded-xl mb-8 text-center flex flex-col items-center gap-4 border border-green-500/20 backdrop-blur-md"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <ArrowRight className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cream mb-1">Enrollment Successful!</h3>
                    <p className="text-sm opacity-80">Welcome to GSM Academy. Redirecting to portal...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-10">
                
                <AnimatePresence mode="wait">
                  {!showOtp ? (
                    <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                      {/* Section 1: Personal Details */}
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-6 flex items-center gap-3">
                          <span className="w-6 h-px bg-gold/30"></span>
                          Personal Details
                          <span className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent"></span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <input type="text" required name="fullname" value={formData.fullname} onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="John Doe" />
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <input type="email" required name="email" value={formData.email} onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="john@example.com" />
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Mobile Number</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <input type="text" required name="mobile" value={formData.mobile} onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="+91 9876543210" />
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Password</label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <input type="password" required name="password" minLength={6} value={formData.password} onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="Min. 6 characters" />
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}
                              className="w-full px-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream text-sm appearance-none cursor-pointer">
                              <option value="male" className="bg-deep-green">Male</option>
                              <option value="female" className="bg-deep-green">Female</option>
                              <option value="other" className="bg-deep-green">Other</option>
                            </select>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Short Bio</label>
                            <div className="relative">
                              <FileText className="absolute left-4 top-3.5 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={1}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm resize-none" placeholder="A bit about yourself..." />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Identity & Guardian */}
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-6 flex items-center gap-3">
                          <span className="w-6 h-px bg-gold/30"></span>
                          Identity & Guardian
                          <span className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent"></span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Aadhar Number</label>
                            <div className="relative">
                              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <input type="text" required name="adharNo" value={formData.adharNo} onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="12-digit Aadhar No" />
                            </div>
                          </div>
                          
                          <div className="group">
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 ml-1 group-focus-within:text-gold transition-colors">Aadhar Document</label>
                              <div className="flex bg-black/30 rounded-md p-0.5 border border-gold/10">
                                <button type="button" onClick={() => setAdharUploadType('file')} className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${adharUploadType === 'file' ? 'bg-gold/20 text-gold' : 'text-cream/40 hover:text-cream'}`}>File</button>
                                <button type="button" onClick={() => setAdharUploadType('url')} className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${adharUploadType === 'url' ? 'bg-gold/20 text-gold' : 'text-cream/40 hover:text-cream'}`}>URL</button>
                              </div>
                            </div>
                            
                            <AnimatePresence mode="wait">
                              {adharUploadType === 'file' ? (
                                <motion.div key="file" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="relative">
                                  <input type="file" accept="image/*" onChange={handleFileChange} id="adharFile" className="hidden" />
                                  <label htmlFor="adharFile" className="w-full flex items-center gap-3 px-4 py-3 bg-black/20 border border-gold/10 border-dashed rounded-xl hover:border-gold/50 hover:bg-black/40 cursor-pointer transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                      <UploadCloud className="text-gold" size={16} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-sm text-cream truncate">{adharFile ? adharFile.name : 'Upload Image'}</p>
                                      <p className="text-[9px] text-cream/40 uppercase tracking-widest mt-0.5">JPG, PNG up to 5MB</p>
                                    </div>
                                  </label>
                                </motion.div>
                              ) : (
                                <motion.div key="url" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="relative">
                                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                                  <input type="url" name="adharPic" value={formData.adharPic} onChange={handleChange} required={adharUploadType === 'url'}
                                    className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="https://..." />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Guardian Name</label>
                            <div className="relative">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <input type="text" required name="parentName" value={formData.parentName} onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="Guardian's Full Name" />
                            </div>
                          </div>
                          <div className="group">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-cream/40 mb-1.5 ml-1 group-focus-within:text-gold transition-colors">Guardian Mobile</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 group-focus-within:text-gold transition-colors" size={16} />
                              <input type="text" required name="parentMobileNo" value={formData.parentMobileNo} onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream placeholder:text-cream/20 text-sm" placeholder="Guardian's Contact No" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-8">
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/30">
                          <Mail className="text-gold" size={24} />
                        </div>
                        <h3 className="text-2xl font-playfair text-cream font-bold mb-2">Check your email</h3>
                        <p className="text-sm text-cream/60">We've sent a 6-digit verification code to<br/><strong className="text-gold">{formData.email}</strong></p>
                      </div>
                      
                      <div className="max-w-xs mx-auto">
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30" size={18} />
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full pl-11 pr-4 py-4 bg-black/20 border border-gold/10 rounded-xl focus:border-gold/50 focus:bg-black/40 focus:outline-none transition-all text-cream text-center tracking-[1em] font-black text-xl placeholder:text-cream/10 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm"
                            placeholder="Enter 6-digit OTP"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading || success}
                    type="submit"
                    className="w-full btn-primary py-4 rounded-xl flex justify-center items-center gap-3 disabled:opacity-70 group overflow-hidden relative"
                  >
                    {loading ? <Loader2 className="animate-spin relative z-10" size={20} /> : (
                      <>
                        {showOtp ? 'Verify & Complete Enrollment' : 'Request OTP Verification'}
                        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
            
            {!showOtp && (
              <p className="mt-8 text-center text-cream/40 text-xs font-semibold uppercase tracking-widest">
                Already a member?{' '}
                <Link to="/login" className="text-gold font-bold hover:text-gold-light transition-colors">
                  Enter Sanctuary
                </Link>
              </p>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
