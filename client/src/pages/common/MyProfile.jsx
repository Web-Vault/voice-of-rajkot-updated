import React, { useState, useRef, useEffect } from 'react';
import { FaCheck, FaCamera, FaDownload, FaInfoCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { getUserProfile, updateUserProfile } from '../../services/userService';
import { getUserBookings } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MyProfile = () => {
  const { isLoggedIn, user: authUser, updateAuthState } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [photoHover, setPhotoHover] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const fileInputRef = useRef();
  const ticketRef = useRef();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userData, bookingsData] = await Promise.all([
          getUserProfile(),
          getUserBookings()
        ]);
        setUser(userData);
        setForm(userData);
        setTickets(bookingsData.bookings || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch user data');
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(form);
      setUser(updatedUser);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setForm({ ...form, photo: url });
      // TODO: Implement photo upload to server
    }
  };

  const handleDownload = (ticket) => {
    setCurrentTicket(ticket);
    setShowTicketModal(true);
  };
  
  const closeTicketModal = () => {
    setShowTicketModal(false);
  };
  
  const downloadTicketPDF = () => {
    if (ticketRef.current) {
      html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${currentTicket.event.name}-Ticket.pdf`);
      });
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    <section className="myprofile-section">
      {/* Header */}
      <div className="myprofile-header mb-10 px-4 md:px-0 max-w-5xl mx-auto">
        <h2 className="myprofile-title">My Profile</h2>
        <div className="myprofile-title-underline myprofile-title-underline-animated"></div>
        <div className="myprofile-subheading">Welcome back, {form.name.split(' ')[0]}! Manage your details and see your event history below.</div>
      </div>
      <div className="max-w-5xl mx-auto px-4 md:px-0">
        {/* Profile Card */}
        <form className="myprofile-maincard group relative overflow-hidden flex flex-col md:flex-row p-0 border border-[#e0e7ff] rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 mb-14" onSubmit={handleSave}>
          <div className="myprofile-accent-bar"></div>
          {/* Photo Section - Left Side */}
          <div
            className="myprofile-photo-section w-full md:w-1/3 flex flex-col items-center justify-center p-0 md:p-0 relative overflow-hidden"
            onMouseEnter={() => setPhotoHover(true)}
            onMouseLeave={() => setPhotoHover(false)}
          >
            <div className="myprofile-photo-rect-wrap w-full h-full relative">
              <img src={form.photo} alt={form.name} className="myprofile-photo-rect" />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <div
                className={`myprofile-photo-edit-overlay-rect${photoHover ? ' show' : ''}`}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <span className="myprofile-photo-edit-btn flex items-center gap-2">
                  <FaCamera className="inline-block text-lg" /> Edit
                </span>
              </div>
            </div>
          </div>
          {/* Details Section - Right Side */}
          <div className="myprofile-details-section w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="myprofile-label">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-edit" />
              </div>
              <div>
                <label className="myprofile-label">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="input-edit" />
              </div>
              <div>
                <label className="myprofile-label">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-edit" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" className="btn-save-profile flex items-center justify-center gap-2 px-10 py-3 text-lg">
                <FaCheck className="inline-block text-xl mb-0.5" /> Save Changes
              </button>
            </div>
          </div>
        </form>

        {/* Ticket History */}
        <div className="ticket-history-section mt-16">
          <div className="ticket-history-header mb-8">
            <h4 className="ticket-history-title">Ticket Purchase History</h4>
            <div className="ticket-history-title-underline ticket-history-title-underline-animated"></div>
            <div className="ticket-history-subheading">All your event tickets, with download options.</div>
          </div>
          <div className="ticket-history-list grid grid-cols-1 md:grid-cols-2 gap-8">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="ticket-card group flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-white via-indigo-50 to-indigo-100 border border-[#e0e7ff] rounded-2xl shadow p-6 hover:shadow-lg transition-all">
                <img src={ticket.event.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                     alt={ticket.event.name}
                     className="ticket-event-cover w-32 h-24 object-cover rounded-xl border border-indigo-100 shadow" />
                <div className="flex-1 w-full">
                  <div className="ticket-event-name text-lg font-bold text-indigo-800 mb-1">{ticket.event.name}</div>
                  <div className="ticket-event-info text-gray-700 mb-1">
                    <span className="font-medium">Date:</span> {format(new Date(ticket.event.dateTime), 'dd MMM yyyy')} &nbsp;|&nbsp;
                    <span className="font-medium">Time:</span> {format(new Date(ticket.event.dateTime), 'h:mm a')}
                  </div>
                  <div className="ticket-event-info text-gray-700 mb-1">
                    <span className="font-medium">Venue:</span> {ticket.event.venue}
                  </div>
                  <div className="ticket-event-info text-gray-700 mb-1">
                    <span className="font-medium">Type: </span> {ticket.isPerformer ? 'Performer' : 'Audience'}
                  </div>
                  <div className="ticket-event-info text-gray-700 mb-1">
                    <span className="font-medium">Seats:</span> {ticket.numberOfSeats} &nbsp;|&nbsp;Attendees: {ticket.isPerformer ? ticket.username : ticket.membersName?.join(', ')}
                  </div>
                  <div className="ticket-event-info text-gray-500 text-sm mb-2">
                    <span className="font-medium">Ticket ID:</span> {ticket.ticketId} &nbsp;|&nbsp;
                    <br />
                    <span className="font-medium">Purchased:</span> {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                  </div>
                  <button className="btn-secondary px-6 py-2 mt-2" onClick={() => handleDownload(ticket)}>Download Ticket</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showTicketModal && currentTicket && (
        <div className="modal-overlay">
          <div className="modal-content ticket-modal">
            <div className="modal-header">
              <h2>Your Ticket</h2>
              <button className="close-btn" onClick={closeTicketModal}>&times;</button>
            </div>
            <div className="modal-body p-6">
              <div className="ticket-container" ref={ticketRef}>
                <div className="ticket-header">
                  <div className="ticket-logo">Voice of Rajkot</div>
                  <div className="ticket-type">{currentTicket.isPerformer ? 'Performer' : 'Audience'}</div>
                </div>
                <div className="ticket-event-details">
                  <h3>{currentTicket.event.name}</h3>
                  <div className="ticket-info-row">
                    <div className="ticket-info-item">
                      <div className="info-label">Date</div>
                      <div className="info-value">{format(new Date(currentTicket.event.dateTime), 'dd MMM yyyy')}</div>
                    </div>
                    <div className="ticket-info-item">
                      <div className="info-label">Time</div>
                      <div className="info-value">{format(new Date(currentTicket.event.dateTime), 'h:mm a')}</div>
                    </div>
                    <div className="ticket-info-item">
                      <div className="info-label">Venue</div>
                      <div className="info-value">{currentTicket.event.venue}</div>
                    </div>
                  </div>
                  <div className="ticket-info-row">
                    <div className="ticket-info-item">
                      <div className="info-label">Booking ID</div>
                      <div className="info-value">{currentTicket.ticketId}</div>
                    </div>
                    <div className="ticket-info-item">
                      <div className="info-label">Seats</div>
                      <div className="info-value">{currentTicket.numberOfSeats}</div>
                    </div>
                    <div className="ticket-info-item">
                      <div className="info-label">Amount Paid</div>
                      <div className="info-value">₹{currentTicket.isPerformer ? currentTicket.totalAmount : (currentTicket.numberOfSeats * currentTicket.event.price)}</div>
                    </div>
                  </div>
                  <div className="ticket-attendees">
                    <div className="info-label">Attendees</div>
                    <div className="info-value">{currentTicket.isPerformer ? currentTicket.username : currentTicket.membersName?.join(', ')} 
                      {/* <span className="text-sm text-gray-500">{currentTicket.isPerformer ? ' (Performer)' : ''}</span> */}
                    </div>
                  </div>
                  <div className="ticket-info-row">
                    <div className="ticket-info-item">
                      <div className="info-label">Booking Date</div>
                      <div className="info-value">{format(new Date(currentTicket.createdAt), 'dd MMM yyyy')}</div>
                    </div>
                  </div>
                </div>
                <div className="ticket-footer">
                  <div className="ticket-instructions">
                    <div className="instruction-title">
                      <FaInfoCircle className="inline-block mr-2" />
                      Important Information
                    </div>
                    <div className="instruction-text">
                      Please bring this ticket and payment screenshot to the event entrance for verification.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button className="download-btn" onClick={downloadTicketPDF}>
                  <FaDownload className="inline-block mr-2" /> Download PDF Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .myprofile-section {
          background: #f8fafc;
          padding-top: 4.5rem;
          padding-bottom: 4.5rem;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .myprofile-header {
          margin: 0 auto 2.5rem auto;
          text-align: left;
        }
        .myprofile-title {
          font-size: 2.3rem;
          font-weight: 800;
          color: #232046;
          letter-spacing: -0.01em;
        }
        .myprofile-title-underline {
          width: 120px;
          height: 4px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1.2rem;
          margin-top: 0.1rem;
          box-shadow: 0 2px 12px #6366f144;
          border: 1.5px solid rgba(255,255,255,0.35);
        }
        .myprofile-title-underline-animated {
          transform: scaleX(0);
          transform-origin: left;
          animation: myprofileUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
        }
        @keyframes myprofileUnderlineGrow {
          0% {
            transform: scaleX(0);
            opacity: 0.2;
          }
          60% {
            opacity: 1;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        .myprofile-subheading {
          color: #6366f1;
          font-size: 1.13rem;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 1.2rem;
          max-width: 540px;
          letter-spacing: 0.01em;
        }
        .myprofile-maincard {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e0e7ff;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 350px;
          overflow: hidden;
        }
        .myprofile-maincard:hover {
          // transform: translateY(-3px);
          border-color: #6366f1;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        @media (min-width: 768px) {
          .myprofile-maincard {
            flex-direction: row;
            min-height: 320px;
          }
        }
        .myprofile-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
          z-index: 2;
        }
        .myprofile-photo-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(120deg, #eef2ff 60%, #f1f5ff 100%);
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: 0;
        }
        .myprofile-details-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .myprofile-label {
          text-align: left;
          display: block;
          font-size: 1.05rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.35rem;
          letter-spacing: 0.01em;
        }
        .myprofile-photo-rect-wrap {
          width: 100%;
          height: 100%;
          min-height: 220px;
          min-width: 180px;
          position: relative;
          display: flex;
        }
        .myprofile-photo-rect {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
          box-shadow: 0 2px 16px #6366f122, 0 4px 24px #6366f144;
          background: #f1f5ff;
          min-height: 220px;
          min-width: 180px;
          display: block;
        }
        .myprofile-photo-edit-overlay-rect {
          position: absolute;
          inset: 0;
          background: rgba(99,102,241,0.68);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          opacity: 0;
          cursor: pointer;
          transition: opacity 0.22s;
          font-size: 1.1rem;
          font-weight: 600;
          z-index: 2;
          backdrop-filter: blur(2.5px);
        }
        .myprofile-photo-edit-overlay-rect.show,
        .myprofile-photo-rect-wrap:hover .myprofile-photo-edit-overlay-rect {
          opacity: 1;
        }
        .myprofile-photo-edit-btn {
          background: rgba(255,255,255,0.18);
          padding: 0.5rem 1.2rem;
          border-radius: 1.2rem;
          font-size: 1.08rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          box-shadow: 0 2px 8px #6366f122;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .input-edit {
          width: 100%;
          padding: 0.7rem 1.1rem;
          border: 1.5px solid #e0e7ff;
          border-radius: 0.7rem;
          font-size: 1.08rem;
          margin-top: 0.1rem;
          background: #f8fafc;
          color: #232046;
          outline: none;
          transition: border 0.2s;
        }
        .input-edit:focus {
          border-color: #6366f1;
          background: #fff;
        }
        .btn-save-profile {
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          color: #fff;
          font-weight: 800;
          border-radius: 2rem;
          padding: 1.1rem 0;
          font-size: 1.13rem;
          transition: background 0.16s, box-shadow 0.16s, transform 0.13s;
          box-shadow: 0 4px 24px #6366f133, 0 2px 12px #6366f122;
          border: none;
          letter-spacing: 0.01em;
          outline: none;
          min-width: 200px;
        }
        .btn-save-profile:hover, .btn-save-profile:focus {
          background: linear-gradient(90deg, #818cf8 60%, #6366f1 100%);
          box-shadow: 0 8px 32px #6366f144;
          transform: translateY(-2px) scale(1.04);
        }
        .btn-secondary {
          background: #eef2ff;
          color: #6366f1;
          font-weight: 600;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: #e0e7ff;
        }
        .ticket-history-header {
          margin-bottom: 1.5rem;
        }
        .ticket-history-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #232046;
        }
        .ticket-history-title-underline {
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px #6366f144;
        }
        .ticket-history-title-underline-animated {
          transform: scaleX(0);
          transform-origin: left;
          animation: myprofileUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
        }
        .ticket-history-subheading {
          color: #6366f1;
          font-size: 1.05rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }
        .ticket-card {
          background: linear-gradient(120deg, #fff 80%, #f1f5ff 100%);
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px #6366f111;
          border: 1.5px solid #e0e7ff;
          transition: box-shadow 0.18s, border 0.18s, transform 0.18s;
        }
        .ticket-card:hover, .ticket-card:focus-within {
          box-shadow: 0 8px 32px #6366f144;
          border-color: #6366f1;
          transform: translateY(-2px) scale(1.01);
        }
        .ticket-event-cover {
          width: 8rem;
          height: 6rem;
          object-fit: cover;
          border-radius: 0.8rem;
          border: 1.5px solid #e0e7ff;
          box-shadow: 0 2px 8px #6366f122;
        }
        .ticket-event-name {
          color: #232046;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .ticket-event-info {
          font-size: 1rem;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 1rem;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          overflow: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          color: #232046;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        
        /* Ticket Modal Styles */
        .ticket-modal {
          max-width: 800px;
          width: 90%;
        }
        
        .ticket-container {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
          margin-bottom: 1.5rem;
        }
        
        .ticket-header {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .ticket-logo {
          font-size: 1.5rem;
          font-weight: 800;
        }
        
        .ticket-type {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .ticket-event-details {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .ticket-event-details h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .ticket-info-row {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .ticket-info-item {
          flex: 1;
          min-width: 120px;
        }
        
        .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6366f1;
          margin-bottom: 0.25rem;
        }
        
        .info-value {
          font-size: 1rem;
          color: #1f2937;
        }
        
        .ticket-attendees {
          margin-bottom: 1rem;
        }
        
        .ticket-footer {
          padding: 1.5rem;
          background: #f9fafb;
        }
        
        .ticket-instructions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .instruction-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
        }
        
        .instruction-text {
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        .download-btn {
          background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </section>
  );
};

export default MyProfile;