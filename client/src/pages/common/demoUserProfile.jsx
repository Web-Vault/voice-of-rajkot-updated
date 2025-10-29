import React from 'react';
import { useParams } from 'react-router-dom';
import { FaQuoteLeft } from 'react-icons/fa';

const DemoUserProfile = () => {
      var { id } = useParams();
      console.log("id", id);
      id = 1;
      const artists = [
            {
                  id: 1,
                  name: 'Aarav Mehta',
                  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
                  tags: ['Poet', 'Spoken Word'],
                  bio: 'Award-winning poet and spoken word performer. Loves to blend Gujarati and Hindi verse.',
                  about: 'Aarav has performed at over 50 poetry events across India, inspiring audiences with his unique blend of languages and heartfelt delivery. He is passionate about bringing poetry to the youth and often conducts workshops in schools and colleges.',
                  poetry: [
                        { id: 1, title: 'Whispers of the Monsoon', desc: 'A poem capturing the beauty and nostalgia of the first rains in Gujarat.', date: '2023-07-15' },
                        { id: 2, title: 'City Lights', desc: 'Reflections on life and dreams under the glowing city lights of Rajkot.', date: '2023-05-22' },
                        { id: 3, title: 'Roots', desc: "A heartfelt tribute to family, tradition, and the poet's Gujarati heritage.", date: '2022-12-10' },
                        { id: 4, title: 'Unspoken Verses', desc: 'Exploring the power of silence and the words left unsaid.', date: '2022-09-03' }
                  ]
            },
            {
                  id: 2,
                  name: 'Priya Shah',
                  photo: 'https://randomuser.me/api/portraits/women/44.jpg',
                  bio: 'Emerging voice in contemporary poetry. Finds inspiration in everyday life.',
                  tags: ['Poet'],
                  about: 'Priya is a rising star in the poetry world, known for her relatable verses and gentle delivery. She draws inspiration from daily life and the people around her.',
                  poetry: [
                        { id: 1, title: 'Morning Dew', desc: 'A fresh take on new beginnings and hope.', date: '2023-06-10' },
                        { id: 2, title: 'Threads', desc: 'A poem about connections and relationships.', date: '2023-03-18' }
                  ]
            },
            {
                  id: 3,
                  name: 'Rahul Desai',
                  photo: 'https://randomuser.me/api/portraits/men/65.jpg',
                  bio: 'Performs at open mics across Gujarat. Known for his energetic stage presence.',
                  tags: ['Performer', 'Poet'],
                  about: 'Rahul is a dynamic performer who brings poetry to life on stage. He is a regular at open mics and poetry slams.',
                  poetry: [
                        { id: 1, title: 'Stage Lights', desc: 'A poem about the thrill of performing.', date: '2023-04-12' }
                  ]
            },
            {
                  id: 4,
                  name: 'Sneha Patel',
                  photo: 'https://randomuser.me/api/portraits/women/68.jpg',
                  bio: 'Writes and recites poetry in Gujarati and English. Passionate about youth poetry.',
                  tags: ['Poet', 'Youth'],
                  about: 'Sneha is passionate about encouraging young poets and often mentors students. She writes in both Gujarati and English.',
                  poetry: [
                        { id: 1, title: 'Bilingual Dreams', desc: 'A poem about identity in two languages.', date: '2023-02-20' }
                  ]
            },
            {
                  id: 5,
                  name: 'Vikram Joshi',
                  photo: 'https://randomuser.me/api/portraits/men/77.jpg',
                  bio: 'Performs classic and modern poetry. Organizes poetry workshops in Rajkot.',
                  tags: ['Performer', 'Workshop'],
                  about: 'Vikram is dedicated to keeping classic poetry alive and regularly organizes workshops for aspiring poets.',
                  poetry: [
                        { id: 1, title: 'Legacy', desc: 'A tribute to the great poets of the past.', date: '2022-11-05' }
                  ]
            },
            {
                  id: 6,
                  name: 'Kavya Trivedi',
                  photo: 'https://randomuser.me/api/portraits/women/12.jpg',
                  bio: 'Young poetess with a love for storytelling and rhyme. Featured in local magazines.',
                  tags: ['Poet', 'Storyteller'],
                  about: 'Kavya is a storyteller at heart, weaving tales and rhymes that captivate her audience. She has been featured in several local magazines.',
                  poetry: [
                        { id: 1, title: 'Tales in Rhyme', desc: 'A playful poem for children and adults alike.', date: '2023-01-15' }
                  ]
            }
      ];

      const artist = artists.find(a => a.id === parseInt(id));

      if (!artist) {
            return (
                  <section className="artist-profile-section">
                        <div className="text-center text-lg text-red-600 mt-20">Artist not found.</div>
                  </section>
            );
      }

      return (
            <section className="artist-profile-section">
                  <div className="artist-profile-header mb-10 px-4 md:px-12">
                        <h2 className="artist-profile-title">Artist Profile</h2>
                        <div className="artist-profile-title-underline artist-profile-title-underline-animated"></div>
                        <div className="artist-profile-subheading">Discover the journey and works of this talented artist</div>
                  </div>
                  <div className="events-tile-header-divider"></div>
                  {/* Wide Profile Card */}
                  <div className="artist-profile-maincard group relative overflow-hidden flex flex-col md:flex-row p-0 border border-[#e0e7ff] rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 max-w-6xl mx-auto mb-14">
                        <div className="artist-accent-bar"></div>
                        {/* Photo Section - Left Side */}
                        <div className="artist-profile-photo-section w-full md:w-1/3 relative overflow-hidden">
                              <img src={artist.photo} alt={artist.name} className="artist-profile-photo w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        {/* Details Section - Right Side */}
                        <div className="artist-profile-details-section w-full md:w-2/3 p-8 md:p-12">
                              <div className="flex flex-col h-full justify-between">
                                    <div>
                                          <h3 className="artist-profile-name text-3xl font-bold text-indigo-800 mb-4">{artist.name}</h3>
                                          <div className="artist-profile-tags flex flex-wrap gap-3 mb-6">
                                                {artist.tags.map((tag) => (
                                                      <span key={tag} className="artist-profile-tag bg-indigo-100 text-indigo-700 font-medium px-4 py-2 rounded-full text-base">
                                                            {tag}
                                                      </span>
                                                ))}
                                          </div>
                                          <p className="artist-profile-bio text-gray-600 mb-6 text-lg leading-relaxed">{artist.bio}</p>
                                    </div>

                                    <div className="artist-profile-about-block bg-gray-50 border border-gray-200 rounded-xl p-6">
                                          <div className="flex items-start gap-4">
                                                <div className="about-icon bg-indigo-100 rounded-full p-3 flex-shrink-0">
                                                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                      </svg>
                                                </div>
                                                <div>
                                                      <h4 className="font-semibold text-lg text-gray-800 mb-2">About</h4>
                                                      <p className="text-gray-600 text-base leading-relaxed">{artist.about}</p>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
                  {/* Poetry Collection */}
                  <div className="max-w-6xl mx-auto px-4 md:px-0">
                        <h3 className="poetry-section-title">Poetry Collection</h3>
                        <div className="poetry-section-title-underline"></div>
                        <div className="poetry-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
                              {artist.poetry.map(poem => (
                                    <div key={poem.id} className="featured-poem-card-pro group flex flex-col justify-between relative">
                                          <span className="featured-poem-quote-icon-pro">
                                                <FaQuoteLeft />
                                          </span>
                                          <div className="featured-poem-phrase-pro mb-8">
                                                {poem.desc}
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
                                                            {artist.tags.join(' & ')}
                                                      </span>
                                                </div>
                                                <span className="featured-poem-date-pro ml-auto text-xs text-gray-400 font-semibold">{poem.date}</span>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>
                  <style jsx>{`
        .artist-profile-section {
          background: #f8fafc;
          padding-top: 4.5rem;
          padding-bottom: 4.5rem;
          font-family: 'Inter', 'Segoe UI', sans-serif;
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
          border: 1.5px solid rgba(255,255,255,0.35);
        }
        .artist-profile-title-underline-animated {
          transform: scaleX(0);
          transform-origin: left;
          animation: artistProfileUnderlineGrow 1.1s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
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
          background: linear-gradient(90deg, #e0e7ff 0%, #6366f1 50%, #e0e7ff 100%);
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
        .featured-poem-date-pro {
          font-size: 0.85rem;
          color: #a1a1aa;
          font-weight: 600;
          margin-left: auto;
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

export default DemoUserProfile; 