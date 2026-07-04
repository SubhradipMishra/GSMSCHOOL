import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../util/Context';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import AdminSidebar from '../components/admin/AdminSidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminEvents = () => {
    const { session, sessionLoading } = useAuth();
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    
    const [currentEvent, setCurrentEvent] = useState({
        title: '',
        place: '',
        description: '',
        subject: '',
        organiser: '',
        seat: '',
        price: '',
        date: '',
        time: '',
        dressCode: '',
        notes: ''
    });
    const [documentFile, setDocumentFile] = useState(null);

    useEffect(() => {
        if (!sessionLoading) {
            if (!session || session.role !== 'admin') {
                navigate('/login');
            } else {
                fetchEvents();
            }
        }
    }, [session, sessionLoading, navigate]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/events/admin/events');
            if (data.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
            toast.error("Failed to load events.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setCurrentEvent({ ...currentEvent, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setDocumentFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', currentEvent.title);
            formData.append('place', currentEvent.place);
            formData.append('description', currentEvent.description);
            formData.append('subject', currentEvent.subject);
            formData.append('organiser', currentEvent.organiser);
            formData.append('seat', currentEvent.seat || 0);
            formData.append('price', currentEvent.price || 0);
            formData.append('date', currentEvent.date);
            formData.append('time', currentEvent.time);
            formData.append('dressCode', currentEvent.dressCode || '');
            formData.append('notes', currentEvent.notes || '');

            if (documentFile) {
                formData.append('document', documentFile);
            }

            if (modalMode === 'add') {
                await API.post('/events/admin/events', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Event created successfully!");
            } else {
                await API.put(`/events/admin/events/${currentEvent._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Event updated successfully!");
            }
            setShowModal(false);
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event? All associated student bookings will be marked cancelled.")) {
            try {
                await API.delete(`/events/admin/events/${id}`);
                toast.success("Event deleted successfully!");
                fetchEvents();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete event");
            }
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setCurrentEvent({
            title: '',
            place: '',
            description: '',
            subject: '',
            organiser: '',
            seat: '',
            price: '',
            date: '',
            time: '',
            dressCode: '',
            notes: ''
        });
        setDocumentFile(null);
        setShowModal(true);
    };

    const openEditModal = (event) => {
        setModalMode('edit');
        // Format date string for HTML date input: YYYY-MM-DD
        const formattedDate = event.date ? event.date.substring(0, 10) : '';
        setCurrentEvent({
            ...event,
            date: formattedDate
        });
        setDocumentFile(null);
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
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-white bg-clip-text text-transparent font-cormorant">
                                Events Management
                            </h1>
                            <p className="text-gray-400 mt-2">Create and manage upcoming Academy workshops, showcases, and festivals</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            + Create Event
                        </button>
                    </div>

                    {/* Events Table/List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {events.length === 0 ? (
                                <p className="text-gray-500 col-span-3">No events scheduled yet.</p>
                            ) : (
                                events.map((event, index) => {
                                    const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    });

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={event._id}
                                            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                                                        {event.subject}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {eventDate} @ {event.time}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                                                <p className="text-gray-400 text-sm line-clamp-3 mb-4">{event.description}</p>
                                                
                                                <div className="text-xs text-gray-300 space-y-1 mb-4">
                                                    <p><span className="font-semibold text-white/50">Venue:</span> {event.place}</p>
                                                    <p><span className="font-semibold text-white/50">Organiser:</span> {event.organiser}</p>
                                                    <p><span className="font-semibold text-white/50">Seats Available:</span> {event.seat - (event.seatsBooked || 0)} / {event.seat}</p>
                                                    <p><span className="font-semibold text-white/50">Price:</span> {event.price === 0 ? 'FREE' : `₹${event.price}`}</p>
                                                    {event.dressCode && <p><span className="font-semibold text-white/50">Dress Code:</span> {event.dressCode}</p>}
                                                </div>

                                                {event.documentUrl && (
                                                    <div className="mb-4">
                                                        <a 
                                                            href={`http://localhost:7070${event.documentUrl}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-gold text-xs underline hover:text-yellow-400"
                                                        >
                                                            📎 View Attached Document
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-6 flex justify-end space-x-3 border-t border-white/5 pt-4">
                                                <button onClick={() => openEditModal(event)} className="text-blue-400 hover:text-blue-300 transition text-sm">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(event._id)} className="text-red-400 hover:text-red-300 transition text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })
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
                            className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto text-white"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                            <h2 className="text-2xl font-bold text-gold mb-6 font-cormorant">{modalMode === 'add' ? 'Create Event' : 'Edit Event'}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Event Title *</label>
                                        <input required name="title" value={currentEvent.title} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Subject / Category *</label>
                                        <input required name="subject" value={currentEvent.subject} onChange={handleInputChange} placeholder="e.g. Classical Dance, Music" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Organiser *</label>
                                        <input required name="organiser" value={currentEvent.organiser} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Venue / Place *</label>
                                        <input required name="place" value={currentEvent.place} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Date *</label>
                                        <input required type="date" name="date" value={currentEvent.date} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Time *</label>
                                        <input required type="text" name="time" value={currentEvent.time} onChange={handleInputChange} placeholder="e.g. 5:00 PM – 8:00 PM" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Seat Capacity *</label>
                                        <input required type="number" name="seat" value={currentEvent.seat} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Ticket Price (₹) *</label>
                                        <input required type="number" name="price" value={currentEvent.price} onChange={handleInputChange} placeholder="0 for Free" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Dress Code</label>
                                        <input type="text" name="dressCode" value={currentEvent.dressCode} onChange={handleInputChange} placeholder="e.g. Traditional" className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Additional Document Upload (PDF, Doc, Image, Zip)</label>
                                    <input type="file" name="document" onChange={handleFileChange} className="w-full bg-white/5 border border-white/10 p-2 rounded text-white focus:outline-none focus:border-gold text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gold file:text-black hover:file:bg-yellow-600" />
                                    {modalMode === 'edit' && currentEvent.documentUrl && (
                                        <p className="text-xs text-gold mt-1">Keep empty to retain existing: {currentEvent.documentUrl.split('/').pop()}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Description *</label>
                                    <textarea required name="description" value={currentEvent.description} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Important Notes</label>
                                    <textarea name="notes" value={currentEvent.notes} onChange={handleInputChange} rows={2} placeholder="Any specific instructions for attendees..." className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:outline-none focus:border-gold" />
                                </div>

                                <button type="submit" className="w-full mt-6 bg-gradient-to-r from-gold to-yellow-600 text-black py-3 rounded font-bold hover:opacity-90 transition">
                                    {modalMode === 'add' ? 'Publish Event' : 'Save Event'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminEvents;
