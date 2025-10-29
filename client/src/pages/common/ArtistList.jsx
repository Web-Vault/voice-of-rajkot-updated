import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { getAllPerformers } from "../../services/userService";

const ArtistList = () => {
      const [artists, setArtists] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            const fetchArtists = async () => {
                  try {
                        const performers = await getAllPerformers();
                        setArtists(performers);
                        setLoading(false);
                  } catch (err) {
                        setError(err.message || 'Failed to fetch artists');
                        setLoading(false);
                  }
            };
            fetchArtists();
      }, []);

      if (loading) {
            return <div className="text-center py-10">Loading artists...</div>;
      }

      if (error) {
            return <div className="text-center text-red-600 py-10">{error}</div>;
      }

      return (
            <>
                  <section className="artists-list-section">
                        <div className="artists-list-header mb-10 px-4 md:px-12">
                              <h2 className="artists-list-title">Featured Artists</h2>
                              <div className="artists-list-title-underline artists-list-title-underline-animated"></div>
                              <div className="artists-list-subheading">Meet the talented poets and performers of Rajkot. Discover their work and connect with your favorites!</div>
                        </div>
                        <div className="events-tile-header-divider"></div>
                        <div className="artists-list-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4 md:px-0">
                              {artists.map((artist) => (
                                    <div key={artist._id} className="artist-card group relative overflow-hidden flex flex-col items-center p-0 border border-[#e0e7ff] rounded-2xl bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-md hover:shadow-xl transition-all">
                                          <div className="artist-accent-bar"></div>
                                          <div className="flex flex-col items-center w-full pt-8 pb-4 px-7">
                                                <img
                                                      src={artist.profilePhoto || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                                      alt={artist.name}
                                                      className="artist-photo mb-5 rounded-full border-4 border-indigo-100 w-28 h-28 object-cover shadow"
                                                />
                                                <h3 className="artist-name text-xl font-extrabold text-indigo-800 mb-2 text-center">{artist.name}</h3>
                                                <p className="artist-bio text-gray-700 text-center mb-4 px-2">{artist.bio || artist.oneLineDesc}</p>
                                                <div className="artist-tags flex flex-wrap gap-2 justify-center mb-4">
                                                      {artist.profileTags?.map((tag) => (
                                                            <span key={tag} className="artist-tag">{tag}</span>
                                                      ))}
                                                </div>
                                          </div>
                                          <Link to={`/artist/${artist._id}`} className="artist-tile-details-btn-wrap w-full px-7 pb-7">
                                                <button className="artist-tile-details-btn w-full flex items-center justify-center gap-2">
                                                      View Profile <FaArrowRight />
                                                </button>
                                          </Link>
                                    </div>
                              ))}
                        </div>
                  </section>
                  <style>{`
.events-tile-header-divider {
  max-width: 1600px;
  margin: 0 auto 2.5rem auto;
  height: 1.5px;
  background: linear-gradient(90deg, #e0e7ff 0%, #6366f1 50%, #e0e7ff 100%);
  opacity: 0.18;
  border-radius: 1px;
}
.artists-list-section {
  background: #f8fafc;
  padding-top: 4.5rem;
  padding-bottom: 4.5rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}
.artists-list-header {
  margin: 0 auto 2.5rem auto;
  text-align: left;
}
.artists-list-title {
  font-size: 2.3rem;
  font-weight: 800;
  color: #232046;
  letter-spacing: -0.01em;
}
.artists-list-title-underline {
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  border-radius: 2px;
  margin-bottom: 1.2rem;
  margin-top: 0.1rem;
  box-shadow: 0 2px 12px #6366f144;
  border: 1.5px solid rgba(255,255,255,0.35);
}
.artists-list-title-underline-animated {
  transform: scaleX(0);
  transform-origin: left;
  animation: artistsListUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
}
@keyframes artistsListUnderlineGrow {
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
.artists-list-subheading {
  color: #6366f1;
  font-size: 1.13rem;
  font-weight: 400;
  line-height: 1.7;
  margin-bottom: 1.2rem;
  max-width: 540px;
  letter-spacing: 0.01em;
}
.artists-list-grid {
  margin-top: 2.5rem;
}
.artist-card {
  background: linear-gradient(120deg, #fff 80%, #f1f5ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px #6366f111;
  transition: box-shadow 0.18s, transform 0.18s, border 0.18s;
  border: 1.5px solid #e0e7ff;
  min-height: 420px;
  max-width: 370px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.artist-card:hover, .artist-card:focus-within {
  box-shadow: 0 8px 32px #6366f144;
  border-color: #6366f1;
  transform: translateY(-4px) scale(1.02);
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
.artist-photo {
  width: 7rem;
  height: 7rem;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #e0e7ff;
  box-shadow: 0 2px 8px #6366f122;
  background: #f1f5ff;
}
.artist-name {
  color: #232046;
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}
.artist-bio {
  font-size: 1.01rem;
  color: #6366f1;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}
.artist-tags {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.artist-tag {
  background: #eef2ff;
  color: #6366f1;
  font-weight: 600;
  border-radius: 1rem;
  padding: 0.3rem 1.1rem;
  font-size: 0.93rem;
  letter-spacing: 0.01em;
  box-shadow: 0 1px 4px #6366f111;
}
.artist-tile-details-btn-wrap {
  width: 100%;
  margin-top: 0.5rem;
}
.artist-tile-details-btn {
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
.artist-tile-details-btn i {
  font-size: 1.1em;
  margin-left: 0.2em;
  transition: transform 0.18s;
}
.artist-tile-details-btn:hover, .artist-tile-details-btn:focus {
  color: #e0e7ff;
  box-shadow: 0 4px 16px #6366f133;
}
.artist-tile-details-btn:hover i {
  transform: translateX(4px);
}
@media (max-width: 900px) {
  .artists-list-grid {
    grid-template-columns: 1fr;
  }
  .artist-card {
    max-width: 98vw;
  }
}
      `}</style>    </>
      );
};

export default ArtistList;