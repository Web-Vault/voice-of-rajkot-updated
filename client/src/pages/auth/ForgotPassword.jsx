import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { requestPasswordReset, verifyPasswordReset, setNewPassword as setNewPasswordApi } from '../../services/authService';
import { toast } from 'react-toastify';

const letterPool = [
      { char: 'અ' },
      { char: 'क' },
      { char: 'A' },
      { char: 'ش' },
      { char: '诗' },
      { char: 'ક' },
      { char: 'B' },
      { char: 'ગ' },
      { char: 'م' },
      { char: '字' },
      { char: 'R' },
      { char: 'પ' },
      { char: 'न' },
      { char: 'C' },
      { char: 'ક' },
      { char: 'દ' },
];

function getRandomLetters(pool, count) {
      const arr = [...pool];
      for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, count).map((char) => ({ char: char.char }));
}

const ForgotPassword = () => {
      const navigate = useNavigate();
      const [step, setStep] = useState(1); // 1: request, 2: verify, 3: set password
      const [email, setEmail] = useState('');
      const [otp, setOtp] = useState('');
      const [resetToken, setResetToken] = useState('');
      const [newPassword, setNewPasswordInput] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [errors, setErrors] = useState({ email: '', otp: '', password: '', general: '' });
      const floatingLetters = useMemo(() => getRandomLetters(letterPool, 16), []);

      const handleRequest = async (e) => {
            e.preventDefault();
            const newErrors = { email: '', otp: '', password: '', general: '' };
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  newErrors.email = 'Please enter a valid email.';
                  setErrors(newErrors);
                  return;
            }
            setLoading(true);
            try {
                  await requestPasswordReset(email);
                  toast.success('If the email exists, an OTP has been sent.');
                  setStep(2);
            } catch (err) {
                  toast.error(err.message || 'Failed to request reset');
            } finally {
                  setLoading(false);
            }
      };

      const handleVerify = async (e) => {
            e.preventDefault();
            const newErrors = { email: '', otp: '', password: '', general: '' };
            if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
                  newErrors.otp = 'Please enter a valid 6-digit OTP.';
                  setErrors(newErrors);
                  return;
            }
            setLoading(true);
            try {
                  const res = await verifyPasswordReset(email, otp);
                  if (res.success && res.resetToken) {
                        setResetToken(res.resetToken);
                        toast.success('OTP verified. You can now set a new password.');
                        setStep(3);
                  } else {
                        toast.error(res.message || 'Failed to verify OTP');
                  }
            } catch (err) {
                  toast.error(err.message || 'Failed to verify OTP');
            } finally {
                  setLoading(false);
            }
      };

      const handleSetPassword = async (e) => {
            e.preventDefault();
            const newErrors = { email: '', otp: '', password: '', general: '' };
            if (!newPassword || newPassword.length < 6) {
                  newErrors.password = 'Password must be at least 6 characters.';
                  setErrors(newErrors);
                  return;
            }
            if (newPassword !== confirmPassword) {
                  newErrors.password = 'Passwords do not match.';
                  setErrors(newErrors);
                  return;
            }
            setLoading(true);
            try {
                  const res = await setNewPasswordApi(resetToken, newPassword);
                  if (res.success) {
                        toast.success('Password reset successful. Please log in.');
                        navigate('/login');
                  } else {
                        toast.error(res.message || 'Failed to reset password');
                  }
            } catch (err) {
                  toast.error(err.message || 'Failed to reset password');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="auth-split-bg min-h-screen flex">
                  {/* Brand/Visual Section */}
                  <div className="auth-split-left hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-500 to-blue-400 text-white p-12 relative overflow-hidden">
                        <div className="boiling-letters">
                              {floatingLetters.map((letter, i) => (
                                    <span key={i} className={`boil-letter bl-${i}`}>{letter.char}</span>
                              ))}
                        </div>
                        <div className="flex flex-col items-center z-10 relative">
                              <div className="auth-logo-big flex items-center justify-center rounded-2xl bg-white/10 shadow-lg mb-6">
                                    <span className="text-5xl font-extrabold">V</span>
                              </div>
                              <h1 className="text-3xl font-bold mb-2 tracking-wide">Voice of Rajkot</h1>
                              <p className="text-lg font-medium mb-8 opacity-90">Where Rajkot speaks, artists shine.</p>
                        </div>
                        <div className="absolute bottom-8 left-0 w-full flex justify-center opacity-30">
                              <svg width="120" height="40"><ellipse cx="60" cy="20" rx="60" ry="18" fill="white" /></svg>
                        </div>
                  </div>
                  {/* Themed, Modern Forgot Password Form Section */}
                  <div className="auth-split-right flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-6 py-12 md:px-16 min-h-screen">
                        <div className="themed-card-form w-full max-w-md relative">
                              <div className="px-8 py-10 md:px-10 md:py-12">
                                    <h2 className="text-2xl font-bold mb-2 text-indigo-800 text-center">Forgot Password</h2>
                                    <p className="mb-8 text-gray-500 text-base text-center">Reset your password securely via OTP.</p>

                                    {/* Step 1: Request OTP */}
                                    {step === 1 && (
                                          <form onSubmit={handleRequest} className="space-y-6">
                                                <div>
                                                      <label htmlFor="email" className="themed-label">Email</label>
                                                      <input id="email" type="email" className={`themed-input${errors.email ? ' input-error' : ''}`} value={email} onChange={e => setEmail(e.target.value)} required />
                                                      {errors.email && <span className="error-msg">{errors.email}</span>}
                                                </div>
                                                <button className="themed-btn w-full" type="submit" disabled={loading}>
                                                      {loading ? 'Sending...' : 'Send OTP'}
                                                </button>
                                                <div className="text-sm text-gray-500 text-center">You’ll receive a 6-digit OTP to reset your password.</div>
                                          </form>
                                    )}

                                    {/* Step 2: Verify OTP */}
                                    {step === 2 && (
                                          <form onSubmit={handleVerify} className="space-y-6">
                                                <div>
                                                      <label className="themed-label">Email</label>
                                                      <input type="email" className="themed-input bg-gray-100" value={email} readOnly />
                                                </div>
                                                <div>
                                                      <label htmlFor="otp" className="themed-label">OTP</label>
                                                      <input id="otp" type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} className={`themed-input tracking-widest${errors.otp ? ' input-error' : ''}`} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="123456" required />
                                                      {errors.otp && <span className="error-msg">{errors.otp}</span>}
                                                </div>
                                                <button className="themed-btn w-full" type="submit" disabled={loading}>
                                                      {loading ? 'Verifying...' : 'Verify OTP'}
                                                </button>
                                                <div className="text-center">
                                                      <button type="button" className="text-indigo-600 hover:underline text-sm" onClick={() => setStep(1)}>Resend OTP</button>
                                                </div>
                                          </form>
                                    )}

                                    {/* Step 3: Set New Password */}
                                    {step === 3 && (
                                          <form onSubmit={handleSetPassword} className="space-y-6">
                                                <div>
                                                      <label className="themed-label">Email</label>
                                                      <input type="email" className="themed-input bg-gray-100" value={email} readOnly />
                                                </div>
                                                <div>
                                                      <label htmlFor="password" className="themed-label">New Password</label>
                                                      <input id="password" type="password" className={`themed-input${errors.password ? ' input-error' : ''}`} value={newPassword} onChange={e => setNewPasswordInput(e.target.value)} placeholder="••••••••" required />
                                                </div>
                                                <div>
                                                      <label htmlFor="confirm" className="themed-label">Confirm Password</label>
                                                      <input id="confirm" type="password" className={`themed-input${errors.password ? ' input-error' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
                                                      {errors.password && <span className="error-msg">{errors.password}</span>}
                                                </div>
                                                <button className="themed-btn w-full" type="submit" disabled={loading}>
                                                      {loading ? 'Resetting...' : 'Reset Password'}
                                                </button>
                                          </form>
                                    )}

                                    <div className="flex justify-between mt-8 text-sm">
                                          <Link to="/login" className="text-indigo-600 hover:underline">Back to Login</Link>
                                          <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <style>{`
        .auth-split-bg { min-height: 100vh; background: #f8fafc; }
        .auth-split-left { min-height: 100vh; position: relative; overflow: hidden; box-shadow: 2px 0 24px #6366f11a; }
        .auth-logo-big { width: 5.5rem; height: 5.5rem; background: rgba(255,255,255,0.13); border-radius: 1.2rem; box-shadow: 0 4px 32px #6366f133; margin-bottom: 1.5rem; z-index: 2; }
        .boiling-letters { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .boil-letter { position: absolute; font-size: 2.2rem; font-weight: 700; opacity: 0.18; color: #fff; user-select: none; filter: blur(0.5px); animation: boilBubble 5.5s linear infinite; }
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
        @keyframes boilBubble { 0% { opacity: 0.18; transform: translateY(0) scale(1) rotate(0deg); } 10% { opacity: 0.28; } 60% { opacity: 0.22; } 80% { opacity: 0.28; } 90% { opacity: 0.18; } 100% { opacity: 0; transform: translateY(-180px) scale(1.25) rotate(8deg); } }
        .auth-split-right { min-height: 100vh; background: #fff; display: flex; align-items: center; justify-content: center; }
        .themed-card-form { background: #fff; border-radius: 1.2rem; box-shadow: 0 6px 32px #6366f13a, 0 1.5px 8px #a5b4fc22; border: 1.5px solid #e0e7ff; max-width: 420px; margin: 0 auto; position: relative; z-index: 2; overflow: hidden; }
        .themed-label { text-align: left; display: block; font-size: 1.05rem; font-weight: 500; color: #374151; margin-bottom: 0.35rem; letter-spacing: 0.01em; }
        .themed-input { width: 100%; padding: 1rem 1.2rem; border-radius: 0.7rem; border: 1.5px solid #e0e7ff; background: #f8fafc; font-size: 1.08rem; font-weight: 500; color: #22223b; box-shadow: 0 1.5px 8px #6366f111; }
        .themed-btn { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #fff; border-radius: 0.8rem; padding: 0.9rem 1.2rem; font-size: 1.05rem; font-weight: 600; box-shadow: 0 8px 28px #4f46e522; transition: transform 0.15s ease, box-shadow 0.15s ease; border: none; }
        .themed-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px #4f46e533; }
        .input-error { border-color: #ef4444 !important; box-shadow: 0 1.5px 8px #ef444411 !important; }
        .error-msg { color: #ef4444; font-size: 0.9rem; margin-top: 0.35rem; display: block; }
      `}</style>
            </div>
      );
};

export default ForgotPassword;