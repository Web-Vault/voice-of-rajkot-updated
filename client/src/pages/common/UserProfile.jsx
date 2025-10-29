import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
      FaCalendarAlt,
      FaMapMarkerAlt,
      FaChair,
      FaArrowRight,
      FaQuoteLeft
} from "react-icons/fa";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { getArtistProfile } from "../../services/userService";
import { getPostsByAuthor } from "../../services/postService";
import { getEventsByPerformer } from "../../services/eventService";

const UserProfile = () => {
      const { id } = useParams();
      console.log("id", id);
      const [artist, setArtist] = useState(null);
      const [posts, setPosts] = useState([]);
      const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [activeTab, setActiveTab] = useState("poetry"); // Add this line

      useEffect(() => {
            const fetchArtistData = async () => {
                  try {
                        const [userData, postsData, eventsData] = await Promise.all([
                              getArtistProfile(id), // Changed from getUserProfile to getArtistProfile
                              getPostsByAuthor(id),
                              getEventsByPerformer(id),
                        ]);
                        setArtist(userData);
                        setPosts(postsData.posts);
                        setEvents(eventsData.events);
                        setLoading(false);
                        console.log("userData", userData);
                        console.log("postsData", postsData);
                        console.log("eventsData", eventsData);
                  } catch (err) {
                        setError(err.message || "Failed to fetch artist data");
                        setLoading(false);
                  }
            };
            fetchArtistData();
      }, [id]);

      if (loading) {
            return <div className="text-center py-10">Loading profile...</div>;
      }

      if (error || !artist) {
            return (
                  <section className="artist-profile-section">
                        <div className="text-center text-lg text-red-600 mt-20">
                              {error || "Artist not found."}
                        </div>
                  </section>
            );
      }

      return (
            <section className="artist-profile-section">
                  <div className="artist-profile-header mb-10 px-4 md:px-12">
                        <h2 className="artist-profile-title">Artist Profile</h2>
                        <div className="artist-profile-title-underline artist-profile-title-underline-animated"></div>
                        <div className="artist-profile-subheading">
                              Discover the journey and works of this talented artist
                        </div>
                  </div>
                  <div className="events-tile-header-divider"></div>
                  {/* Wide Profile Card */}
                  <div className="artist-profile-maincard group relative overflow-hidden flex flex-col md:flex-row p-0 border border-[#e0e7ff] rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto mb-14">
                        <div className="artist-accent-bar"></div>
                        {/* Photo Section - Left Side */}
                        <div className="artist-profile-photo-section w-full md:w-1/3 relative overflow-hidden">
                              <img
                                    src={artist.photo}
                                    alt={artist.name}
                                    className="artist-profile-photo w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                        </div>
                        {/* Details Section - Right Side */}
                        <div className="artist-profile-details-section w-full md:w-2/3 p-8 md:p-12">
                              <div className="flex flex-col h-full justify-between">
                                    <div>
                                          <h3 className="artist-profile-name text-3xl font-bold text-indigo-800 mb-4">
                                                {artist.name}
                                          </h3>
                                          <div className="artist-profile-tags flex flex-wrap gap-3 mb-6">
                                                {artist.profileTags.map((tag) => (
                                                      <span
                                                            key={tag}
                                                            className="artist-profile-tag bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-full text-base"
                                                      >
                                                            {tag}
                                                      </span>
                                                ))}
                                          </div>
                                          <p className="artist-profile-bio text-gray-600 mb-6 text-lg leading-relaxed">
                                                {artist.oneLineDesc}
                                          </p>
                                    </div>

                                    <div className="artist-profile-about-block bg-gray-50 border border-gray-200 rounded-xl p-6">
                                          <div className="flex items-start gap-4">
                                                <div className="about-icon bg-indigo-100 rounded-full p-3 flex-shrink-0">
                                                      <svg
                                                            className="w-5 h-5 text-indigo-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                      >
                                                            <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                      </svg>
                                                </div>
                                                <div>
                                                      <h4 className="font-semibold text-lg text-gray-800 mb-2">
                                                            About
                                                      </h4>
                                                      <p className="text-gray-600 text-base leading-relaxed">
                                                            {artist.workDescription}
                                                      </p>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  {/* Poetry Collection */}

                  <div className="max-w-6xl mx-auto px-4 md:px-0">
                        <div className="events-tile-header">
                              <h3 className="poetry-section-title">My Upcoming Events</h3>
                              <div className="poetry-section-title-underline"></div>
                        </div>
                        <div className="events-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
                              {events.map((event) => (
                                    <div
                                          key={event._id}
                                          className="event-tile-item group relative w-full"
                                    >
                                          <div className="event-tile-img-wrap relative">
                                                <img
                                                      src={event.coverImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                                                      alt={event.title}
                                                      className="event-tile-img event-tile-img-taller"
                                                />
                                                <div className="event-tile-img-fade-short"></div>
                                                <div className="event-tile-date-badge">
                                                      <FaCalendarAlt className="mr-1" /> {format(new Date(event.dateTime), 'dd MMM yyyy, h:mm a')}
                                                </div>
                                                <div className="event-tile-img-title">{event.name}</div>
                                          </div>
                                          <div className="event-tile-content event-tile-content-gradient rounded-b-[16px] px-7 pt-4 pb-6 flex flex-col gap-3 relative border border-[#e0e7ff]">
                                                <p className="event-tile-desc mb-2">{event.description}</p>
                                                <div className="event-tile-meta flex items-center gap-6 text-xs text-gray-500 mt-1 mb-2">
                                                      <span className="flex items-center gap-1">
                                                            <FaMapMarkerAlt /> {event.venue}
                                                      </span>
                                                      <span className="flex items-center gap-1">
                                                            <FaChair /> {event.bookedSeats} / {event.totalSeats} seats
                                                      </span>
                                                </div>
                                                <div className="event-tile-progress-wrap mt-2 mb-3">
                                                      <div className="event-tile-progress-bg">
                                                            <div
                                                                  className="event-tile-progress-fill"
                                                                  style={{ width: `${(event.bookedSeats / event.totalSeats) * 100}%` }}
                                                            ></div>
                                                      </div>
                                                      <span className="event-tile-progress-label">
                                                            {Math.round((event.bookedSeats / event.totalSeats) * 100)}% booked
                                                      </span>
                                                </div>
                                                <Link
                                                      to={`/events/${event._id}`}
                                                      className="event-tile-details-btn-wrap mt-2"
                                                >
                                                      <button className="event-tile-details-btn w-full flex items-center justify-center gap-2">
                                                            More Details <FaArrowRight />
                                                      </button>
                                                </Link>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>


                  {/* 

POETRY

      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <div className="events-tile-header">
          <h3 className="poetry-section-title">My Upcoming Events</h3>
          <div className="poetry-section-title-underline"></div>
        </div>
        <div className="events-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="featured-poem-card-pro group flex flex-col justify-between relative"
            >
              <span className="featured-poem-quote-icon-pro">
                <FaQuoteLeft />
              </span>
              <div className="featured-poem-phrase-pro mb-8">
                {event.content}
                <span className="featured-poem-underline-pro"></span>
              </div>
              <div className="featured-poem-divider-pro"></div>
              <div className="featured-poem-author-row-pro flex items-center gap-3 mt-auto pt-4">
                <img
                  className="featured-poem-author-img-pro"
                  src={event.photo}
                  alt={event.name}
                />
                <div className="flex flex-col">
                  <span className="featured-poem-author-name-pro">
                    {event.name}
                  </span>
                  <span className="featured-poem-author-role-pro">
                    {event.profileTags?.join(" & ") || "Event"}
                  </span>
                </div>
                <span className="featured-poem-date-pro ml-auto text-xs text-gray-400 font-semibold">
                  {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      */}
                  {
  /* Display Sample Poetry if available */}
                  {artist.isSampleAdded && artist.sample && (
                        <div className="max-w-6xl mx-auto mt-10 px-4 md:px-0">
                              <h3 className="poetry-section-title">Featured Sample</h3>
                              <div className="poetry-section-title-underline"></div>
                              <div className="poetry-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
                                    <div className="featured-poem-card-pro group flex flex-col justify-between relative">
                                          <span className="featured-poem-quote-icon-pro">
                                                <FaQuoteLeft />
                                          </span>
                                          <div className="featured-poem-phrase-pro mb-8">
                                                {artist.sample}
                                                <span className="featured-poem-underline-pro"></span>
                                          </div>
                                          <div className="featured-poem-divider-pro"></div>
                                          <div className="featured-poem-author-row-pro flex items-center gap-3 mt-auto pt-4">
                                                <img
                                                      className="featured-poem-author-img-pro"
                                                      src={artist.photo}
                                                      alt={artist.name}
                                                />
                                                <div className="flex flex-col">
                                                      <span className="featured-poem-author-name-pro">
                                                            {artist.name}
                                                      </span>
                                                      <span className="featured-poem-author-role-pro">
                                                            {artist.profileTags?.join(" & ") || "Poet"}
                                                      </span>
                                                </div>
                                                <span className="featured-poem-date-pro ml-auto text-xs text-gray-400 font-semibold">
                                                      Sample Work
                                                </span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  )}

                  {/* Display Regular Poetry Collection */}
                  {posts.count > 0 ? (
                        <div className="max-w-6xl mx-auto mt-10 px-4 md:px-0">
                              <h3 className="poetry-section-title">Poetry Collection</h3>
                              <div className="poetry-section-title-underline"></div>
                              <div className="poetry-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
                                    {posts.map((post) => (
                                          <div
                                                key={post._id}
                                                className="featured-poem-card-pro group flex flex-col justify-between relative"
                                          >
                                                <span className="featured-poem-quote-icon-pro">
                                                      <FaQuoteLeft />
                                                </span>
                                                <div className="featured-poem-phrase-pro mb-8">
                                                      {post.content}
                                                      <span className="featured-poem-underline-pro"></span>
                                                </div>
                                                <div className="featured-poem-divider-pro"></div>
                                                <div className="featured-poem-author-row-pro flex items-center gap-3 mt-auto pt-4">
                                                      <img
                                                            className="featured-poem-author-img-pro"
                                                            src={artist.photo}
                                                            alt={artist.name}
                                                      />
                                                      <div className="flex flex-col">
                                                            <span className="featured-poem-author-name-pro">
                                                                  {artist.name}
                                                            </span>
                                                            <span className="featured-poem-author-role-pro">
                                                                  {artist.profileTags?.join(" & ") || "Poet"}
                                                            </span>
                                                      </div>
                                                      <span className="featured-poem-date-pro ml-auto text-xs text-gray-400 font-semibold">
                                                            {new Date(post.createdAt).toLocaleDateString()}
                                                      </span>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  ) : null}
                  {/* Add these styles to your existing style tag */}
                  <style jsx>{`
        .artist-profile-section {
          background: #f8fafc;
          padding-top: 4.5rem;
          padding-bottom: 4.5rem;
          font-family: "Inter", "Segoe UI", sans-serif;
        }
        .artist-profile-header {
          margin: 0 auto 2.5rem auto;
          text-align: left;
        }
        .artist-profile-title {
          font-size: 2.3rem;
          font-weight: 800;
          color: #232046;
          letter-spacing: -0.01em;
        }
        .artist-profile-title-underline {
          width: 120px;
          height: 4px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1.2rem;
          margin-top: 0.1rem;
          box-shadow: 0 2px 12px #6366f144;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
        }
        .artist-profile-title-underline-animated {
          transform: scaleX(0);
          transform-origin: left;
          animation: artistProfileUnderlineGrow 1.1s
            cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        }
        @keyframes artistProfileUnderlineGrow {
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
        .artist-profile-subheading {
          color: #6366f1;
          font-size: 1.13rem;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 1.2rem;
          max-width: 540px;
          letter-spacing: 0.01em;
        }
        .events-tile-header-divider {
          max-width: 1600px;
          margin: 0 auto 2.5rem auto;
          height: 1.5px;
          background: linear-gradient(
            90deg,
            #e0e7ff 0%,
            #6366f1 50%,
            #e0e7ff 100%
          );
          opacity: 0.18;
          border-radius: 1px;
        }
        .artist-profile-maincard {
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
          min-height: 450px;
          overflow: hidden;
        }
        .artist-profile-maincard:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }
        @media (min-width: 768px) {
          .artist-profile-maincard {
            flex-direction: row;
            min-height: 400px;
          }
        }
        .artist-profile-photo-section {
          position: relative;
          overflow: hidden;
        }
        .artist-profile-details-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .artist-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
          z-index: 2;
        }
        .artist-profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .artist-profile-name {
          color: #1e3a8a;
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }
        .artist-profile-bio {
          font-size: 1.125rem;
          color: #374151;
          font-weight: 400;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }
        .artist-profile-tags {
          margin-bottom: 0.5rem;
        }
        .artist-profile-tag {
          background: #e0e7ff;
          color: #4338ca;
          font-weight: 500;
          border-radius: 1rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .artist-profile-tag:hover {
          background: #c7d2fe;
        }
        .artist-profile-about-block {
          background: #f9fafb;
          color: #374151;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 400;
          margin-top: 0.5rem;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }
        .artist-profile-about-block:hover {
          background: #f3f4f6;
        }
        .about-icon {
          background: #e0e7ff;
          border-radius: 50%;
          padding: 0.5rem;
          flex-shrink: 0;
        }
        .poetry-section-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #232046;
          margin-bottom: 0.5rem;
        }
        .poetry-section-title-underline {
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px #6366f144;
        }
        .poetry-grid {
          margin-top: 2rem;
        }
        /* --- Home page poem card styles --- */
        .featured-poem-card-pro {
          background: linear-gradient(120deg, #fff 80%, #f1f5ff 100%);
          border-radius: 16px;
          border: 1.5px solid #e0e7ff;
          box-shadow: none;
          padding: 2.3rem 1.7rem 1.7rem 1.7rem;
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: box-shadow 0.18s, border 0.18s,
            transform 0.33s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: visible;
        }
        .featured-poem-card-pro:hover,
        .featured-poem-card-pro:focus-within {
          box-shadow: 0 8px 32px #6366f144;
          border-color: #6366f1;
          transform: translateY(-4px) scale(1.02);
        }
        .featured-poem-quote-icon-pro {
          color: #6366f1;
          font-size: 1.3rem;
          position: absolute;
          top: 1.3rem;
          left: 1.3rem;
          z-index: 2;
        }
        .featured-poem-phrase-pro {
          font-size: 1.22rem;
          font-family: "Inter", "Segoe UI", sans-serif;
          color: #232046;
          line-height: 1.7;
          font-weight: 500;
          letter-spacing: 0.01em;
          margin-top: 2.2rem;
          margin-bottom: 2.2rem;
          text-align: left;
          position: relative;
        }
        .featured-poem-underline-pro {
          display: block;
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-top: 0.7em;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .featured-poem-card-pro:hover .featured-poem-underline-pro,
        .featured-poem-card-pro:focus-within .featured-poem-underline-pro {
          width: 60%;
        }
        .featured-poem-divider-pro {
          width: 100%;
          height: 1px;
          background: #e0e7ff;
          border-radius: 1px;
          margin: 1.2rem 0 1.1rem 0;
        }
        .featured-poem-author-row-pro {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          margin-top: 0.7rem;
        }
        .featured-poem-author-img-pro {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid #e0e7ff;
          box-shadow: 0 2px 8px #6366f111;
        }
        .featured-poem-author-name-pro {
          font-size: 1.08rem;
          font-weight: 700;
          color: #232046;
          letter-spacing: -0.01em;
          margin-bottom: 0.1rem;
          text-align: left;
          transition: color 0.18s;
        }
        .featured-poem-card-pro:hover .featured-poem-author-name-pro,
        .featured-poem-card-pro:focus-within .featured-poem-author-name-pro {
          color: #6366f1;
        }
        .featured-poem-author-role-pro {
          font-size: 0.93rem;
          color: #6b7280;
          font-weight: 500;
          margin-top: 0.1rem;
          letter-spacing: 0.09em;
          text-align: left;
        }
        .featured-poem-date-pro {
          font-size: 0.85rem;
          color: #a1a1aa;
          font-weight: 600;
          margin-left: auto;
        }

        // EVENTS

        .event-tile-item {
  width: 100%;
  max-width: 100%;
  position: relative;
  border-radius: 16px;
  background: transparent;
  box-shadow: none;
  border: 1.5px solid #e0e7ff;
  transition: box-shadow 0.22s, border-color 0.18s;
  overflow: hidden;
  box-sizing: border-box;
}
.event-tile-item:hover, .event-tile-item:focus-within {
  box-shadow: 0 8px 32px #6366f144, 0 1.5px 0 #e0e7ff inset;
  border-color: #6366f1;
}
.event-tile-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  min-height: 220px;
  max-height: 280px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  background: #e0e7ff;
  z-index: 1;
}
.event-tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  transition: none;
}
.event-tile-img-taller {
  min-height: 300px;
  max-height: 340px;
}
.event-tile-img-fade-short {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 45%;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(30,27,75,0.7) 100%);
  z-index: 3;
  pointer-events: none;
}
.event-tile-img-title {
  position: absolute;
  left: 1.3rem;
  bottom: 1.1rem;
  z-index: 4;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
  text-shadow: 0 2px 12px #23204699, 0 1.5px 0 #23204644;
  letter-spacing: -0.01em;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
}
.event-tile-date-badge {
        display: flex; 
        align-items:center;
        gap: 10px;
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: rgba(255,255,255,0.82);
        color: #3730a3;
        font-size: 0.98rem;
        font-weight: 600;
        padding: 0.28rem 1rem;
        border-radius: 0.9rem;
        box-shadow: 0 2px 8px #6366f122;
        z-index: 2;
         pointer-events: none;
         border: 1.2px solid #e0e7ff;
}
.event-tile-content-gradient {
  background: linear-gradient(120deg, #fff 80%, #f1f5ff 100%);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  box-shadow: none;
  padding-bottom: 1.5rem;
  position: relative;
}
.event-tile-desc {
  font-size: 1.01rem;
  color: #6366f1;
  font-weight: 400;
  margin-bottom: 0.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}
.event-tile-meta {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  color: #6366f1;
  gap: 1.8rem;
}
.event-tile-meta i {
  color: #a5b4fc;
  font-size: 1.1em;
}
.event-tile-progress-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.2rem;
}
.event-tile-progress-bg {
  width: 60%;
  height: 6px;
  background: #e0e7ff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1.5px 6px #23204611;
}
.event-tile-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  border-radius: 6px;
  transition: width 0.7s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 1.5px 6px #6366f144;
}
.event-tile-progress-label {
  font-size: 0.97rem;
  color: #6366f1;
  font-weight: 600;
  min-width: 60px;
}
.event-tile-details-btn-wrap {
  width: 100%;
  margin-top: 0.5rem;
}
.event-tile-details-btn {
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  color: #fff;
  font-weight: 700;
  border-radius: 1.5rem;
  padding: 0.95rem 0;
  font-size: 1.08rem;
  border: none;
  outline: none;
  box-shadow: 0 2px 8px #23204611;
  transition: background 0.18s, color 0.18s, transform 0.13s, box-shadow 0.18s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.event-tile-details-btn i {
  font-size: 1.1em;
  margin-left: 0.2em;
  transition: transform 0.18s;
}
.event-tile-details-btn:hover, .event-tile-details-btn:focus {
  color: #e0e7ff;
  box-shadow: 0 4px 16px #6366f133;
}
.event-tile-details-btn:hover i {
  transform: translateX(4px);
}


        @media (max-width: 900px) {
          .featured-poem-card-pro {
            padding: 1.1rem 0.7rem 1.1rem 0.7rem;
            min-height: 120px;
            border-radius: 10px;
          }
          .featured-poem-quote-icon-pro {
            font-size: 1rem;
            top: 0.7rem;
            left: 0.7rem;
          }
          .featured-poem-phrase-pro {
            font-size: 1.01rem;
            margin-top: 1.2rem;
            margin-bottom: 1.2rem;
          }
          .featured-poem-author-img-pro {
            width: 28px;
            height: 28px;
          }
          .featured-poem-author-name-pro {
            font-size: 0.98rem;
          }
          .featured-poem-author-role-pro {
            font-size: 0.82rem;
          }
          .featured-poem-divider-pro {
            margin: 0.7rem 0 0.7rem 0;
          }
        }
      `}</style>
            </section>
      );
};

export default UserProfile;
