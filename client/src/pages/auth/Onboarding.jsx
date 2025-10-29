import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const MAX_TAGS = 3;
const steps = [
      {
            title: "Your Tags",
            sub: "Add up to 3 tags that describe your art or style. These will be visible on your profile.",
            desc: "Tags help people discover you. E.g. 'Poet', 'Storyteller', 'Spoken Word', 'Performer'."
      },
      {
            title: "Short Bio",
            sub: "Write a short bio that will appear on your profile.",
            desc: "Let people know who you are in a sentence or two."
      },
      {
            title: "Work History / Description",
            sub: "Describe your journey, achievements, or what makes your art unique.",
            desc: "Share your experience, events, or anything that tells your story."
      },
      {
            title: "Profile Image",
            sub: "Upload a profile image (optional, but recommended).",
            desc: "A good photo helps people recognize you."
      },
      {
            title: "Poetry Sample",
            sub: "Share one of your poems.",
            desc: "This will be featured on your profile as a sample of your work."
      }
];

const Onboarding = () => {
      const navigate = useNavigate();
      const { updateAuthState } = useAuth();
      const [step, setStep] = useState(0);
      const [lastAnimatedStep, setLastAnimatedStep] = useState(0);
      const [animating, setAnimating] = useState(false);
      const animationTimeout = useRef(null);
      const [tags, setTags] = useState([]);
      const [tagInput, setTagInput] = useState("");
      const [bio, setBio] = useState("");
      const [workHistory, setWorkHistory] = useState("");
      const [image, setImage] = useState(null);
      const [poetry, setPoetry] = useState("");
      const [errors, setErrors] = useState({});

      // Only animate when step changes
      useEffect(() => {
            if (step !== lastAnimatedStep) {
                  setAnimating(true);
                  if (animationTimeout.current) clearTimeout(animationTimeout.current);
                  animationTimeout.current = setTimeout(() => {
                        setAnimating(false);
                        setLastAnimatedStep(step);
                  }, 700); // match animation duration
            }
            // Cleanup on unmount
            return () => {
                  if (animationTimeout.current) clearTimeout(animationTimeout.current);
            };
      }, [step]);

      // Step validation
      const validateStep = () => {
            const newErrors = {};
            if (step === 0 && tags.length === 0) newErrors.tags = "Add at least 1 tag.";
            if (step === 1 && !bio.trim()) newErrors.bio = "Bio is required.";
            if (step === 2 && !workHistory.trim()) newErrors.workHistory = "Work history/description is required.";
            if (step === 4 && !poetry.trim()) newErrors.poetry = "Please share a poetry sample.";
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
      };

      const handleNext = (e) => {
            e && e.preventDefault();
            if (!validateStep()) return;
            setErrors({});
            setStep((s) => s + 1);
      };

      const handleBack = (e) => {
            e && e.preventDefault();
            setErrors({});
            setStep((s) => s - 1);
      };

      const handleTagInput = (e) => {
            setTagInput(e.target.value);
      };

      const handleTagKeyDown = (e) => {
            if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                  e.preventDefault();
                  addTag(tagInput.trim());
            }
      };

      const addTag = (tag) => {
            if (
                  tag &&
                  !tags.includes(tag) &&
                  tags.length < MAX_TAGS &&
                  tag.length <= 18
            ) {
                  setTags([...tags, tag]);
                  setTagInput("");
            }
      };

      const removeTag = (tag) => {
            setTags(tags.filter((t) => t !== tag));
      };

      const handleImageChange = (e) => {
            if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
            }
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            if (!validateStep()) return;

            try {
                  const userData = {
                        profileTags: tags,
                        oneLineDesc: bio,
                        workDescription: workHistory,
                        profilePhoto: image ? URL.createObjectURL(image) : undefined,
                        isSampleAdded: !!poetry,
                        sample: poetry
                  };

                  await updateUserProfile(userData);
                  updateAuthState(); // Update the auth context with new user data
                  navigate("/my-profile");
            } catch (error) {
                  setErrors({
                        ...errors,
                        general: error.message || "Failed to complete onboarding"
                  });
            }
      };

      // Progress bar with animation
      const Progress = () => (
            <div className="flex items-center justify-center mb-8">
                  {steps.map((s, idx) => (
                        <div key={s.title} className="flex items-center">
                              <div className={`onboarding-step-circle w-8 h-8 rounded-full flex items-center justify-center font-bold text-base border-2 transition-all duration-300 ${idx < step
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : idx === step
                                          ? `bg-white border-indigo-600 text-indigo-700${animating ? ' onboarding-step-circle-animated' : ''}`
                                          : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    {idx + 1}
                              </div>
                              {idx < steps.length - 1 && (
                                    <div className={`onboarding-step-bar h-1 w-8 md:w-16 mx-1 md:mx-2 rounded ${idx < step
                                          ? `bg-indigo-600${animating ? ' onboarding-step-bar-animated' : ''}`
                                          : 'bg-gray-200'
                                          }`} />
                              )}
                        </div>
                  ))}
            </div>
      );

      // Main content for each step
      const renderStep = () => {
            switch (step) {
                  case 0:
                        return (
                              <div>
                                    <div className="mb-2 text-gray-600 text-base">{steps[0].desc}</div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                          {tags.map((tag) => (
                                                <span key={tag} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center text-sm font-medium">
                                                      {tag}
                                                      <button type="button" className="ml-2 text-indigo-500 hover:text-red-500" onClick={() => removeTag(tag)}>&times;</button>
                                                </span>
                                          ))}
                                          {tags.length < MAX_TAGS && (
                                                <input
                                                      type="text"
                                                      value={tagInput}
                                                      onChange={handleTagInput}
                                                      onKeyDown={handleTagKeyDown}
                                                      className="themed-input w-32 px-2 py-1 text-sm"
                                                      placeholder="Add tag"
                                                      maxLength={18}
                                                />
                                          )}
                                    </div>
                                    {errors.tags && <span className="error-msg">{errors.tags}</span>}
                              </div>
                        );
                  case 1:
                        return (
                              <div>
                                    <div className="mb-2 text-gray-600 text-base">{steps[1].desc}</div>
                                    <input
                                          type="text"
                                          className={`themed-input${errors.bio ? ' input-error' : ''}`}
                                          value={bio}
                                          onChange={e => setBio(e.target.value)}
                                          maxLength={120}
                                          placeholder="E.g. Poet, storyteller, performer..."
                                    />
                                    {errors.bio && <span className="error-msg">{errors.bio}</span>}
                              </div>
                        );
                  case 2:
                        return (
                              <div>
                                    <div className="mb-2 text-gray-600 text-base">{steps[2].desc}</div>
                                    <textarea
                                          className={`themed-input resize-none h-24${errors.workHistory ? ' input-error' : ''}`}
                                          value={workHistory}
                                          onChange={e => setWorkHistory(e.target.value)}
                                          maxLength={400}
                                          placeholder="Describe your journey, achievements, or what makes your art unique..."
                                    />
                                    {errors.workHistory && <span className="error-msg">{errors.workHistory}</span>}
                              </div>
                        );
                  case 3:
                        return (
                              <div>
                                    <div className="mb-2 text-gray-600 text-base">{steps[3].desc}</div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="block" />
                                    {image && (
                                          <div className="mt-2 flex items-center gap-3">
                                                <img src={URL.createObjectURL(image)} alt="Preview" className="w-16 h-16 object-cover rounded-full border" />
                                                <span className="text-gray-500 text-xs">{image.name}</span>
                                          </div>
                                    )}
                              </div>
                        );
                  case 4:
                        return (
                              <div>
                                    <div className="mb-2 text-gray-600 text-base">{steps[4].desc}</div>
                                    <textarea
                                          className={`themed-input resize-none h-24${errors.poetry ? ' input-error' : ''}`}
                                          value={poetry}
                                          onChange={e => setPoetry(e.target.value)}
                                          maxLength={400}
                                          placeholder="Write a short poem that represents you..."
                                    />
                                    {errors.poetry && <span className="error-msg">{errors.poetry}</span>}
                              </div>
                        );
                  default:
                        return null;
            }
      };

      return (
            <section className="onboarding-section min-h-screen bg-[#f8fafc] pt-12 pb-16 px-0">
                  <div className="max-w-4xl mx-auto px-4 md:px-12">
                        <div className="onboarding-header mb-10">
                              <h2 className="onboarding-title">{steps[step].title}</h2>
                              <div className="onboarding-title-underline onboarding-title-underline-animated"></div>
                              <div className="onboarding-subheading">{steps[step].sub}</div>
                        </div>
                        <div className="onboarding-divider"></div>
                        <Progress />
                        <form onSubmit={step === steps.length - 1 ? handleSubmit : handleNext} className="space-y-7 mt-8">
                              {renderStep()}
                              <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8">
                                    {step > 0 && (
                                          <button type="button" className="themed-btn min-w-[140px] w-full sm:w-auto" onClick={handleBack}>Back</button>
                                    )}
                                    <button type="submit" className="themed-btn min-w-[180px] w-full sm:w-auto">
                                          {step < steps.length - 1 ? "Next" : "Finish Onboarding"}
                                    </button>
                              </div>
                        </form>
                  </div>
                  <style>{`
        .onboarding-section {
          background: #f8fafc;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }
        .onboarding-header {
          margin: 0 auto 2.5rem auto;
          text-align: left;
        }
        .onboarding-title {
          font-size: 2.3rem;
          font-weight: 800;
          color: #232046;
          letter-spacing: -0.01em;
        }
        .onboarding-title-underline {
          width: 120px;
          height: 4px;
          background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
          border-radius: 2px;
          margin-bottom: 1.2rem;
          margin-top: 0.1rem;
          box-shadow: 0 2px 12px #6366f144;
          border: 1.5px solid rgba(255,255,255,0.35);
        }
        .onboarding-title-underline-animated {
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
        .onboarding-subheading {
          color: #6366f1;
          font-size: 1.13rem;
          font-weight: 400;
          line-height: 1.7;
          margin-bottom: 1.2rem;
          max-width: 540px;
          letter-spacing: 0.01em;
        }
        .onboarding-divider {
          max-width: 1600px;
          margin: 0 auto 2.5rem auto;
          height: 1.5px;
          background: linear-gradient(90deg, #e0e7ff 0%, #6366f1 50%, #e0e7ff 100%);
          opacity: 0.18;
          border-radius: 1px;
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
          padding: 0.8rem 1.1rem;
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
        .onboarding-step-circle {
          transition: background 0.3s, border 0.3s, color 0.3s, transform 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .onboarding-step-circle-animated {
          animation: onboardingStepCirclePop 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes onboardingStepCirclePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.25); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .onboarding-step-bar {
          transition: background 0.3s, transform 0.7s cubic-bezier(0.4,0,0.2,1);
          transform-origin: left;
        }
        .onboarding-step-bar-animated {
          animation: onboardingStepBarGrow 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes onboardingStepBarGrow {
          0% { transform: scaleX(0); opacity: 0.2; }
          60% { opacity: 1; }
          100% { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
            </section>
      );
};

export default Onboarding;