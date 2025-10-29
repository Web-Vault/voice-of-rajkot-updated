import React, { useState } from "react";

const ContactUs = () => {
      const [formData, setFormData] = useState({
            name: "",
            email: "",
            message: "",
      });

      const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = (e) => {
            e.preventDefault();
            alert("Your message has been submitted!"); // Replace with backend/API call if needed
            setFormData({ name: "", email: "", message: "" });
      };

      return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12">
                  <h1 className="text-4xl font-bold text-blue-600 mb-12 text-center">
                        Contact Us
                  </h1>

                  <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10">

                        {/* Contact Form */}
                        <div className="bg-white shadow-lg rounded-lg p-8">
                              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                          type="text"
                                          name="name"
                                          placeholder="Your Name"
                                          value={formData.name}
                                          onChange={handleChange}
                                          required
                                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                          type="email"
                                          name="email"
                                          placeholder="Your Email"
                                          value={formData.email}
                                          onChange={handleChange}
                                          required
                                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <textarea
                                          name="message"
                                          placeholder="Your Message"
                                          rows="5"
                                          value={formData.message}
                                          onChange={handleChange}
                                          required
                                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    ></textarea>
                                    <button
                                          type="submit"
                                          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                                    >
                                          Send Message
                                    </button>
                              </form>
                        </div>

                        {/* Contact Info & Map */}
                        <div className="flex flex-col space-y-6">
                              {/* Contact Info */}
                              <div className="bg-white shadow-lg rounded-lg p-8 space-y-4">
                                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                                    <p><strong>Phone:</strong> +91 6354840323</p>
                                    <p><strong>Email:</strong> dhruvinsatodiya@gmail.com</p>
                                    <p><strong>Address:</strong> limbdachowk, rajkot, gujarat</p>
                              </div>

                              {/* Location Map */}
                              <div className="overflow-hidden rounded-lg shadow-lg">
                                    <iframe
                                          title="Company Location"
                                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609942352!2d72.74110141075982!3d19.082197838542424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63b6311c3c5%3A0xddd3a6b0a4b0c49f!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1616171701289!5m2!1sen!2sin"
                                          width="100%"
                                          height="300"
                                          allowFullScreen=""
                                          loading="lazy"
                                    ></iframe>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default ContactUs;
