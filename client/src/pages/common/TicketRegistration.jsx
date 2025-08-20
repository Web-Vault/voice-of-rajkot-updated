import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaUsers, FaMicrophone, FaClock, FaEdit, FaTrash, FaQrcode, FaCreditCard, FaTimes, FaDownload, FaInfoCircle, FaUpload, FaSpinner } from "react-icons/fa";
import { getEventById } from "../../services/eventService";
import { createBooking, getUserBookings, uploadPaymentScreenshot, uploadPaymentScreenshotToBackend } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";

const TicketRegistration = () => {
  const { type, id } = useParams(); // 'audience' or 'performer', event id
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user data from AuthContext

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingBooking, setExistingBooking] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const ticketRef = useRef(null);
  const fileInputRef = useRef(null);

  // Separate useEffect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventData, bookingsData] = await Promise.all([
          getEventById(id),
          getUserBookings()
        ]);
        setEvent(eventData.event);
        
        // Check if user already has a booking for this event
        const existingBooking = bookingsData.bookings.find(booking => 
          booking.event._id === id
        );
        setExistingBooking(existingBooking);

        if (existingBooking) {
          if (type === 'performer' && !existingBooking.isPerformer) {
            setError('You have already registered as an audience for this event');
          } else if (type === 'audience' && existingBooking.isPerformer) {
            setError('You have already registered as a performer for this event');
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  // Separate useEffect for error countdown
  useEffect(() => {
    let timer;
    if (error) {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/my-profile');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [error, navigate]);
  // Audience form state
  const [audienceForm, setAudienceForm] = useState({
    userName: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobileNumber || '',
    numberOfPeople: 1,
    peopleNames: [user?.name || '']
  });

  // Performer form state
  const [performerForm, setPerformerForm] = useState({
    userName: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobileNumber || '',
    artType: '',
    duration: ''
  });

  // UI state
  const [showQR, setShowQR] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [editingSeats, setEditingSeats] = useState(false);



  // Audience form handlers
  const handleAudienceInputChange = (field, value) => {
    setAudienceForm(prev => {
      const updatedForm = {
        ...prev,
        [field]: value
      };
      
      // If userName is being updated, also update the first person's name
      if (field === 'userName' && prev.peopleNames.length > 0) {
        const newPeopleNames = [...prev.peopleNames];
        newPeopleNames[0] = value; // Update first person's name
        updatedForm.peopleNames = newPeopleNames;
      }
      
      return updatedForm;
    });
  };

  const handleNumberOfPeopleChange = (value) => {
    const num = parseInt(value) || 1;
    const newPeopleNames = Array(num).fill('').map((_, index) => {
      if (index === 0) {
        // First person should be the main user's name
        return audienceForm.userName || '';
      }
      return audienceForm.peopleNames[index] || '';
    });
    
    setAudienceForm(prev => ({
      ...prev,
      numberOfPeople: num,
      peopleNames: newPeopleNames
    }));
  };

  const handlePersonNameChange = (index, value) => {
    const newPeopleNames = [...audienceForm.peopleNames];
    newPeopleNames[index] = value;
    setAudienceForm(prev => ({
      ...prev,
      peopleNames: newPeopleNames
    }));
  };

  const removePerson = (index) => {
    if (audienceForm.numberOfPeople > 1) {
      const newPeopleNames = audienceForm.peopleNames.filter((_, i) => i !== index);
      setAudienceForm(prev => ({
        ...prev,
        numberOfPeople: prev.numberOfPeople - 1,
        peopleNames: newPeopleNames
      }));
    }
  };

  // Performer form handlers
  const handlePerformerInputChange = (field, value) => {
    setPerformerForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate totals and available seats
  const audienceTotal = audienceForm.numberOfPeople * (event?.price || 0);
  const performerTotal = event?.price || 0; // Performer pays same as audience
  const availableSeats = event ? event.totalSeats - event.bookedSeats : 0;

  // Form validation
  const isAudienceFormValid = () => {
    return audienceForm.userName && 
           audienceForm.email && 
           audienceForm.mobile && 
           audienceForm.peopleNames.every(name => name.trim());
  };

  const isPerformerFormValid = () => {
    return performerForm.userName && 
           performerForm.email && 
           performerForm.mobile && 
           performerForm.artType && 
           performerForm.duration;
  };

  // Action handlers
  const handleConfirmSeats = () => {
    if (type === 'audience' && isAudienceFormValid()) {
      setIsConfirmed(true);
    } else if (type === 'performer' && isPerformerFormValid()) {
      setIsConfirmed(true);
    }
  };

  // Updated handlePay function
  const handlePay = () => {
    setShowRulesModal(true);
  };

  const handleConfirmPayment = () => {
    if (!rulesAccepted) {
      alert("Please accept the rules and regulations to proceed.");
      return;
    }

    // Close rules modal and show QR code modal
    setShowRulesModal(false);
    setShowQRModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError('File size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setUploadError('Only JPG, JPEG, and PNG files are allowed');
        return;
      }
      setPaymentScreenshot(file);
      setUploadError('');
    }
  };

  const handleUploadScreenshot = async () => {
    if (!paymentScreenshot) {
      setUploadError('Please select a payment screenshot');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      // First create the booking
      const bookingData = {
        event: id,
        username: type === "audience" ? audienceForm.userName : performerForm.userName,
        email: type === "audience" ? audienceForm.email : performerForm.email,
        mobileNumber: type === "audience" ? audienceForm.mobile : performerForm.mobile,
        numberOfSeats: type === "audience" ? parseInt(audienceForm.numberOfPeople) : 1,
        membersName: type === "audience" ? audienceForm.peopleNames : [],
        isPerformer: type === "performer",
        artType: type === "performer" ? performerForm.artType : undefined,
        duration: type === "performer" ? parseInt(performerForm.duration) : undefined,
        totalAmount: type === "audience" ? audienceTotal : performerTotal,
        paymentStatus: 'verified'
      };

      const bookingResponse = await createBooking(bookingData);
      
      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || 'Failed to create booking');
      }

      // Then upload the payment screenshot
      // Use the backend upload method instead of direct Cloudinary upload
      const uploadResponse = await uploadPaymentScreenshotToBackend(
        bookingResponse.booking._id, 
        paymentScreenshot
      );
      
      if (!uploadResponse.success) {
        throw new Error('Failed to upload payment screenshot');
      }

      // Generate ticket data
      const ticketInfo = {
        bookingId: uploadResponse.booking._id,
        eventName: event.name,
        eventDate: event.date,
        eventTime: event.time,
        venue: event.venue,
        attendeeCount: type === "audience" ? parseInt(audienceForm.numberOfPeople) : 1,
        attendees: type === "audience" ? audienceForm.peopleNames : [performerForm.userName],
        ticketType: type === "audience" ? "Audience" : "Performer",
        bookingDate: new Date().toLocaleDateString(),
        amount: type === "audience" ? audienceTotal : performerTotal,
        artType: type === "performer" ? performerForm.artType : undefined,
        duration: type === "performer" ? parseInt(performerForm.duration) : undefined,
        isPerformer: type === "performer",
        paymentStatus: 'verified'
      };
      
      // Set ticket data and show success message
      setTicketData(ticketInfo);
      setShowQRModal(false);
      setShowTicketModal(true);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.message || error.message || 'Failed to process booking');
    } finally {
      setUploading(false);
    }
  };

  const handleCompletePayment = () => {
    setShowQRModal(true);
  };

  const closeRulesModal = () => {
    setShowRulesModal(false);
    setRulesAccepted(false);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
  };

  const closeTicketModal = () => {
    setShowTicketModal(false);
    navigate("/my-profile");
  };

  const handleDownloadTicket = () => {
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
        pdf.save(`${ticketData.eventName}-Ticket.pdf`);
      });
    }
  };

  // QR Code Modal Component
  const QRCodeModal = () => {
    const qrCodeRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('File size should be less than 5MB');
          return;
        }
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
          setUploadError('Only JPG, JPEG, and PNG files are allowed');
          return;
        }
        setPaymentScreenshot(file);
        setUploadError('');
      }
    };

    const handleRemoveScreenshot = () => {
      setPaymentScreenshot(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    useEffect(() => {
      if (qrCodeRef.current) {
        // Clear any existing QR code
        qrCodeRef.current.innerHTML = "";
        
        // UPI details
        const upiID = "rushilr196-1@oksbi"; 
        // const upiID = "aryanlathigara@okhdfcbank"; 
        const name = "Rhythm Of Heart"; 
        const amount = type === 'audience' ? audienceTotal : performerTotal;
        
        // Create UPI payment link
        const upiLink = `upi://pay?pa=${encodeURIComponent(upiID)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
        
        // Load QRCode.js dynamically
        const loadQRCode = async () => {
          try {
            // Check if QRCode is already loaded
            if (typeof window.QRCode === 'undefined') {
              // Create script element
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
              script.async = true;
              
              // Create a promise to wait for script to load
              const scriptLoadPromise = new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
              });
              
              // Add script to document
              document.head.appendChild(script);
              
              // Wait for script to load
              await scriptLoadPromise;
            }
            
            // Generate QR code using the loaded library with theme colors
            new window.QRCode(qrCodeRef.current, {
              text: upiLink,
              width: 200,
              height: 200,
              colorDark: "#6366f1",
              colorLight: "#ffffff",
              correctLevel: window.QRCode.CorrectLevel.H
            });
            
            // Add a subtle animation
            qrCodeRef.current.style.opacity = '0';
            setTimeout(() => {
              qrCodeRef.current.style.transition = 'opacity 0.5s ease-in-out';
              qrCodeRef.current.style.opacity = '1';
            }, 100);
          } catch (error) {
            console.error('Error loading QR code library:', error);
            // Fallback display if QR code fails to load
            qrCodeRef.current.innerHTML = `<div style="text-align: center;">
              <p>UPI Payment Link:</p>
              <p style="font-weight: bold; color: #6366f1; margin-top: 10px;">${upiID}</p>
              <p style="word-break: break-all;">${upiLink}</p>
            </div>`;
          }
        };
        
        loadQRCode();
      }
    }, [audienceTotal, performerTotal, type]);
    
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Scan QR Code to Pay</h2>
            <button className="close-btn" onClick={closeQRModal}>
              <FaTimes />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="qr-section">
              <div className="payment-header">
                <div className="payment-amount">
                  <span className="currency">₹</span>
                  <span className="amount">{type === 'audience' ? audienceTotal : performerTotal}</span>
                </div>
                <div className="payment-event">{event?.name}</div>
                <div className="payment-type">
                  {type === 'audience' ? `${audienceForm.numberOfPeople} Seats` : 'Performer Registration'}
                </div>
              </div>
              
              <div className="qr-code-container">
                <div className="qr-code" ref={qrCodeRef}></div>
                <div className="upi-details">
                  <div className="upi-id">UPI ID: rushilr196-1@oksbi</div>

                  <div className="upi-name">Rhythm Of Heart</div>
                </div>
              </div>
              
              <div className="payment-instructions">
                <div className="instruction-step">
                  <div className="step-number">1</div>
                  <div className="step-text">Scan the QR code with any UPI app</div>
                </div>
                <div className="instruction-step">
                  <div className="step-number">2</div>
                  <div className="step-text">Complete the payment of ₹{type === 'audience' ? audienceTotal : performerTotal}</div>
                </div>
                <div className="instruction-step">
                  <div className="step-number">3</div>
                  <div className="step-text">Check the box below and click "I've Completed Payment"</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {/* Payment Screenshot Upload */}
            <div className="mt-6 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</h3>
              
              {!paymentScreenshot ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="payment-screenshot"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="payment-screenshot"
                          name="payment-screenshot"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex flex-col items-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-md">
                  <img
                    src={URL.createObjectURL(paymentScreenshot)}
                    alt="Payment Screenshot Preview"
                    className="max-h-40 max-w-full mx-auto mb-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveScreenshot}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove and upload another
                  </button>
                </div>
              )}
              
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">{uploadError}</p>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={closeQRModal}
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                className={`confirm-payment-btn ${!paymentScreenshot || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleUploadScreenshot}
                disabled={!paymentScreenshot || uploading}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2 inline" />
                    Processing...
                  </>
                ) : (
                  'Submit Payment Proof'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rules and Regulations Modal Component
  const RulesModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Rules and Regulations</h2>
          <button className="close-btn" onClick={closeRulesModal}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="rules-section">
            <h3>Registration:</h3>
            <ul>
              <li>Registration is mandatory for both participants and viewers.</li>
              <li>Fees: ₹150 (for participants), ₹100 (for audience).</li>
              <li><strong>Note:</strong> Registration is non-refundable and non-transferable under any circumstances.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Original Shayari Only:</h3>
            <ul>
              <li>Participants must perform their own, original work only.</li>
              <li>Any copied or previously published work will lead to disqualification.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Time Limit:</h3>
            <ul>
              <li>Each participant will be given 5 minutes only.</li>
              <li>Time limits must be respected to allow equal opportunity for all.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Dress Code:</h3>
            <ul>
              <li>Avoid white clothing.</li>
              <li>Dress modestly and appropriately for the event setting.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Language & Respect:</h3>
            <ul>
              <li>No abusive, offensive, or disrespectful language will be tolerated.</li>
              <li>Shayari must not target or involve religion, caste, politics, or personal attacks.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Mobile Usage:</h3>
            <ul>
              <li>Please keep your mobile phones on silent mode during the event.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Video & Content Policy:</h3>
            <ul>
              <li>Video recording is not allowed by attendees.</li>
              <li>Short snaps or clips (only a few seconds) are allowed just for memories.</li>
              <li>Only the organizer is allowed to upload any stories or content on social media.</li>
              <li>Official recordings may be taken by organizers.</li>
              <li>Performances may be uploaded online only if approved by our team.</li>
              <li>Content selected for online platforms may be used for event promotion.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Exit Policy:</h3>
            <ul>
              <li>No one will be allowed to leave the venue before the event is completed.</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Behaviour:</h3>
            <ul>
              <li>All attendees are expected to behave respectfully and responsibly.</li>
              <li>Disruptive, rude, or inappropriate behavior toward participants, guests, or organizers will result in removal from the venue without refund.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="rulesAccepted"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
            />
            <label htmlFor="rulesAccepted">
              I have read and agree to all the rules and regulations mentioned above.
            </label>
          </div>
          
          <div className="modal-actions">
            <button className="cancel-btn" onClick={closeRulesModal}>
              Cancel
            </button>
            <button 
              className={`confirm-payment-btn ${!rulesAccepted ? 'disabled' : ''}`}
              onClick={handleConfirmPayment}
              disabled={!rulesAccepted}
            >
              Confirm & Pay ₹{type === 'audience' ? audienceTotal : performerTotal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleEditSeats = () => {
    setEditingSeats(true);
    setIsConfirmed(false);
  };

  const handleEditDetails = () => {
    setIsConfirmed(false);
  };

  const handleBackToEvent = () => {
    navigate(-1);
  };

  // Ticket Modal Component
  const TicketModal = () => {
    if (!ticketData) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-content ticket-modal">
          <div className="modal-header">
            <h2>Your Ticket</h2>
            <button className="close-btn" onClick={closeTicketModal}>
              <FaTimes />
            </button>
          </div>
          
          <div className="modal-body">
            <div className={`ticket-container ${ticketData.isPerformer ? 'performer-ticket' : 'audience-ticket'}`} ref={ticketRef}>
              <div className="ticket-header">
                <div className="ticket-logo">Voice of Rajkot</div>
                <div className={`ticket-type ${ticketData.isPerformer ? 'performer-type' : 'audience-type'}`}>
                  {ticketData.ticketType} Ticket
                  {ticketData.isPerformer && <FaMicrophone className="performer-icon" />}
                </div>
              </div>
              
              <div className="ticket-event-details">
                <h3>{ticketData.eventName}</h3>
                <div className="ticket-info-row">
                  <div className="ticket-info-item">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{ticketData.eventDate ? format(new Date(ticketData.eventDate), 'dd MMM yyyy') : 'N/A'}</span>
                  </div>
                  <div className="ticket-info-item">
                    <span className="info-label">Time:</span>
                    <span className="info-value">{ticketData.eventTime}</span>
                  </div>
                </div>
                <div className="ticket-info-row">
                  <div className="ticket-info-item">
                    <span className="info-label">Venue:</span>
                    <span className="info-value">{ticketData.venue}</span>
                  </div>
                  <div className="ticket-info-item">
                    <span className="info-label">Booking ID:</span>
                    <span className="info-value">{ticketData.bookingId}</span>
                  </div>
                </div>
              </div>
              
              {/* Performer-specific details */}
              {ticketData.isPerformer && (
                <div className="ticket-performer-details">
                  <div className="performer-details-header">
                    <FaMicrophone className="performer-header-icon" />
                    <span>Performance Details</span>
                  </div>
                  <div className="ticket-info-row">
                    <div className="ticket-info-item">
                      <span className="info-label">Art Type:</span>
                      <span className="info-value performer-art-type">{ticketData.artType}</span>
                    </div>
                    <div className="ticket-info-item">
                      <span className="info-label">Duration:</span>
                      <span className="info-value performer-duration">
                        <FaClock className="duration-icon" />
                        {ticketData.duration}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="ticket-attendees">
                <div className="attendee-header">
                  <span>{ticketData.isPerformer ? 'Performer' : `Attendees (${ticketData.attendeeCount})`}</span>
                </div>
                <ul className="attendee-list">
                  {ticketData.attendees.map((name, index) => (
                    <li key={index} className="attendee-item">{name}</li>
                  ))}
                </ul>
              </div>
              
              <div className="ticket-footer">
                <div className="ticket-amount">Amount Paid: ₹{ticketData.amount}</div>
                <div className="ticket-date">Booked on: {ticketData.bookingDate || 'N/A'}</div>
              </div>
            </div>
            
            <div className="ticket-instructions">
              <div className="instruction-with-icon">
                <FaInfoCircle className="info-icon" />
                <div className="tooltip">
                  At the entrance of the event, you must show this ticket and the screenshot of payment you have made.
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <div className="modal-actions flex">
              {/* <button className="download-btn w-100 flex justify-center" onClick={handleDownloadTicket}>
                <FaDownload /> Download Ticket
              </button> */}
              <button className="confirm-btn w-100" onClick={closeTicketModal}>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading and error handling for fetched event
  if (loading) {
    return <div className="text-center py-20">Loading event...</div>;
  }

  if (!event) {
    return <div className="text-center py-20">Event not found</div>;
  }

  return (
    <div className="ticket-registration-container">
      {/* Header */}
      <div className="registration-header">
        <button onClick={handleBackToEvent} className="back-btn">
          ← Back to Event
        </button>
        {error && (
          <div className="error-container bg-red-50 border border-red-200 rounded-lg p-4 my-4">
            <div className="text-red-600 text-center font-medium mb-2">{error}</div>
            {countdown && (
              <div className="text-gray-600 text-center text-sm">
                Redirecting to profile page in {countdown} seconds...
              </div>
            )}
          </div>
        )}
        <h1 className="registration-title">
          {type === 'audience' ? 'Audience Registration' : 'Performer Registration'}
        </h1>
        <div className="event-info">
          <h2>{event.name}</h2>
          <p>₹{event.price} per seat</p>
        </div>
      </div>
      
      {/* QR Code Modal */}
      {showQRModal && <QRCodeModal />}
      {/* Ticket Modal */}
      {showTicketModal && <TicketModal />}

      <div className="registration-content">
        {type === 'audience' ? (
          // AUDIENCE FORM
          <div className="registration-form">
            {!isConfirmed ? (
              <>
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaUser /> User Name</label>
                      <input
                        type="text"
                        value={audienceForm.userName}
                        onChange={(e) => handleAudienceInputChange('userName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label><FaEnvelope /> Email</label>
                      <input
                        type="email"
                        value={audienceForm.email}
                        onChange={(e) => handleAudienceInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><FaPhone /> Mobile Number</label>
                    <input
                      type="tel"
                      value={audienceForm.mobile}
                      onChange={(e) => handleAudienceInputChange('mobile', e.target.value)}
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Seat Details</h3>
                  <div className="form-group">
                    <label><FaUsers /> Number of People</label>
                    <input
                      type="number"
                      min="1"
                      max={availableSeats}
                      value={audienceForm.numberOfPeople}
                      onChange={(e) => handleNumberOfPeopleChange(e.target.value)}
                    />
                    <small>Available seats: {availableSeats}</small>
                  </div>

                                     <div className="people-names">
                     <h4>Names of People Attending</h4>
                     {audienceForm.peopleNames.map((name, index) => (
                       <div key={index} className="person-name-row">
                         <input
                           type="text"
                           value={name}
                           onChange={(e) => handlePersonNameChange(index, e.target.value)}
                           placeholder={index === 0 ? "Your name (auto-filled)" : `Person ${index + 1} name`}
                           disabled={index === 0}
                           className={index === 0 ? "attendees-input disabled-input" : ""}
                         />
                         {audienceForm.numberOfPeople > 1 && index > 0 && (
                           <button 
                             type="button" 
                             className="remove-person-btn"
                             onClick={() => removePerson(index)}
                           >
                             <FaTrash />
                           </button>
                         )}
                       </div>
                     ))}
                   </div>
                </div>

                <button 
                  className="confirm-btn"
                  onClick={handleConfirmSeats}
                  disabled={!isAudienceFormValid()}
                >
                  Confirm Seats
                </button>
              </>
            ) : (
              // CONFIRMATION VIEW
              <div className="confirmation-view">
                <div className="confirmation-header">
                  <h3>Seat Confirmation</h3>
                  <button onClick={handleEditSeats} className="edit-btn">
                    <FaEdit /> Edit Seats
                  </button>
                </div>

                <div className="booking-summary">
                  <div className="summary-item">
                    <span>Total Seats:</span>
                    <span>{audienceForm.numberOfPeople}</span>
                  </div>
                  <div className="summary-item">
                    <span>Price per Seat:</span>
                    <span>₹{event.price}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total Amount:</span>
                    <span>₹{audienceTotal}</span>
                  </div>
                </div>

                <div className="people-list">
                  <h4>Attendees</h4>
                  {audienceForm.peopleNames.map((name, index) => (
                    <div key={index} className="person-item">
                      <span>Seat {index + 1}: {name}</span>
                    </div>
                  ))}
                </div>

                {!showQR ? (
                  <button className="pay-btn" onClick={handlePay}>
                    <FaCreditCard /> Pay ₹{audienceTotal}
                  </button>
                ) : (
                  <div className="qr-section">
                    <h3>Scan QR Code to Pay</h3>
                    <div className="qr-code">
                      <FaQrcode />
                      <p>QR Code Placeholder</p>
                    </div>
                    <p className="qr-note">Scan this QR code with your payment app to complete the transaction</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // PERFORMER FORM
          <div className="registration-form">
            {!isConfirmed ? (
              <>
                <div className="form-section">
                  <h3>Personal Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaUser /> User Name</label>
                      <input
                        type="text"
                        value={performerForm.userName}
                        onChange={(e) => handlePerformerInputChange('userName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label><FaEnvelope /> Email</label>
                      <input
                        type="email"
                        value={performerForm.email}
                        onChange={(e) => handlePerformerInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label><FaPhone /> Mobile Number</label>
                    <input
                      type="tel"
                      value={performerForm.mobile}
                      onChange={(e) => handlePerformerInputChange('mobile', e.target.value)}
                      placeholder="Enter your mobile number"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Performance Details</h3>
                  <div className="form-group">
                    <label><FaMicrophone /> Type of Art</label>
                    <select
                      value={performerForm.artType}
                      onChange={(e) => handlePerformerInputChange('artType', e.target.value)}
                    >
                      <option value="">Select art type</option>
                      <option value="poetry" selected>Poetry</option>
                      <option value="storytelling">Storytelling</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label><FaClock /> Duration (In Minutes)</label>
                    <input
                      type="text"
                      value={performerForm.duration}
                      onChange={(e) => handlePerformerInputChange('duration', e.target.value)}
                      placeholder="e.g., 5, 3, etc"
                    />
                    <small className="text-sm text-gray-500 ml-1">maximum time for performance is 5 minutes.</small>
                  </div>
                </div>

                <button 
                  className="confirm-btn"
                  onClick={handleConfirmSeats}
                  disabled={!isPerformerFormValid()}
                >
                  Confirm Registration
                </button>
              </>
            ) : (
              // CONFIRMATION VIEW
              <div className="confirmation-view">
                <div className="confirmation-header">
                  <h3>Registration Confirmation</h3>
                  <button onClick={handleEditDetails} className="edit-btn">
                    <FaEdit /> Edit Details
                  </button>
                </div>

                <div className="booking-summary">
                  <div className="summary-item">
                    <span>Registration Type:</span>
                    <span>Performer</span>
                  </div>
                  <div className="summary-item">
                    <span>Art Type:</span>
                    <span>{performerForm.artType}</span>
                  </div>
                  <div className="summary-item">
                    <span>Duration:</span>
                    <span>{performerForm.duration}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Registration Fee:</span>
                    <span>₹{performerTotal}</span>
                  </div>
                </div>

                {!showQR ? (
                  <button className="pay-btn" onClick={handlePay}>
                    <FaCreditCard /> Pay ₹{performerTotal}
                  </button>
                ) : (
                  <div className="qr-section">
                    <h3>Scan QR Code to Pay</h3>
                    <div className="qr-code">
                      <FaQrcode />
                      <p>QR Code Placeholder</p>
                    </div>
                    <p className="qr-note">Scan this QR code with your payment app to complete the transaction</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rules Modal */}
      {showRulesModal && <RulesModal />}
      
      {/* Styles */}
      <style>{`
        .ticket-registration-container {
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          padding: 2rem 0;
        }

        .registration-header {
          max-width: 800px;
          margin: 0 auto 3rem auto;
          padding: 0 2rem;
          text-align: center;
        }

        .back-btn {
          background: transparent;
          color: #6366f1;
          border: 2px solid #6366f1;
          border-radius: 2rem;
          padding: 0.8rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 2rem;
        }

        .back-btn:hover {
          background: #6366f1;
          color: #fff;
        }

        .registration-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: #232046;
          margin-bottom: 1rem;
        }

        .event-info {
          background: #fff;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 16px #6366f122;
          border: 1px solid #e0e7ff;
        }

        .event-info h2 {
          color: #232046;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .event-info p {
          color: #6366f1;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .registration-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .registration-form {
          background: #fff;
          border-radius: 2rem;
          padding: 3rem;
          box-shadow: 0 8px 32px #6366f122;
          border: 1px solid #e0e7ff;
        }

        .form-section {
          margin-bottom: 2.5rem;
        }

        .form-section h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #232046;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #232046;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .attendees-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e7ff;
          border-radius: 1rem;
          font-size: 1rem;
          transition: border-color 0.2s;
        }


         .form-group input:focus,
         .form-group select:focus
         .attendees-input:focus {
           outline: none;
           border-color: #6366f1;
         }

         .disabled-input {
           background-color: #f8fafc;
           color: #6b7280;
           cursor: not-allowed;
         }

        .form-group small {
          color: #6b7280;
          font-size: 0.9rem;
          margin-top: 0.3rem;
          display: block;
        }

        .people-names h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #232046;
          margin-bottom: 1rem;
        }

        .person-name-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          align-items: center;
        }

        .person-name-row input {
          flex: 1;
        }

        .remove-person-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .remove-person-btn:hover {
          background: #dc2626;
        }

                 .confirm-btn {
           background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
           color: #fff;
           font-weight: 700;
           border: none;
           border-radius: 2rem;
           padding: 1.2rem 2.5rem;
           font-size: 1.1rem;
           cursor: pointer;
           transition: all 0.2s;
           width: 100%;
           margin-top: 1rem;
         }

         .pay-btn {
           background: linear-gradient(90deg, #6366f1 60%, #818cf8 100%);
           color: #fff;
           font-weight: 700;
           border: none;
           border-radius: 2rem;
           padding: 1.2rem 2.5rem;
           font-size: 1.1rem;
           cursor: pointer;
           transition: all 0.2s;
           width: 100%;
           margin-top: 2rem;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.8rem;
         }

        .confirm-btn:hover,
        .pay-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px #6366f144;
        }

        .confirm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .confirmation-view {
          background: #f8fafc;
          border-radius: 1.5rem;
          padding: 2rem;
          border: 1px solid #e0e7ff;
        }

        .confirmation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .confirmation-header h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #232046;
        }

        .edit-btn {
          background: transparent;
          color: #6366f1;
          border: 2px solid #6366f1;
          border-radius: 1rem;
          padding: 0.8rem 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edit-btn:hover {
          background: #6366f1;
          color: #fff;
        }

        .booking-summary {
          background: #fff;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e0e7ff;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem 0;
          border-bottom: 1px solid #f1f5ff;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item.total {
          font-weight: 800;
          font-size: 1.2rem;
          color: #232046;
          border-top: 2px solid #e0e7ff;
          margin-top: 0.5rem;
          padding-top: 1rem;
        }

        .people-list {
          background: #fff;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e0e7ff;
        }

        .people-list h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #232046;
          margin-bottom: 1rem;
        }

        .person-item {
          padding: 0.8rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .qr-section {
          text-align: center;
          background: #fff;
          border-radius: 1.5rem;
          padding: 0;
          border: 1px solid #e0e7ff;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1);
        }

        .payment-header {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
          color: white;
          padding: 1.5rem;
          text-align: center;
        }

        .payment-amount {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .currency {
          font-size: 1.8rem;
          margin-right: 0.2rem;
        }

        .payment-event {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          opacity: 0.9;
        }

        .payment-type {
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2rem;
          padding: 0.3rem 1rem;
          display: inline-block;
        }

        .qr-code-container {
          padding: 2rem;
          background: white;
          position: relative;
        }

        .qr-code {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          margin: 0 auto;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .upi-details {
          margin-top: 1rem;
          padding: 0.8rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border: 1px solid #e0e7ff;
        }

        .upi-id {
          font-weight: 600;
          color: #232046;
          margin-bottom: 0.2rem;
        }

        .upi-name {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .payment-instructions {
          padding: 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #e0e7ff;
        }

        .instruction-step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          text-align: left;
        }

        .instruction-step:last-child {
          margin-bottom: 0;
        }

        .step-number {
          background: #6366f1;
          color: white;
          width: 1.8rem;
          height: 1.8rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 0.8rem;
          flex-shrink: 0;
        }

        .step-text {
          color: #374151;
          font-size: 0.95rem;
          padding-top: 0.2rem;
        }

        @media (max-width: 768px) {
          .registration-form {
            padding: 2rem 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .confirmation-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .registration-title {
            font-size: 2rem;
          }
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

        .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .rules-section {
          margin-bottom: 1.5rem;
        }

        .rules-section h3 {
          color: #6366f1;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .rules-section ul {
          list-style: disc;
          margin-left: 1.5rem;
          color: #374151;
        }

        .rules-section li {
          margin-bottom: 0.3rem;
          line-height: 1.5;
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .checkbox-container {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-container input[type="checkbox"] {
          margin-top: 0.2rem;
          width: 1.2rem;
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
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        
        .ticket-info-item {
          flex: 1;
        }
        
        .info-label {
          font-weight: 600;
          color: #4b5563;
          margin-right: 0.5rem;
        }
        
        .info-value {
          color: #1f2937;
        }
        
        .ticket-attendees {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .attendee-header {
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.75rem;
        }
        
        .attendee-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .attendee-item {
          padding: 0.5rem 0;
          border-bottom: 1px dashed #e5e7eb;
          color: #1f2937;
        }
        
        .attendee-item:last-child {
          border-bottom: none;
        }
        
        .ticket-footer {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          background: #f9fafb;
        }
        
        .ticket-amount {
          font-weight: 700;
          color: #6366f1;
        }
        
        .ticket-date {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .ticket-instructions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: center;
        }
        
        .instruction-with-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        
        .info-icon {
          color: #6366f1;
          font-size: 1.5rem;
          cursor: help;
        }
        
        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          width: 300px;
          text-align: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
          z-index: 10;
        }
        
        .instruction-with-icon:hover .tooltip {
          opacity: 1;
          visibility: visible;
          bottom: calc(100% + 10px);
        }
        
        .download-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        
        .download-btn:hover {
          background: #4f46e5;
        }
          height: 1.2rem;
          accent-color: #6366f1;
        }

        .checkbox-container label {
          color: #374151;
          font-size: 0.95rem;
          line-height: 1.4;
          cursor: pointer;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .confirm-payment-btn {
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 0.5rem;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .confirm-payment-btn:hover:not(.disabled) {
          background: #5856eb;
        }

        .confirm-payment-btn.disabled {
          background: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            max-height: 90vh;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .cancel-btn,
          .confirm-payment-btn {
            width: 100%;
          }
        }
        
        .error-container {
          max-width: 600px;
          margin: 0 auto;
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TicketRegistration;
