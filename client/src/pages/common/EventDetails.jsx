import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaUser, FaRupeeSign, FaTicketAlt, FaArrowRight, FaUsers, FaMicrophone } from "react-icons/fa";
import { getEventById } from "../../services/eventService";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data.event);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch event details');
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleRegisterAsAudience = () => {
    navigate(`/register/audience/${id}`);
    setShowDropdown(false);
  };

  const handleRegisterAsPerformer = () => {
    navigate(`/register/performer/${id}`);
    setShowDropdown(false);
  };

  if (loading) {
    return <div className="text-center py-20">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!event) {
    return <div className="text-center py-20">Event not found</div>;
  }

  const availableSeats = event.totalSeats - event.bookedSeats;
  const bookedPercent = Math.round((event.bookedSeats / event.totalSeats) * 100);

  return (
    <div className="eventdetails-fullscreen-refined">
      {/* HERO SECTION */}
      <div className="eventdetails-hero">
        <img src={event.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"} 
             alt={event.name} 
             className="eventdetails-hero-img" />
        <div className="eventdetails-hero-overlay"></div>
        <div className="eventdetails-hero-content">
          <div className="eventdetails-hero-title-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <h1 className="eventdetails-hero-title" style={{ textAlign: 'left', width: '100%' }}>{event.name}</h1>
            <div className="eventdetails-hero-underline" style={{ marginLeft: 0, marginRight: 0 }}></div>
          </div>
          <div className="eventdetails-hero-meta">
            <span><FaCalendarAlt /> {format(new Date(event.dateTime), 'dd MMM yyyy, h:mm a')}</span>
            <span><FaMapMarkerAlt /> {event.venue}</span>
          </div>
        </div>
      </div>

      {/* INFO PANEL */}
      <section className="eventdetails-info-panel">
        <div className="eventdetails-info-flex">
          <div className="eventdetails-info-left">
            <p
              className="eventdetails-info-desc"
              style={{ whiteSpace: "pre-line" }}
            >
              {event.description}
            </p>
            <div className="eventdetails-performers-row">
              {event.performers.map((performer, idx) => (
                <div key={idx} className="eventdetails-performer-avatar-wrap">
                  <img
                    src={
                      performer.profilePhoto ||
                      `https://randomuser.me/api/portraits/${
                        performer.gender === "female" ? "women" : "men"
                      }/${(idx + 1) * 11}.jpg`
                    }
                    alt={performer.name}
                    className="eventdetails-performer-avatar"
                  />
                  <div className="eventdetails-performer-name">{performer.name}</div>
                  <div className="eventdetails-performer-role">Performer</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Seats, Price, Buy Button */}
          <div className="eventdetails-info-right">
            <div className="eventdetails-seats-label flex items-center gap-2 mb-1"><FaChair /> Seats</div>
            <div className="eventdetails-seats-booked">{event.bookedSeats} / {event.totalSeats} booked</div>
            <div className="eventdetails-seats-bar-bg">
              <div className="eventdetails-seats-bar-fill" style={{ width: `${bookedPercent}%` }}></div>
            </div>
            <div className="eventdetails-seats-available">{availableSeats} available</div>
            <div className="eventdetails-seats-price flex items-center gap-2"><FaRupeeSign /> {event.price} <span>per seat</span></div>
            <div className="eventdetails-register-dropdown-wrap">
              <button 
                className="eventdetails-buy-btn-glow-refined"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaTicketAlt /> Register Yourself
              </button>
              {showDropdown && (
                <div className="eventdetails-dropdown-menu">
                  <button 
                    className="eventdetails-dropdown-item"
                    onClick={handleRegisterAsAudience}
                  >
                    <FaUsers /> Register as Audience
                  </button>
                  <button 
                    className="eventdetails-dropdown-item"
                    onClick={handleRegisterAsPerformer}
                  >
                    <FaMicrophone /> Register as Performer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OTHER EVENTS */}
      {/* --- Other Events section would go here. Uncomment and implement as needed. --- */}

      {/* Styles */}
      <style>{`
        .eventdetails-fullscreen-refined {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        /* HERO */
        .eventdetails-hero {
          position: relative;
          width: 100vw;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          height: 400px;
          max-height: 44vw;
          min-height: 340px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .eventdetails-hero-img {
          width: 100vw;
          height: 100%;
          object-fit: cover;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
        }
        .eventdetails-hero-overlay {
          position: absolute;
          left: 0; top: 0; width: 100%; height: 100%;
          background: linear-gradient(180deg, #232046ee 0%, #232046cc 60%, #23204600 100%);
          z-index: 2;
        }
        .eventdetails-hero-content {
          position: relative;
          z-index: 3;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
        .eventdetails-hero-title {
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -0.01em;
          text-shadow: 0 4px 32px #23204699, 0 1.5px 0 #23204644;
          text-align: left;
        }
        .eventdetails-hero-underline {
          width: 250px;
          height: 4px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-top: 1.2rem;
          margin-bottom: 1.2rem;
          margin-left: 0;
          box-shadow: 0 2px 12px #6366f144;
          border: 1.5px solid rgba(255,255,255,0.35);
          animation: eventdetailsUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
          transform: scaleX(0);
          transform-origin: left;
        }
        @keyframes eventdetailsUnderlineGrow {
          0% { transform: scaleX(0); opacity: 0.2; }
          60% { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .eventdetails-hero-meta {
          display: flex;
          gap: 2.5rem;
          font-size: 1.18rem;
          font-weight: 600;
          margin-top: 0.7rem;
          color: #e0e7ff;
          text-shadow: 0 2px 8px #23204699;
          justify-content: center;
        }
        .eventdetails-hero-meta span {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        @media (max-width: 700px) {
          .eventdetails-hero-title { font-size: 2rem; }
          .eventdetails-hero-meta { font-size: 1rem; gap: 1.2rem; }
        }
        /* INFO PANEL */
        .eventdetails-info-panel {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: -70px;
          margin-bottom: 2.5rem;
          z-index: 10;
          position: relative;
        }
        .eventdetails-info-flex {
          width: 100%;
          max-width: 1100px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border-radius: 2.2rem;
          box-shadow: 0 8px 40px #6366f122, 0 2px 12px #6366f144;
          padding: 3.5rem 2.5rem 2.5rem 2.5rem;
          display: flex;
          gap: 2.5rem;
          min-height: 260px;
        }
        @media (max-width: 900px) {
          .eventdetails-info-flex {
            flex-direction: column;
            padding: 2.2rem 1.2rem 1.5rem 1.2rem;
            gap: 1.5rem;
          }
        }
        .eventdetails-info-left {
          flex: 2 1 400px;
          min-width: 260px;
        }
        .eventdetails-info-desc {
          color: #232046;
          font-size: 1.18rem;
          font-weight: 500;
          margin-bottom: 2.2rem;
        }
        .eventdetails-performers-row {
          display: flex;
          gap: 2.2rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }
        .eventdetails-performer-avatar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          background: #eef2ffcc;
          border-radius: 1.2rem;
          padding: 0.7rem 1.1rem 0.7rem 1.1rem;
          box-shadow: 0 2px 8px #6366f111;
          font-size: 1rem;
          font-weight: 600;
          color: #232046;
          border: 1.2px solid #e0e7ff;
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .eventdetails-performer-avatar-wrap:hover {
          box-shadow: 0 4px 16px #6366f144;
          transform: scale(1.04);
        }
        .eventdetails-performer-avatar {
          width: 3.1rem;
          height: 3.1rem;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #6366f1;
        }
        .eventdetails-performer-name {
          font-weight: 700;
          font-size: 1.08rem;
          margin-top: 0.2rem;
        }
        .eventdetails-performer-role {
          color: #6366f1;
          font-size: 0.98rem;
        }
        .eventdetails-info-right {
          flex: 1 1 220px;
          min-width: 220px;
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 2px 12px #6366f111;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          align-items: flex-start;
          margin-top: 0.5rem;
        }
        .eventdetails-seats-label {
          color: #6366f1;
          font-weight: 700;
          font-size: 1.08rem;
        }
        .eventdetails-seats-booked {
          color: #232046;
          font-weight: 700;
          font-size: 1.13rem;
        }
        .eventdetails-seats-bar-bg {
          width: 100%;
          height: 10px;
          background: #e0e7ff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1.5px 6px #23204611;
        }
        .eventdetails-seats-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 6px;
          transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 1.5px 6px #6366f144;
        }
        .eventdetails-seats-available {
          color: #16a34a;
          font-weight: 700;
          font-size: 1.08rem;
        }
        .eventdetails-seats-price {
          color: #6366f1;
          font-size: 1.18rem;
          font-weight: 700;
        }
        .eventdetails-buy-btn-glow-refined {
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          color: #fff;
          font-weight: 900;
          border-radius: 2.2rem;
          padding: 1.2rem;
          font-size: 1.25rem;
          transition: background 0.16s, box-shadow 0.16s, transform 0.13s;
          box-shadow: 0 8px 32px #6366f144, 0 2px 12px #6366f122;
          border: none;
          letter-spacing: 0.01em;
          outline: none;
          min-width: max-content;
          margin-top: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
          transition: all ease-in-out 1.16s;
          animation: eventdetailsBtnGlow 2.5s infinite alternate;
        }
        .eventdetails-buy-btn-glow-refined:hover, .eventdetails-buy-btn-glow-refined:focus {
          background: linear-gradient(90deg, #818cf8 60%, #6366f1 100%);
          box-shadow: 0 12px 40px #6366f144, 0 4px 24px #6366f122;
          // transform: translateY(-2px) scale(1.04);
        }
        @keyframes eventdetailsBtnGlow {
          0% { box-shadow: 0 8px 32px #6366f144, 0 2px 12px #6366f122; }
          100% { box-shadow: 0 16px 48px #6366f199, 0 4px 24px #6366f144; }
        }
        /* DROPDOWN MENU */
        .eventdetails-register-dropdown-wrap {
          position: relative;
          display: inline-block;
          z-index: 9999;
          width: 100%;
        }
        .eventdetails-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.27), 0 4px 16px rgba(99, 102, 241, 0.13);
          border: 1.5px solid #e0e7ff;
          overflow: hidden;
          margin-top: 0.5rem;
          animation: dropdownSlideIn 0.2s cubic-bezier(0.4,0,0.2,1);
          z-index: 10000;
          isolation: isolate;
        }
        .eventdetails-dropdown-item {
          // width: 100%;
          padding: 1rem 1.2rem;
          background: transparent;
          border: none;
          color: #232046;
          font-size: 1.08rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.18s ease;
          border-bottom: 1px solid #f1f5ff;
          position: relative;
          z-index: 5;
        }
        .eventdetails-dropdown-item:last-child {
          border-bottom: none;
        }
        .eventdetails-dropdown-item:hover {
          background: #f8fafc;
          color: #6366f1;
        }
        .eventdetails-dropdown-item:active {
          background: #eef2ff;
        }
        /* OTHER EVENTS */
        .events-tile-section {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto 2.5rem auto;
          padding: 0 2vw;
        }
        .events-tile-header {
          margin-bottom: 1.5rem;
        }
        .events-tile-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #232046;
        }
        .events-tile-title-underline {
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px #6366f144;
        }
        .events-tile-title-underline-animated {
          animation: eventsTileTitleUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
          transform: scaleX(0);
        }
        @keyframes eventsTileTitleUnderlineGrow {
          0% { transform: scaleX(0); opacity: 0.2; }
          60% { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .events-tile-subheading {
          font-size: 1.01rem;
          color: #6366f1;
          font-weight: 600;
          margin: 0.7rem 0 0.2rem 0.9rem;
        }
        .events-tile-header-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px #6366f144;
        }
        .events-tile-carousel-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .events-tile-fade-left, .events-tile-fade-right {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
          z-index: 1;
        }
        .events-tile-fade-left {
          left: 0;
        }
        .events-tile-fade-right {
          right: 0;
        }
        .events-tile-carousel {
          display: flex;
          gap: 2.2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scroll-snap-type: x mandatory;
        }
        .event-tile-item {
          scroll-snap-align: start;
        }
        .event-tile-img-wrap {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
        }
        .event-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .event-tile-img-taller {
          height: 200px;
        }
        .event-tile-img-fade-short {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, #232046cc 100%);
          z-index: 2;
        }
        .event-tile-img-title {
          position: absolute;
          left: 1.1rem;
          bottom: 1.1rem;
          z-index: 3;
          color: #fff;
          font-size: 1.18rem;
          font-weight: 800;
          text-shadow: 0 2px 12px #23204699, 0 1.5px 0 #23204644;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 80%;
        }
        .event-tile-date-badge {
          position: absolute;
          left: 1.1rem;
          top: 1.1rem;
          z-index: 3;
          color: #fff;
          font-size: 1.01rem;
          font-weight: 600;
          text-shadow: 0 2px 12px #23204699, 0 1.5px 0 #23204644;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 80%;
        }
        .event-tile-content {
          position: relative;
          z-index: 3;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          padding: 1.5rem;
          border-radius: 1.2rem;
          border: 1.5px solid #e0e7ff;
          background: linear-gradient(120deg, #fff 80%, #f1f5ff 100%);
          transition: box-shadow 0.18s, border 0.18s, transform 0.18s;
        }
        .event-tile-content-gradient {
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          border-radius: 1.2rem;
          background: linear-gradient(120deg, #fff 80%, #f1f5ff 100%);
        }
        .event-tile-desc {
          color: #232046;
          font-size: 1.18rem;
          font-weight: 500;
          margin-bottom: 2.2rem;
        }
        .event-tile-meta {
          display: flex;
          gap: 1.2rem;
          font-size: 1.01rem;
          color: #6366f1;
          font-weight: 600;
        }
        .event-tile-meta span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .event-tile-progress-wrap {
          width: 100%;
          height: 10px;
          background: #e0e7ff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1.5px 6px #23204611;
        }
        .event-tile-progress-bg {
          width: 100%;
          height: 10px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 6px;
          transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 1.5px 6px #6366f144;
        }
        .event-tile-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 6px;
          transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 1.5px 6px #6366f144;
        }
        .event-tile-progress-label {
          color: #232046;
          font-weight: 700;
          font-size: 1.01rem;
        }
        .event-tile-details-btn-wrap {
          width: 100%;
          margin-top: 1.2rem;
        }
        .event-tile-details-btn {
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          color: #fff;
          font-weight: 900;
          border-radius: 2.2rem;
          padding: 1.2rem 0;
          font-size: 1.25rem;
          transition: background 0.16s, box-shadow 0.16s, transform 0.13s;
          box-shadow: 0 8px 32px #6366f144, 0 2px 12px #6366f122;
          border: none;
          letter-spacing: 0.01em;
          outline: none;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .event-tile-details-btn:hover, .event-tile-details-btn:focus {
          color: #e0e7ff;
          box-shadow: 0 4px 16px #6366f133;
          transform: translateY(-2px) scale(1.04);
        }
      `}</style>

</div>
    );
};

export default EventDetails;