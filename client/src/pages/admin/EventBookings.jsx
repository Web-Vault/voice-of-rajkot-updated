import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaChair, FaTicketAlt, FaUsers, FaRupeeSign, FaImage } from 'react-icons/fa';
import { getEventBookings } from '../../services/bookingService';
import { getAllEvents } from '../../services/eventService';
import { format } from 'date-fns';
import './EventBookings.css';

const EventBookings = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSeats: 0,
    totalRevenue: 0,
    performerBookings: 0,
    audienceBookings: 0,
    verifiedPayments: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    const fetchEventAndBookings = async () => {
      try {
        setLoading(true);
        
        // Fetch all events to get the specific event details
        const eventsData = await getAllEvents();
        const currentEvent = eventsData.find(e => e._id === eventId);
        
        if (!currentEvent) {
          setError('Event not found');
          return;
        }
        
        setEvent(currentEvent);
        
        // Fetch bookings for this event
        const response = await getEventBookings(eventId);
        const eventBookings = response.bookings || [];
        setBookings(eventBookings);
        
        // Calculate statistics
        const totalBookings = eventBookings.length;
        const totalSeats = eventBookings.reduce((sum, booking) => sum + booking.numberOfSeats, 0);
        const totalRevenue = eventBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        const performerBookings = eventBookings.filter(booking => booking.isPerformer).length;
        const audienceBookings = totalBookings - performerBookings;
        const verifiedPayments = eventBookings.filter(booking => booking.paymentStatus === 'verified').length;
        const pendingPayments = eventBookings.filter(booking => booking.paymentStatus === 'pending' || !booking.paymentStatus).length;
        
        setStats({
          totalBookings,
          totalSeats,
          totalRevenue,
          performerBookings,
          audienceBookings,
          verifiedPayments,
          pendingPayments
        });
        
      } catch (err) {
        setError(err.message || 'Failed to fetch event bookings');
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEventAndBookings();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="event-bookings-container">
        <div className="text-center py-20">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-gray-600">Loading event bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-bookings-container">
        <div className="text-center py-20">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-bookings-container min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mr-4"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Event Bookings</h1>
        </div>

        {/* Event Details Card */}
        {event && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={event.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                alt={event.name}
                className="w-full md:w-64 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-600" />
                    <span>{format(new Date(event.dateTime), 'dd MMM yyyy, h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-600" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaChair className="text-indigo-600" />
                    <span>{event.bookedSeats} / {event.totalSeats} seats booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRupeeSign className="text-indigo-600" />
                    <span>₹{event.price} per seat</span>
                  </div>
                </div>
                <p className="text-gray-700 mt-4">{event.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <FaTicketAlt className="text-3xl text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Seats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSeats}</p>
              </div>
              <FaChair className="text-3xl text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
              <FaRupeeSign className="text-3xl text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedPayments}</p>
              </div>
              <FaUsers className="text-3xl text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Types</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Performers</span>
                <span className="font-semibold text-purple-600">{stats.performerBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Audience</span>
                <span className="font-semibold text-blue-600">{stats.audienceBookings}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Verified</span>
                <span className="font-semibold text-green-600">{stats.verifiedPayments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">{stats.pendingPayments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">All Bookings ({bookings.length})</h3>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaTicketAlt className="text-4xl mx-auto mb-4 opacity-50" />
              <p>No bookings found for this event.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Info
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Proof
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-indigo-600">{booking.ticketId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.username}</div>
                          <div className="text-sm text-gray-500">{booking.email}</div>
                          <div className="text-sm text-gray-500">{booking.mobileNumber}</div>
                          {booking.membersName && booking.membersName.length > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              <strong>Members:</strong> {booking.membersName.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.isPerformer 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.isPerformer ? 'Performer' : 'Audience'}
                        </span>
                        {booking.isPerformer && booking.artType && (
                          <div className="text-xs text-gray-500 mt-1">{booking.artType}</div>
                        )}
                        {booking.isPerformer && booking.duration && (
                          <div className="text-xs text-gray-500">Duration: {booking.duration} min</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-medium">{booking.numberOfSeats}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="font-medium">₹{booking.totalAmount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.paymentStatus === 'verified' 
                            ? 'bg-green-100 text-green-800'
                            : booking.paymentStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {format(new Date(booking.createdAt), 'dd MMM yyyy, h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.paymentScreenshot?.url ? (
                          <div className="flex justify-center">
                            <div className="w-16 h-16 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={booking.paymentScreenshot.url}
                                alt="Payment proof"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-center block">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default EventBookings;