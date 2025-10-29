import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const letterPool = [
      { char: 'અ' }, // Gujarati
      { char: 'क' }, // Hindi
      { char: 'A' }, // English
      { char: 'ش' }, // Urdu/Arabic
      { char: '诗' }, // Chinese (poetry)
      { char: 'ક' }, // Gujarati
      { char: 'B' }, // English
      { char: 'ગ' }, // Gujarati
      { char: 'م' }, // Urdu/Arabic
      { char: '字' }, // Chinese
      { char: 'R' }, // English
      { char: 'પ' }, // Gujarati
      { char: 'न' }, // Hindi
      { char: 'C' }, // English
      { char: 'ક' }, // Hindi
      { char: 'દ' }, // Gujarati
];

function getRandomLetters(pool, count) {
      const arr = [...pool];
      for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, count).map((char) => ({ char: char.char }));
}

const AuthRegister = () => {
      const navigate = useNavigate();
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [isArtist, setIsArtist] = useState(false);
      const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '', general: '' });

      // Memoize so the letters don't change on every render
      const floatingLetters = useMemo(() => getRandomLetters(letterPool, 16), []);

      function validate() {
            let valid = true;
            const newErrors = { name: '', email: '', password: '', confirmPassword: '', general: '' };
            if (!name) {
                  newErrors.name = 'Name is required.';
                  valid = false;
            }
            if (!email) {
                  newErrors.email = 'Email is required.';
                  valid = false;
            } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                  newErrors.email = 'Enter a valid email address.';
                  valid = false;
            }
            if (!password) {
                  newErrors.password = 'Password is required.';
                  valid = false;
            } else if (password.length < 6) {
                  newErrors.password = 'Password must be at least 6 characters.';
                  valid = false;
            }
            if (!confirmPassword) {
                  newErrors.confirmPassword = 'Please confirm your password.';
                  valid = false;
            } else if (confirmPassword !== password) {
                  newErrors.confirmPassword = 'Passwords do not match.';
                  valid = false;
            }
            setErrors(newErrors);
            return valid;
      }

      const [loading, setLoading] = useState(false);

      async function handleRegister(e) {
            e.preventDefault();
            if (!validate()) return;

            setLoading(true);
            setErrors({ name: '', email: '', password: '', confirmPassword: '', general: '' });

            try {
                  // Import here to avoid circular dependencies
                  const { register } = await import('../../services/authService');

                  const userData = {
                        name,
                        email,
                        password,
                        mobileNumber: '', // Can be updated later in profile
                        isPerformer: isArtist
                  };

                  const response = await register(userData);

                  if (response.success) {
                        // Redirect based on user type
                        if (isArtist) {
                              navigate('/onboarding');
                        } else {
                              navigate('/');
                        }
                  }
            } catch (error) {
                  setErrors({
                        ...errors,
                        general: error.message || 'Registration failed. Please try again.'
                  });
            } finally {
                  setLoading(false);
            }
      }

      return (
            <div className="auth-split-bg min-h-screen flex">
                  {/* Brand/Visual Section */}
                  <div className="auth-split-left hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-500 to-blue-400 text-white p-12 relative overflow-hidden">
                        {/* Animated Boiling Bubbles Letters */}
                        <div className="boiling-letters">
                              {floatingLetters.map((letter, i) => (
                                    <span key={i} className={`boil-letter bl-${i}`}>{letter.char}</span>
                              ))}
                        </div>
                        <div className="flex flex-col items-center z-10 relative">
                              <div className="auth-logo-big flex items-center justify-center rounded-2xl bg-white/10 shadow-lg mb-6">
                                    <span className="text-5xl font-extrabold">R</span>
                              </div>
                              <h1 className="text-3xl font-bold mb-2 tracking-wide">Voice of Rajkot</h1>
                              <p className="text-lg font-medium mb-8 opacity-90">Join the community. Share your art.</p>
                        </div>
                        <div className="absolute bottom-8 left-0 w-full flex justify-center opacity-30">
                              <svg width="120" height="40"><ellipse cx="60" cy="20" rx="60" ry="18" fill="white" /></svg>
                        </div>
                  </div>
                  {/* Themed, Modern Register Form Section */}
                  <div className="auth-split-right flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-6 py-12 md:px-16 min-h-screen">
                        <div className="themed-card-form w-full max-w-lg relative">
                              <div className="px-8 py-10 md:px-10 md:py-12">
                                    <h2 className="text-2xl font-bold mb-2 text-indigo-800 text-center">Create your account</h2>
                                    <p className="mb-8 text-gray-500 text-base text-center">Sign up to get started and join the artists of Rajkot.</p>
                                    <form onSubmit={handleRegister} className="space-y-6">
                                          <div>
                                                <label htmlFor="name" className="themed-label">Name</label>
                                                <input id="name" type="text" className={`themed-input${errors.name ? ' input-error' : ''}`} value={name} onChange={e => setName(e.target.value)} required />
                                                {errors.name && <span className="error-msg">{errors.name}</span>}
                                          </div>
                                          <div>
                                                <label htmlFor="email" className="themed-label">Email</label>
                                                <input id="email" type="email" className={`themed-input${errors.email ? ' input-error' : ''}`} value={email} onChange={e => setEmail(e.target.value)} required />
                                                {errors.email && <span className="error-msg">{errors.email}</span>}
                                          </div>
                                          <div className="themed-row-2col">
                                                <div>
                                                      <label htmlFor="password" className="themed-label">Password</label>
                                                      <input id="password" type="password" className={`themed-input${errors.password ? ' input-error' : ''}`} value={password} onChange={e => setPassword(e.target.value)} required />
                                                      {errors.password && <span className="error-msg">{errors.password}</span>}
                                                </div>
                                                <div>
                                                      <label htmlFor="confirmPassword" className="themed-label">Confirm Password</label>
                                                      <input id="confirmPassword" type="password" className={`themed-input${errors.confirmPassword ? ' input-error' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                                      {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
                                                </div>
                                          </div>
                                          <div className="flex items-center mb-2 mt-2">
                                                <input type="checkbox" id="artist" checked={isArtist} onChange={e => setIsArtist(e.target.checked)} className="mr-2" />
                                                <label htmlFor="artist" className="text-gray-700">Register as Artist/Poet</label>
                                          </div>
                                          {errors.general && <span className="error-msg block mb-2 text-center">{errors.general}</span>}
                                          <button className="themed-btn w-full mt-2" type="submit" disabled={loading}>
                                                {loading ? 'Registering...' : 'Register'}
                                          </button>
                                    </form>
                                    <div className="mt-8 text-sm text-center">
                                          <Link to="/login" className="text-indigo-600 hover:underline">Already have an account? Login</Link>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <style>{`
        .auth-split-bg {
          min-height: 100vh;
          background: #f8fafc;
        }
        .auth-split-left {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          box-shadow: 2px 0 24px #6366f11a;
        }
        .auth-logo-big {
          width: 5.5rem;
          height: 5.5rem;
          background: rgba(255,255,255,0.13);
          border-radius: 1.2rem;
          box-shadow: 0 4px 32px #6366f133;
          margin-bottom: 1.5rem;
          z-index: 2;
        }
        .boiling-letters {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .boil-letter {
          position: absolute;
          font-size: 2.2rem;
          font-weight: 700;
          opacity: 0.18;
          color: #fff;
          user-select: none;
          filter: blur(0.5px);
          animation: boilBubble 5.5s linear infinite;
        }
        .bl-0 { left: 10%; bottom: 7%; animation-delay: 0s; transform: scale(1.1); }
        .bl-1 { left: 22%; bottom: 10%; animation-delay: 1.1s; transform: scale(0.9); }
        .bl-2 { left: 35%; bottom: 6%; animation-delay: 2.2s; transform: scale(1.2); }
        .bl-3 { left: 48%; bottom: 8%; animation-delay: 0.7s; transform: scale(1.05); }
        .bl-4 { left: 60%; bottom: 12%; animation-delay: 1.7s; transform: scale(0.95); }
        .bl-5 { left: 72%; bottom: 9%; animation-delay: 2.8s; transform: scale(1.15); }
        .bl-6 { left: 85%; bottom: 5%; animation-delay: 0.9s; transform: scale(1.05); }
        .bl-7 { left: 15%; bottom: 13%; animation-delay: 2.4s; transform: scale(1.08); }
        .bl-8 { left: 55%; bottom: 11%; animation-delay: 0.6s; transform: scale(1.12); }
        .bl-9 { left: 80%; bottom: 7%; animation-delay: 3.5s; transform: scale(0.92); }
        .bl-10 { left: 65%; bottom: 8%; animation-delay: 1.9s; transform: scale(1.18); }
        .bl-11 { left: 25%; bottom: 12%; animation-delay: 2.7s; transform: scale(1.04); }
        .bl-12 { left: 75%; bottom: 6%; animation-delay: 0.3s; transform: scale(1.09); }
        .bl-13 { left: 40%; bottom: 10%; animation-delay: 1.5s; transform: scale(1.13); }
        .bl-14 { left: 58%; bottom: 7%; animation-delay: 2.2s; transform: scale(0.97); }
        .bl-15 { left: 90%; bottom: 8%; animation-delay: 0.8s; transform: scale(1.07); }
        @keyframes boilBubble {
          0% { opacity: 0.18; transform: translateY(0) scale(1) rotate(0deg); }
          10% { opacity: 0.28; }
          60% { opacity: 0.22; }
          80% { opacity: 0.28; }
          90% { opacity: 0.18; }
          100% { opacity: 0; transform: translateY(-180px) scale(1.25) rotate(8deg); }
        }
        .auth-split-right {
          min-height: 100vh;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .themed-card-form {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 6px 32px #6366f13a, 0 1.5px 8px #a5b4fc22;
          border: 1.5px solid #e0e7ff;
          max-width: 520px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          overflow: hidden;
        }
        .themed-label {
          text-align: left;
          display: block;
          font-size: 1.05rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.35rem;
          letter-spacing: 0.01em;
        }
        .themed-input {
          width: 100%;
          padding: 1rem 1.2rem;
          border-radius: 0.7rem;
          border: 1.5px solid #e0e7ff;
          background: #f8fafc;
          font-size: 1.08rem;
          font-weight: 500;
          color: #22223b;
          box-shadow: 0 1.5px 8px #6366f111;
          outline: none;
          transition: border 0.16s, box-shadow 0.16s;
          margin-bottom: 0.1rem;
        }
        .themed-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #6366f133;
          background: #fff;
        }
        .themed-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem 2.2rem;
        }
        @media (max-width: 900px) {
          .themed-card-form {
            max-width: 98vw;
            border-radius: 1rem;
          }
          .themed-row-2col {
            grid-template-columns: 1fr;
            gap: 1.1rem;
          }
        }
        .input-error {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }
        .error-msg {
          color: #ef4444;
          font-size: 0.97rem;
          margin-top: 0.1rem;
          display: block;
          min-height: 1.2em;
          letter-spacing: 0.01em;
          animation: shake 0.18s 1;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .themed-btn {
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          color: #fff;
          font-weight: 700;
          border-radius: 0.7rem;
          padding: 1.1rem 0;
          font-size: 1.13rem;
          margin-top: 0.2rem;
          transition: background 0.16s, box-shadow 0.16s, transform 0.13s;
          box-shadow: 0 2px 12px #6366f122;
          border: none;
          letter-spacing: 0.01em;
          outline: none;
        }
        .themed-btn:hover, .themed-btn:focus {
          background: linear-gradient(90deg, #818cf8 60%, #6366f1 100%);
          box-shadow: 0 6px 24px #6366f133;
          transform: translateY(-2px) scale(1.03);
        }
        @media (max-width: 900px) {
          .auth-split-left {
            display: none;
          }
          .auth-split-right {
            width: 100vw;
            min-height: 100vh;
            padding: 2.5rem 0;
          }
        }
      `}</style>
            </div>
      );
};

export default AuthRegister;