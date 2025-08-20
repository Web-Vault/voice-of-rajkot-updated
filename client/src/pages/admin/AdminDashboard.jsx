import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FaCalendarAlt, FaUsers, FaPlus, FaMapMarkerAlt, FaChair, FaArrowRight, FaTimes } from 'react-icons/fa';
import { getAllEvents, createEvent } from '../../services/eventService';
import { getAllUsers } from '../../services/userService';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event._id} className="event-tile-item bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div className="event-tile-img-wrap relative">
                        <img
                          src={event.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                          alt={event.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 left-4 bg-white/90 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" /> {format(new Date(event.dateTime), 'dd MMM yyyy, h:mm a')}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt /> {event.venue}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaChair /> {event.bookedSeats} / {event.totalSeats} seats
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(event.bookedSeats / event.totalSeats) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {Math.round((event.bookedSeats / event.totalSeats) * 100)}% booked
                          </span>
                          <Link
                            to={`/events/${event._id}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                          >
                            Details <FaArrowRight className="text-xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
              
              {/* Users Tab */}
              <Tab.Panel>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">All Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Mobile</th>
                        <th className="py-3 px-6 text-center">Role</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">
                            <div className="flex items-center">
                              <div className="mr-2">
                                <img
                                  className="w-8 h-8 rounded-full"
                                  src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                  alt={user.name}
                                />
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-6 text-left">{user.email}</td>
                          <td className="py-3 px-6 text-left">{user.mobileNumber || 'N/A'}</td>
                          <td className="py-3 px-6 text-center">
                            <span className={`${user.isPerformer ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'} py-1 px-3 rounded-full text-xs`}>
                              {user.isPerformer ? 'Performer' : 'User'}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <Link to={`/users/${user._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">View</Link>
                          </td>
                        </tr>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={newEvent.dateTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={newEvent.venue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
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
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newEvent.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
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