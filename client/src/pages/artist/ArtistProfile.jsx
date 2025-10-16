import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/authService";
import { Tab } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ArtistProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshData, setRefreshData] = useState(0);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getUserProfile();
        if (response.success && response.user) {
          setProfile(response.user);

          // Fetch user's posts
          const postsResponse = await fetch(
            `${BASE_URL}/api/posts/author/${response.user._id}`,  

            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            }
          );
          const postsData = await postsResponse.json();
          setPosts(postsData.posts || []);

          // Fetch events where user is a performer
          const eventsResponse = await fetch(
            `${BASE_URL}/api/events/performer/${response.user._id}`,

            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            }
          );
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events || []);

          // Fetch user's bookings
          const bookingsResponse = await fetch(
            `${BASE_URL}/api/bookings/user`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
              },
            }
          );
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setPosts([]);
        setEvents([]);
        setBookings([]);
      }
    };

    fetchProfileData();
  }, [refreshData]); // Add refreshData dependency

  // Add like/dislike handlers
  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      if (response.ok) {
        setRefreshData(prev => prev + 1); // Trigger data refresh
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/unlike`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      if (response.ok) {
        setRefreshData(prev => prev + 1); // Trigger data refresh
      }
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleExitDashoard = () => {
    navigate("/");
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {

        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleFieldEdit = (field, value) => {
    setEditField(field);
    setEditValue(value);
  };

  const handleSaveField = async () => {
    try {
      const updatedData = { [editField]: editValue };
      if (editField === "profileTags") {
        updatedData.profileTags = editValue
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }
      await handleSaveProfile(updatedData);
      setEditField(null);
      setEditValue("");
    } catch (error) {
      console.error("Error saving field:", error);
    }
  };

  if (!profile) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
            {profile.profilePhoto && (
              <img
                src={profile.profilePhoto}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-1">{profile.oneLineDesc}</p>
          </div>
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Edit Profile
          </button>
          <button
            onClick={handleExitDashoard}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Exit Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 bg-purple-100 p-1 rounded-xl mb-6">
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium leading-5 text-purple-700 rounded-lg
              ${
                selected
                  ? "bg-white shadow"
                  : "hover:bg-white/[0.12] hover:text-purple-800"
              }`
            }
          >
            Dashboard
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium leading-5 text-purple-700 rounded-lg
              ${
                selected
                  ? "bg-white shadow"
                  : "hover:bg-white/[0.12] hover:text-purple-800"
              }`
            }
          >
            Events
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium leading-5 text-purple-700 rounded-lg
              ${
                selected
                  ? "bg-white shadow"
                  : "hover:bg-white/[0.12] hover:text-purple-800"
              }`
            }
          >
            Posts
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium leading-5 text-purple-700 rounded-lg
              ${
                selected
                  ? "bg-white shadow"
                  : "hover:bg-white/[0.12] hover:text-purple-800"
              }`
            }
          >
            Bookings
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Dashboard Panel */}
          <Tab.Panel>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Artist Information</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700">Name</h3>
                    <p className="mt-1 text-gray-600">{profile.name}</p>
                  </div>
                  <button
                    onClick={() => handleFieldEdit("name", profile.name)}
                    className="p-2 text-gray-600 hover:text-purple-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700">
                      One Line Description
                    </h3>
                    <p className="mt-1 text-gray-600">{profile.oneLineDesc}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleFieldEdit("oneLineDesc", profile.oneLineDesc)
                    }
                    className="p-2 text-gray-600 hover:text-purple-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700">
                      Work Description
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {profile.workDescription}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleFieldEdit(
                        "workDescription",
                        profile.workDescription
                      )
                    }
                    className="p-2 text-gray-600 hover:text-purple-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700">Profile Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.profileTags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleFieldEdit(
                        "profileTags",
                        profile.profileTags?.join(", ")
                      )
                    }
                    className="p-2 text-gray-600 hover:text-purple-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-700">Added Sample Poetry</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.sample ? (
                        <div className="w-full p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">{profile.sample}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No sample poetry added yet</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleFieldEdit(
                        "sample",
                        profile.sample || ""
                      )
                    }
                    className="p-2 text-gray-600 hover:text-purple-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </Tab.Panel>

          {/* Add this Edit Field Modal */}
          {editField && (
            <div className="fixed inset-0 bg-white/10 backdrop-blur-xs flex items-center justify-center z-50">
              <div className="bg-white border rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Edit {editField}</h3>
                {editField === "profileTags" ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Enter tags separated by commas"
                    className="w-full p-2 border rounded mb-4"
                  />
                ) : editField === "workDescription" ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows="4"
                    className="w-full p-2 border rounded mb-4"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditField(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveField}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Events Panel */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(event.dateTime).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{event.venue}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-purple-600 font-medium">
                        ₹{event.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {event.bookedSeats}/{event.totalSeats} seats
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* Posts Panel */}
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">{post.heading}</h3>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>{post.likes?.length || 0} likes</span>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* Bookings Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {booking.event.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Ticket ID: {booking.ticketId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-600 font-medium">
                        ₹{booking.totalAmount}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.numberOfSeats} seats
                      </p>
                    </div>
                  </div>
                  {booking.isPerformer && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-md">
                      <p className="text-sm font-medium text-purple-700">
                        Performance Details
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        Art Type: {booking.artType}
                      </p>
                      <p className="text-sm text-purple-600">
                        Duration: {booking.duration} minutes
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4">
                  <div className="mt-4 text-sm text-gray-500">
                    Booked on:{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                    <span className="text-sm text-gray-600">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          booking.paymentStatus === "verified"
                            ? "bg-green-100 text-green-800"
                            : booking.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            {/* Add your edit form here */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveProfile(/* updated data */)}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistProfile;
