import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FaCalendarAlt, FaUsers, FaPlus, FaMapMarkerAlt, FaChair, FaArrowRight, FaTimes, FaEye, FaTicketAlt } from 'react-icons/fa';
import { getAllEvents, createEvent } from '../../services/eventService';
import { getAllUsers } from '../../services/userService';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { FiDelete } from 'react-icons/fi';
import { FaDeleteLeft } from 'react-icons/fa6';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    dateTime: '',
    venue: '',
    description: '',
    totalSeats: 100,
    price: 0,
    image: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch events
        const eventsData = await getAllEvents();
        console.log('eventsData', eventsData);
        setEvents(eventsData);
        
        // Fetch users
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await createEvent(newEvent);
      
      // Add the new event to the events list
      setEvents(prev => [...prev, response.event]);
      
      // Reset form and close modal
      setNewEvent({
        name: '',
        dateTime: '',
        venue: '',
        description: '',
        totalSeats: 100,
        price: 0,
        image: ''
      });
      setShowAddEventModal(false);
    } catch (err) {
      setError(err.message || 'Failed to add event');
    }
  };

  const handleViewBookings = (eventId, eventName) => {
    navigate(`/admin/events/${eventId}/bookings`);
  };

  const toggleUserDetails = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleDeleteUser = async (userId) => {
    // Implement user deletion logic here
    // For example, call an API to delete the user and then update the users state
  };

  if (loading) {
    return <div className="text-center py-20">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="admin-dashboard-container min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex bg-gray-100 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full py-3 text-sm font-medium leading-5 text-gray-700 rounded-lg
                  ${selected ? 'bg-white shadow' : 'hover:bg-white/[0.12] hover:text-gray-800'}
                  flex items-center justify-center gap-2`
                }
              >
                <FaCalendarAlt /> Events
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full py-3 text-sm font-medium leading-5 text-gray-700 rounded-lg
                  ${selected ? 'bg-white shadow' : 'hover:bg-white/[0.12] hover:text-gray-800'}
                  flex items-center justify-center gap-2`
                }
              >
                <FaUsers /> Users
              </Tab>
            </Tab.List>
            <Tab.Panels className="p-4">
              {/* Events Tab */}
              <Tab.Panel>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">All Events</h2>
                  <button
                    onClick={() => setShowAddEventModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <FaPlus /> Add New Event
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-4 text-left">Event Details</th>
                        <th className="py-3 px-4 text-center">Booking Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {events.map((event) => (
                        <React.Fragment key={event._id}>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={event.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                                  alt={event.name}
                                  className="w-24 h-24 object-cover rounded"
                                />
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-800">{event.name}</h3>
                                  <div className="text-sm text-gray-500 mt-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <FaCalendarAlt className="text-xs" />
                                      {format(new Date(event.dateTime), 'dd MMM yyyy, h:mm a')}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FaMapMarkerAlt className="text-xs" />
                                      {event.venue}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex flex-col items-center">
                                <div className="text-lg font-semibold">
                                  {event.bookedSeats} / {event.totalSeats}
                                </div>
                                <div className="w-32 bg-gray-200 h-2 rounded-full mt-2">
                                  <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${(event.bookedSeats / event.totalSeats) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {Math.round((event.bookedSeats / event.totalSeats) * 100)}% booked
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => handleViewBookings(event._id, event.name)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1 justify-center"
                                >
                                  <FaTicketAlt className="text-xs" />
                                  View Bookings
                                </button>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
              
              {/* Users Tab */}
              <Tab.Panel>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">All Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">User Info</th>
                        <th className="py-3 px-6 text-left">Contact</th>
                        <th className="py-3 px-6 text-center">Role</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {users.map((user) => (
                        <React.Fragment key={user._id}>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-6">
                              <div className="flex items-center">
                                <img
                                  className="w-10 h-10 rounded-full mr-3"
                                  src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                  alt={user.name}
                                />
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-6">
                              <div>
                                <div>{user.email}</div>
                                <div className="text-gray-500">{user.mobileNumber || 'N/A'}</div>
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className={`${user.isPerformer ? 'bg-purple-200 text-purple-800' : user.isAdmin ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} py-1 px-3 rounded-full text-xs`}>
                                {user.isAdmin ? 'Admin' : user.isPerformer ? 'Performer' : 'User'}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center flex">
                              <button
                                onClick={() => toggleUserDetails(user._id)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 mx-auto"
                              >
                                <FaEye className="text-sm" />
                                <span>{expandedUser === user._id ? 'Hide Details' : 'View Details'}</span>
                              </button>
                              <button
                                // onClick={() => handleDeleteUser(user._id)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 mx-auto"
                              >
                                <FaDeleteLeft className="text-sm" />
                              </button>
                            </td>
                          </tr>
                          {expandedUser === user._id && (
                            <tr className="bg-gray-50">
                              <td colSpan="4" className="py-4 px-6">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <h4 className="font-semibold text-gray-800 mb-3">User Details</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p><strong>Full Name:</strong> {user.name}</p>
                                      <p><strong>Email:</strong> {user.email}</p>
                                      <p><strong>Mobile:</strong> {user.mobileNumber || 'Not provided'}</p>
                                      <p><strong>Role:</strong> {user.isAdmin ? 'Admin' : user.isPerformer ? 'Performer' : 'Regular User'}</p>
                                    </div>
                                    <div>
                                      <p><strong>Joined:</strong> {format(new Date(user.createdAt || Date.now()), 'dd MMM yyyy')}</p>
                                      <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                                      {user.isPerformer && user.performerDetails && (
                                        <div className="mt-2">
                                          <p><strong>Art Type:</strong> {user.performerDetails.artType}</p>
                                          <p><strong>Experience:</strong> {user.performerDetails.experience} years</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
      
      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add New Event</h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newEvent.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={newEvent.dateTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={newEvent.venue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      name="totalSeats"
                      value={newEvent.totalSeats}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newEvent.price}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={newEvent.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;