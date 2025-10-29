import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
      FaUser,
      FaCalendarAlt,
      FaTicketAlt,
      FaStar,
      FaMapMarkerAlt,
      FaChair,
      FaArrowRight,
} from "react-icons/fa";
import { FaQuoteLeft } from "react-icons/fa";
import { format } from "date-fns";
import { getAllEvents } from "../../services/eventService";
import { getAllPosts } from "../../services/postService";
// FontAwesome icons (using CDN, so just use <i> tags as in Vue)

const letterPool = [
      "અ",
      "ક",
      "ગ",
      "પ",
      "દ", // Gujarati
      "क",
      "न",
      "अ",
      "र", // Hindi
      "A",
      "B",
      "C",
      "R", // English
      "ش",
      "م",
      "ل", // Urdu/Arabic
      "诗",
      "字", // Chinese
      "Σ",
      "Ω", // Greek
      "א", // Hebrew
      "क", // Devanagari
      "م", // Arabic
      "Ж", // Cyrillic
      "क", // Hindi
      "Λ", // Greek
      "Z", // English
      "ی", // Persian
      "क", // Hindi
      "Δ", // Greek
      "Ж", // Cyrillic
      "ش", // Arabic
      "Ω", // Greek
      "字", // Chinese
      "R", // English
      "λ", // Greek
      "م", // Arabic
      "诗", // Chinese
      "B", // English
      "α", // Greek
      "א", // Hebrew
      "ن", // Arabic
      "Γ", // Greek
      "A", // English
      "ل", // Arabic
      "Σ", // Greek
      "Z", // English
      "Λ", // Greek
      "α", // Greek
      "λ", // Greek
      "Δ", // Greek
];

function getRandomLetters(pool, count) {
      const arr = [...pool];
      for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, count).map((char) => ({ char }));
}

const howItWorksSteps = [
      {
            icon: <FaUser size={28} color="#6366f1" />,
            title: "Register",
            desc: "Create your free account to join the community.",
      },
      {
            icon: <FaCalendarAlt size={28} color="#6366f1" />,
            title: "Browse Events",
            desc: "Explore upcoming poetry events and gatherings.",
      },
      {
            icon: <FaTicketAlt size={28} color="#6366f1" />,
            title: "Buy Ticket",
            desc: "Secure your spot and get event details instantly.",
      },
      {
            icon: <FaStar size={28} color="#6366f1" />,
            title: "Attend the Show",
            desc: "Enjoy live poetry and connect with fellow enthusiasts.",
      },
];

const AppHome = () => {
      const [events, setEvents] = useState([]);
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [expandedPosts, setExpandedPosts] = useState({});
      const POST_PREVIEW_CHAR_LIMIT = 250;

      useEffect(() => {
            const fetchEvents = async () => {
                  try {
                        const data = await getAllEvents();
                        // Sort events by date and get the 3 most recent upcoming events
                        const upcomingEvents = data
                              .filter((event) => new Date(event.dateTime) > new Date())
                              .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
                              .slice(0, 3);
                        setEvents(upcomingEvents);
                        setLoading(false);
                  } catch (err) {
                        setError(err.message || "Failed to fetch events");
                        setLoading(false);
                  }
            };
            fetchEvents();
      }, []);

      useEffect(() => {
            const fetchPosts = async () => {
                  try {
                        const data = await getAllPosts();
                        console.log("post data :", data);

                        const postData = data.posts;
                        console.log("this is data.posts :", postData);

                        const featuredPost = postData
                              .sort(() => 0.5 - Math.random()) // shuffle array
                              .slice(0, 3);
                        setPosts(featuredPost);
                        console.log("featuredPost :", featuredPost);
                        console.log("final Posts :", posts);
                        setLoading(false);
                  } catch (err) {
                        setError(err.message || "Failed to fetch posts");
                        setLoading(false);
                  }
            };
            fetchPosts();
      }, []);

      // Memoize so the letters don't change on every render
      const floatingLetters = useMemo(() => getRandomLetters(letterPool, 24), []);

      return (
            <>
                  {/* HERO SECTION */}
                  <section className="hero-bg relative overflow-hidden flex items-center min-h-screen">
                        {/* Background Image (right, high quality, gradient mask) */}
                        <div className="hero-bg-img"></div>
                        <div className="hero-bg-gradient"></div>
                        {/* Boiling Letters Animation */}
                        <div className="boiling-letters">
                              {floatingLetters.map((letter, i) => (
                                    <span key={i} className={`boil-letter bl-${i}`}>
                                          {letter.char}
                                    </span>
                              ))}
                        </div>
                        <div className="container mx-auto flex flex-col items-start justify-center gap-10 py-28 px-6 md:px-16 relative z-10">
                              {/* Hero Text */}
                              <div className="max-w-2xl">
                                    <h1 className="hero-headline">
                                          Where Poetry Comes Alive in Rajkot
                                          <span className="hero-underline"></span>
                                    </h1>
                                    <p className="hero-subtext">
                                          Discover exceptional poetry events, connect with talented poets,
                                          and immerse yourself in the beauty of words. The vocie of rajkot
                                          platform brings poetry enthusiasts together.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
                                          <Link to="/events">
                                                <button className="hero-btn-3d">Explore Events</button>
                                          </Link>
                                          <Link to="/artists">
                                                <button className="hero-btn-3d hero-btn-outline-3d">
                                                      Meet Our Poets
                                                </button>
                                          </Link>
                                    </div>
                              </div>
                        </div>
                        {/* Wavy SVG Bottom */}
                        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
                              <svg
                                    viewBox="0 0 1440 120"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full h-28 md:h-32"
                              >
                                    <path
                                          d="M0,60 C360,140 1080,0 1440,80 L1440,120 L0,120 Z"
                                          fill="url(#fade)"
                                    />
                                    <defs>
                                          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#fff" stopOpacity="1" />
                                          </linearGradient>
                                    </defs>
                              </svg>
                        </div>
                  </section>

                  {/* UPCOMING EVENTS SECTION */}
                  <section className="events-tile-section">
                        <div className="events-tile-header flex flex-col md:flex-row md:items-center md:justify-between mb-8 px-4 md:px-12 gap-4 md:gap-0">
                              <div className="flex flex-col items-start">
                                    <h2 className="events-tile-title events-tile-title-enhanced">
                                          Upcoming Events
                                    </h2>
                                    <div className="events-tile-title-underline"></div>
                                    <div className="events-tile-subheading">
                                          Don't miss the next poetry gatherings in Rajkot. Reserve your seat
                                          now!
                                    </div>
                              </div>
                              <Link to="/events">
                                    <button className="events-tile-explore-btn events-tile-explore-btn-enhanced">
                                          Explore All Events <i className="fa fa-arrow-right ml-2"></i>
                                    </button>
                              </Link>
                        </div>
                        <div className="events-tile-header-divider"></div>
                        <div className="events-tile-carousel-wrap relative">
                              <div className="events-tile-carousel grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl px-4 md:px-0">
                                    {events.map((event) => (
                                          <div
                                                key={event._id}
                                                className="event-tile-item group relative w-full"
                                          >
                                                <div className="event-tile-img-wrap relative">
                                                      <img
                                                            src={
                                                                  event.coverImage ||
                                                                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                                                            }
                                                            alt={event.name}
                                                            className="event-tile-img event-tile-img-taller"
                                                      />
                                                      <div className="event-tile-img-fade-short"></div>
                                                      <div className="event-tile-date-badge">
                                                            <FaCalendarAlt className="mr-1" />{" "}
                                                            {format(new Date(event.dateTime), "dd MMM yyyy, h:mm a")}
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
                                                                        style={{
                                                                              width: `${Math.round(
                                                                                    (event.bookedSeats / event.totalSeats) * 100
                                                                              )}%`,
                                                                        }}
                                                                  ></div>
                                                            </div>
                                                            <span className="event-tile-progress-label">
                                                                  {Math.round((event.bookedSeats / event.totalSeats) * 100)}
                                                                  % booked
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
                  </section>

                  {/* HOW IT WORKS SECTION */}
                  <section className="howitworks-section-gradient relative py-32 px-4 md:px-0 overflow-hidden">
                        <div className="container mx-auto max-w-6xl relative z-10">
                              <div className="howitworks-header flex flex-col justify-start text-left mb-20">
                                    <h2 className="howitworks-title-pro text-4xl md:text-5xl mb-6">
                                          How It Works
                                    </h2>
                                    <div className="howitworks-title-underline-pro howitworks-title-underline-animated"></div>
                                    <p className="howitworks-subtitle-pro text-gray-600 max-w-2xl mt-6">
                                          Discover the seamless journey from inspiration to performance
                                    </p>
                              </div>

                              <div className="howitworks-steps flex flex-col md:flex-row gap-6 flex-wrap justify-center">
                                    {howItWorksSteps.map((step, idx) => (
                                          <div
                                                key={idx}
                                                className="step-card group w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
                                          >
                                                <div className={`step-number w-20 h-20 flex items-center justify-center rotate-12 bg-indigo-50 rounded-full z-2 left-1/2`}>
                                                      <span className="text-4xl font-bold text-indigo-200 -rotate-12">
                                                            {idx + 1}
                                                      </span>
                                                </div>

                                                <div className="step-icon-container relative mb-8 mx-auto">
                                                      <div className="step-icon-bg w-16 h-16 flex items-center justify-center bg-indigo-50 rounded-2xl relative z-10 group-hover:bg-indigo-100 transition-all duration-300">
                                                            {step.icon}
                                                      </div>
                                                      <div className="step-icon-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-500 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-300"></div>
                                                </div>

                                                <div className="step-content relative z-10">
                                                      <h3 className="step-title text-2xl font-bold mb-4 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 text-center">
                                                            {step.title}
                                                      </h3>
                                                      <p className="step-description text-gray-600 leading-relaxed text-center">
                                                            {step.desc}
                                                      </p>
                                                </div>

                                                <div className="decorative-line absolute bottom-0 left-0 rounded-b-2xl w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                          </div>
                                    ))}
                              </div>
                        </div>

                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                              <div className="absolute top-20 left-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                              <div className="absolute top-40 right-0 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                              <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                        </div>
                  </section>

                  {/* FEATURED POSTS SECTION */}
                  <section className="featured-posts-section-pro py-24 px-4 md:px-0">
                        <div className="container mx-auto max-w-6xl">
                              <div className="featured-posts-header-pro flex flex-col items-start mb-14">
                                    <h2 className="featured-posts-title-pro">Featured Posts</h2>
                                    <div className="featured-posts-title-underline-pro"></div>
                                    <div className="featured-posts-subheading-pro">
                                          Discover the latest poems and phrases from our talented poets and
                                          writers.
                                    </div>
                              </div>
                              <div className="featured-posts-grid-pro columns-1 md:columns-2 lg:columns-3 gap-10">
                                    {posts.map((post) => (
                                          <div
                                                key={post._id}
                                                className="featured-poem-card-pro group flex flex-col justify-between relative mb-10 inline-block w-full"
                                                style={{ breakInside: 'avoid-column' }}
                                          >
                                                <span className="featured-poem-quote-icon-pro">
                                                      <FaQuoteLeft />
                                                </span>
                                                <div className="featured-poem-phrase-pro mb-8">
                                                      <p className="featured-poem-phrase-text-pro text-base whitespace-pre-wrap break-words">
                                                            {expandedPosts[post._id] ? post.content :
                                                                  (post.content?.length > POST_PREVIEW_CHAR_LIMIT ?
                                                                        `${post.content.slice(0, POST_PREVIEW_CHAR_LIMIT)}...` :
                                                                        post.content)
                                                            }
                                                      </p>
                                                      {post.content?.length > POST_PREVIEW_CHAR_LIMIT && (
                                                            <button
                                                                  onClick={() => setExpandedPosts(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                                                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
                                                            >
                                                                  {expandedPosts[post._id] ? 'Show less' : 'Show more'}
                                                            </button>
                                                      )}
                                                      <span className="featured-poem-underline-pro"></span>
                                                </div>
                                                <div className="featured-poem-divider-pro"></div>
                                                <div className="featured-poem-author-row-pro flex items-center gap-3 mt-auto pt-4">
                                                      <img
                                                            className="featured-poem-author-img-pro"
                                                            src={`https://randomuser.me/api/portraits/men/${post._id}.jpg`}
                                                            alt="Poet"
                                                      />
                                                      <div className="flex flex-col">
                                                            {/* <span className="featured-poem-author-name-pro">
                      Poet Name {post.author.name}
                    </span> */}
                                                            <span className="featured-poem-author-role-pro">
                                                                  Poet & Writer
                                                            </span>
                                                      </div>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  <style>{`
        .hero-bg {
  background: linear-gradient(120deg, #6366f1 0%, #818cf8 100%);
  position: relative;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  align-items: center;
}

.hero-bg-img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0%;
  background: url('/images/home-hero-bg-img.jpg') center right/cover no-repeat;
  filter: brightness(0.8) saturate(1.1);
  opacity: 0.85;
  z-index: 1;
}

.hero-bg-gradient {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(90deg, #232046ee 0%, #6366f1cc 60%, #ffffff00 100%);
  pointer-events: none;
}

.boiling-letters {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.boil-letter {
  position: absolute;
  font-size: 2.7rem;
  font-weight: 700;
  opacity: 0.22;
  color: #fff;
  user-select: none;
  filter: blur(0.5px) drop-shadow(0 0 8px #818cf8cc);
  animation: boilBubble 6s linear infinite;
}

.bl-0 {
  left: 10%;
  bottom: 7%;
  animation-delay: 0s;
  transform: scale(1.1);
}

.bl-1 {
  left: 22%;
  bottom: 10%;
  animation-delay: 1.1s;
  transform: scale(0.9);
}

.bl-2 {
  left: 35%;
  bottom: 6%;
  animation-delay: 2.2s;
  transform: scale(1.2);
}

.bl-3 {
  left: 48%;
  bottom: 8%;
  animation-delay: 0.7s;
  transform: scale(1.05);
}

.bl-4 {
  left: 60%;
  bottom: 12%;
  animation-delay: 1.7s;
  transform: scale(0.95);
}

.bl-5 {
  left: 72%;
  bottom: 9%;
  animation-delay: 2.8s;
  transform: scale(1.15);
}

.bl-6 {
  left: 85%;
  bottom: 5%;
  animation-delay: 0.9s;
  transform: scale(1.05);
}

.bl-7 {
  left: 15%;
  bottom: 13%;
  animation-delay: 2.4s;
  transform: scale(1.08);
}

.bl-8 {
  left: 55%;
  bottom: 11%;
  animation-delay: 0.6s;
  transform: scale(1.12);
}

.bl-9 {
  left: 80%;
  bottom: 7%;
  animation-delay: 3.5s;
  transform: scale(0.92);
}

.bl-10 {
  left: 65%;
  bottom: 8%;
  animation-delay: 1.9s;
  transform: scale(1.18);
}

.bl-11 {
  left: 25%;
  bottom: 12%;
  animation-delay: 2.7s;
  transform: scale(1.04);
}

.bl-12 {
  left: 75%;
  bottom: 6%;
  animation-delay: 0.3s;
  transform: scale(1.09);
}

.bl-13 {
  left: 40%;
  bottom: 10%;
  animation-delay: 1.5s;
  transform: scale(1.13);
}

.bl-14 {
  left: 58%;
  bottom: 7%;
  animation-delay: 2.2s;
  transform: scale(0.97);
}

.bl-15 {
  left: 90%;
  bottom: 8%;
  animation-delay: 0.8s;
  transform: scale(1.07);
}

@keyframes boilBubble {
  0% {
    opacity: 0.18;
    transform: translateY(0) scale(1) rotate(0deg);
  }

  10% {
    opacity: 0.28;
  }

  60% {
    opacity: 0.22;
  }

  80% {
    opacity: 0.28;
  }

  90% {
    opacity: 0.18;
  }

  100% {
    opacity: 0;
    transform: translateY(-180px) scale(1.25) rotate(8deg);
  }
}

.container {
  position: relative;
  z-index: 4;
}

.hero-headline {
  font-size: 2.8rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.13;
  letter-spacing: -0.01em;
  margin-bottom: 1.2rem;
  position: relative;
  display: inline-block;
  text-shadow: 0 4px 32px #23204633, 0 1.5px 0 #6366f1;
}

@media (min-width: 900px) {
  .hero-headline {
    font-size: 3.7rem;
  }
}

.hero-underline {
  display: block;
  width: 60%;
  height: 5px;
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  border-radius: 2px;
  margin-top: 0.7rem;
  animation: underlineGrow 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes underlineGrow {
  0% {
    width: 0;
    opacity: 0;
  }

  100% {
    width: 60%;
    opacity: 1;
  }
}

.hero-subtext {
  font-size: 1.25rem;
  color: #e0e7ff;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.7;
  max-width: 38rem;
}

.hero-btn-3d {
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  color: #fff;
  font-weight: 800;
  border-radius: 0.9rem;
  padding: 1.2rem 2.5rem;
  font-size: 1.18rem;
  box-shadow: 0 6px 24px #6366f144, 0 2px 8px #23204622;
  border: none;
  letter-spacing: 0.01em;
  outline: none;
  transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
  transform: translateY(0);
}

.hero-btn-3d:hover,
.hero-btn-3d:focus {
  background: linear-gradient(90deg, #818cf8 60%, #6366f1 100%);
  box-shadow: 0 12px 32px #6366f155, 0 4px 16px #23204633;
  transform: translateY(-3px) scale(1.04);
}

.hero-btn-outline-3d {
  background: #fff;
  color: #6366f1;
  border: 2.5px solid #6366f1;
  box-shadow: 0 2px 8px #6366f122;
}

.hero-btn-outline-3d:hover,
.hero-btn-outline-3d:focus {
  background: #f1f5ff;
  color: #3730a3;
  border-color: #3730a3;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #3730a3;
  margin-bottom: 2.5rem;
  text-align: center;
  letter-spacing: -0.01em;
}

.events-tile-section {
  width: 100%;
  position: relative;
  background: #f8fafc;
  padding: 0;
  padding-top: 4.5rem;
  padding-bottom: 4.5rem;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  overflow-x: hidden;
  box-sizing: border-box;
}

.events-tile-header {
  /* max-width: 1600px  ; */
  margin: 0 auto 1.5rem auto;
}

.events-tile-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #232046;
  letter-spacing: -0.01em;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.events-tile-explore-btn {
  background: transparent;
  color: #6366f1;
  font-weight: 600;
  border: 2px solid #6366f1;
  border-radius: 2rem;
  padding: 1rem 2.5rem;
  font-size: 1.13rem;
  transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s;
  outline: none;
  box-shadow: 0 2px 8px #23204611;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.events-tile-explore-btn i {
  font-size: 1.1em;
  margin-left: 0.5em;
  transition: transform 0.18s;
}

.events-tile-explore-btn:hover, .events-tile-explore-btn:focus {
  background: #6366f1;
  color: #fff;
  border-color: #3730a3;
  box-shadow: 0 4px 16px #6366f133;
  transform: translateY(-2px) scale(1.03);
}

.events-tile-explore-btn:hover i {
  transform: translateX(4px);
}

.events-tile-divider {
  max-width: 1600px;
  margin: 0 auto 2.5rem auto;
  height: 1.5px;
  background: linear-gradient(90deg, #e0e7ff 0%, #6366f1 50%, #e0e7ff 100%);
  opacity: 0.18;
  border-radius: 1px;
}

.events-tile-carousel-wrap {
  position: relative;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}



.events-tile-carousel {
  max-width: 100%;
  margin: 0 auto;
  padding:6rem;
  width: 100%;
  box-sizing: border-box;
}

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

.event-tile-accent-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 6px;
  background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
  z-index: 2;
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
  gap: 0.7rem;
  margin-top: 0.2rem;
}

.event-tile-details-btn i {
  font-size: 1.1em;
  margin-left: 0.2em;
  transition: transform 0.18s;
}

.event-tile-details-btn:hover, .event-tile-details-btn:focus {
  /* background: linear-gradient(90deg, #818cf8 60%, #6366f1 100%); */
  color: #e0e7ff;
  /* transform: translateY(-2px) scale(1.03); */
  box-shadow: 0 4px 16px #6366f133;
}

.event-tile-details-btn:hover i {
  transform: translateX(4px);
}

.event-tile-info-btn {
  background: #fff;
  color: #6366f1;
  border: 1.5px solid #e0e7ff;
  border-radius: 50%;
  width: 2.1rem;
  height: 2.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px #6366f122;
  cursor: pointer;
  transition: background 0.16s, color 0.16s, border 0.16s, box-shadow 0.16s, opacity 0.18s;
  position: absolute;
  bottom: 1.1rem;
  right: 1.1rem;
  opacity: 0;
  pointer-events: auto;
}

.event-tile-info-btn:hover, .event-tile-info-btn:focus {
  background: #6366f1;
  color: #fff;
  border-color: #3730a3;
  box-shadow: 0 4px 16px #6366f133;
}

.group:hover .event-tile-info-btn, .group:focus-within .event-tile-info-btn {
  opacity: 1;
}

@media (max-width: 900px) {
  .events-tile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .events-tile-title {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }
  .event-tile-item {
    width: 100%;
    max-width: 100%;
  }
  .events-tile-carousel {
    gap: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

}

@media (max-width: 640px) {
  .events-tile-carousel {
    gap: 0.8rem;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }
  .event-tile-item {
    width: 100%;
    max-width: 100%;
  }
  .event-tile-img-wrap {
    min-height: 180px;
  }
  .event-tile-content-gradient {
    padding: 1rem 1.2rem 1.2rem 1.2rem;
  }
  .event-tile-desc {
    font-size: 0.95rem;
  }
  .event-tile-meta {
    font-size: 0.85rem;
    gap: 1rem;
  }
  .event-tile-details-btn {
    padding: 0.8rem 0;
    font-size: 0.95rem;
  }
}

.featured-posts-section-pro {
  background: #fff;
  padding-top: 6rem;
  padding-bottom: 6rem;
}

.featured-posts-header-pro {
  margin-bottom: 3.5rem;
}

.featured-posts-title-pro {
  font-size: 2.2rem;
  font-weight: 900;
  color: #232046;
  letter-spacing: 0.01em;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  margin-bottom: 0.3rem;
  text-align: left;
}

.featured-posts-title-underline-pro {
  width: 140px;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  border-radius: 2px;
  margin-bottom: 1.2rem;
  margin-top: 0.1rem;
  transform: scaleX(0);
  transform-origin: left;
  animation: featuredPostsUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
}
@keyframes featuredPostsUnderlineGrow {
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

.featured-posts-subheading-pro {
  color: #6b7280;
  font-size: 1.08rem;
  font-weight: 400;
  line-height: 1.7;
  margin-bottom: 1.2rem;
  max-width: 340px;
  text-align: left;
  letter-spacing: 0.01em;
}

.featured-posts-grid-pro {
  margin-top: 2.5rem;
}

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
  transition: box-shadow 0.18s, border 0.18s, transform 0.33s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: visible;
}

.featured-poem-card-pro:hover, .featured-poem-card-pro:focus-within {
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
  font-family: 'Inter', 'Segoe UI', sans-serif;
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
  transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
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

@media (max-width: 900px) {
  .featured-posts-title-pro {
    font-size: 1.3rem;
    margin-bottom: 0.2rem;
  }
  .featured-posts-title-underline-pro {
    width: 36px;
    height: 2px;
    margin-bottom: 0.7rem;
  }
  .featured-posts-subheading-pro {
    font-size: 0.98rem;
    max-width: 95vw;
  }
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

/* How It Works Interactive Cards */
.howitworks-section-gradient {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f1f5ff 100%);
  padding: 6rem 1rem;
  position: relative;
  overflow: hidden;
}

.howitworks-section-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(129, 140, 248, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.howitworks-header {
  text-align: left;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
}

.howitworks-title-pro {
  font-size: 2.3rem;
  font-weight: 900;
  color: #232046;
  letter-spacing: 0.01em;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  margin-bottom: 0.5rem;
  text-align: left;
}
.howitworks-title-underline-pro {
  width: 150px;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  border-radius: 8px;
  margin-bottom: 1.3rem;
  margin-top: 0.1rem;
  box-shadow: 0 2px 12px #6366f144;
  border: 1.5px solid rgba(255,255,255,0.35);
}
.howitworks-title-underline-animated {
  transform: scaleX(0);
  transform-origin: left;
  animation: howitworksHeaderUnderlineSlideIn 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
}
@keyframes howitworksHeaderUnderlineSlideIn {
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
.howitworks-subheading-pro {
  color: #6366f1;
  font-size: 1.13rem;
  font-weight: 400;
  line-height: 1.7;
  margin-bottom: 1.2rem;
  max-width: 340px;
  text-align: left;
  letter-spacing: 0.01em;
}
.howitworks-interactive-grid {
  display: grid;
  gap: 2.5rem;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

@keyframes cardFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.howitworks-step-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px #e0e7ff88;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1.5rem;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
  border: 2px solid transparent;
  position: relative;
  animation: cardFloat 6s ease-in-out infinite;
}

.howitworks-step-card:nth-child(1) { animation-delay: 0s; }
.howitworks-step-card:nth-child(2) { animation-delay: 1s; }
.howitworks-step-card:nth-child(3) { animation-delay: 2s; }
.howitworks-step-card:nth-child(4) { animation-delay: 3s; }

.howitworks-step-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 20px 60px #6366f144;
  border-color: #6366f1;
}

.howitworks-step-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
}

.howitworks-step-card:hover::before {
  opacity: 1;
}
.step-card-inner {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-number {
  position: absolute;
  top: -1.5rem;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: #fff;
  font-size: 1.8rem;
  font-weight: 900;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px #6366f144;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}

.step-card:hover .step-number {
        right: -17%;
}

.howitworks-step-card:hover .step-number {
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 8px 24px #6366f166;
}
.step-icon-container {
  margin-bottom: 1.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5ff 0%, #e0e7ff 100%);
  border-radius: 50%;
  border: 3px solid #6366f1;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: hidden;
}

.step-icon-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
}

.step-icon-wrapper {
  color: #6366f1;
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}

.howitworks-step-card:hover .step-icon-container {
  transform: scale(1.1);
  box-shadow: 0 8px 24px #6366f144;
}

.howitworks-step-card:hover .step-icon-container::before {
  transform: scale(1);
}

.howitworks-step-card:hover .step-icon-wrapper {
  color: #fff;
  animation: iconPulse 0.6s ease-in-out;
}
.step-content {
  margin-bottom: 1.5rem;
}
.step-title {
  font-size: 1.13rem;
  font-weight: 700;
  color: #232046;
  margin-bottom: 0.3rem;
  letter-spacing: -0.01em;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}
.step-description {
  font-size: 1.01rem;
  color: #6366f1;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 0.1rem;
}
.step-arrow {
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px #6366f144;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  opacity: 0.8;
}

.step-arrow svg {
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}

.howitworks-step-card:hover .step-arrow {
  background: linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%);
  box-shadow: 0 6px 20px #6366f166;
  opacity: 1;
  transform: translateX(-50%) scale(1.1);
}

.howitworks-step-card:hover .step-arrow svg {
  transform: translateX(2px);
}

@media (max-width: 900px) {
  .howitworks-section-gradient {
    padding: 3rem 1rem;
  }
  .howitworks-header {
    margin-bottom: 3.5rem;
  }
  .howitworks-title-pro {
    font-size: 2rem;
    text-align: center;
  }
  .howitworks-title-underline-pro {
    width: 120px;
    margin: 0 auto 1.3rem auto;
  }
  .howitworks-subheading-pro {
    font-size: 1.05rem;
    max-width: 100%;
    text-align: center;
  }
  .howitworks-interactive-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 0.8rem;
  }
  .howitworks-step-card {
    padding: 2rem 1.2rem;
  }
  .step-number {
    top: -1rem;
    font-size: 1.5rem;
    width: 3rem;
    height: 3rem;
  }
  .step-icon-container {
    width: 50px;
    height: 50px;
    margin-bottom: 1rem;
  }
  .step-icon-wrapper {
    font-size: 2rem;
  }
  .step-content {
    margin-bottom: 1rem;
  }
  .step-title {
    font-size: 1rem;
    margin-bottom: 0.1rem;
    margin-top: 0;
  }
  .step-description {
    font-size: 0.95rem;
  }
  .step-arrow {
    bottom: -1rem;
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 640px) {
  .howitworks-section-gradient {
    padding: 2.5rem 0.8rem;
  }
  .howitworks-header {
    margin-bottom: 3.5rem;
  }
  .howitworks-title-pro {
    font-size: 1.8rem;
  }
  .howitworks-title-underline-pro {
    width: 100px;
    height: 3px;
  }
  .howitworks-subheading-pro {
    font-size: 1rem;
  }
  .howitworks-interactive-grid {
    gap: 1.2rem;
    padding: 0 0.6rem;
  }
  .howitworks-step-card {
    padding: 1.8rem 1rem;
  }
  .step-number {
    top: -0.8rem;
    font-size: 1.3rem;
    width: 2.5rem;
    height: 2.5rem;
  }
  .step-icon-container {
    width: 45px;
    height: 45px;
    margin-bottom: 0.8rem;
  }
  .step-icon-wrapper {
    font-size: 1.8rem;
  }
  .step-content {
    margin-bottom: 0.8rem;
  }
  .step-title {
    font-size: 0.95rem;
  }
  .step-description {
    font-size: 0.9rem;
  }
  .step-arrow {
    bottom: -0.8rem;
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .howitworks-section-gradient {
    padding: 2rem 0.5rem;
  }
  .howitworks-header {
    margin-bottom: 3.5rem;
  }
  .howitworks-title-pro {
    font-size: 1.6rem;
  }
  .howitworks-title-underline-pro {
    width: 80px;
    height: 2.5px;
  }
  .howitworks-subheading-pro {
    font-size: 0.95rem;
  }
  .howitworks-interactive-grid {
    gap: 1rem;
    padding: 0 0.5rem;
  }
  .howitworks-step-card {
    padding: 1.5rem 0.8rem;
  }
  .step-number {
    top: -0.6rem;
    font-size: 1.1rem;
    width: 2rem;
    height: 2rem;
  }
  .step-icon-container {
    width: 40px;
    height: 40px;
    margin-bottom: 0.6rem;
  }
  .step-icon-wrapper {
    font-size: 1.5rem;
  }
  .step-content {
    margin-bottom: 0.6rem;
  }
  .step-title {
    font-size: 0.9rem;
  }
  .step-description {
    font-size: 0.85rem;
  }
  .step-arrow {
    bottom: -0.6rem;
    width: 28px;
    height: 28px;
  }
}


@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@media (max-width: 900px) {
  .events-tile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .events-tile-title {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }
  .event-tile-item {
    width: 100%;
    max-width: 100%;
  }
  .events-tile-carousel {
    gap: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

}

@media (max-width: 640px) {
  .events-tile-carousel {
    gap: 0.8rem;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }
  .event-tile-item {
    width: 100%;
    max-width: 100%;
  }
  .event-tile-img-wrap {
    min-height: 180px;
  }
  .event-tile-content-gradient {
    padding: 1rem 1.2rem 1.2rem 1.2rem;
  }
  .event-tile-desc {
    font-size: 0.95rem;
  }
  .event-tile-meta {
    font-size: 0.85rem;
    gap: 1rem;
  }
  .event-tile-details-btn {
    padding: 0.8rem 0;
    font-size: 0.95rem;
  }
}

.featured-posts-section-pro {
  background: #fff;
  padding-top: 6rem;
  padding-bottom: 6rem;
}

.featured-posts-header-pro {
  margin-bottom: 3.5rem;
}

.featured-posts-title-pro {
  font-size: 2.2rem;
  font-weight: 900;
  color: #232046;
  letter-spacing: 0.01em;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  margin-bottom: 0.3rem;
  text-align: left;
}

.featured-posts-title-underline-pro {
  width: 140px;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
  border-radius: 2px;
  margin-bottom: 1.2rem;
  margin-top: 0.1rem;
  transform: scaleX(0);
  transform-origin: left;
  animation: featuredPostsUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
}
@keyframes featuredPostsUnderlineGrow {
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

.featured-posts-subheading-pro {
  color: #6b7280;
  font-size: 1.08rem;
  font-weight: 400;
  line-height: 1.7;
  margin-bottom: 1.2rem;
  max-width: 340px;
  text-align: left;
  letter-spacing: 0.01em;
}

.featured-posts-grid-pro {
  margin-top: 2.5rem;
}

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
  transition: box-shadow 0.18s, border 0.18s, transform 0.33s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  overflow: visible;
}

.featured-poem-card-pro:hover, .featured-poem-card-pro:focus-within {
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
  font-family: 'Inter', 'Segoe UI', sans-serif;
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
  transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
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

@media (max-width: 900px) {
  .featured-posts-title-pro {
    font-size: 1.3rem;
    margin-bottom: 0.2rem;
  }
  .featured-posts-title-underline-pro {
    width: 36px;
    height: 2px;
    margin-bottom: 0.7rem;
  }
  .featured-posts-subheading-pro {
    font-size: 0.98rem;
    max-width: 95vw;
  }
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

      `}</style>
            </>
      );
};

export default AppHome;
