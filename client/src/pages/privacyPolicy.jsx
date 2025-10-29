import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PrivacyPolicy = () => {
      const location = useLocation();

      useEffect(() => {
            if (location.hash) {
                  const section = document.querySelector(location.hash);
                  if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                  }
            }
      }, [location]);

      return (
            <div className="min-h-screen bg-gray-50 py-12 px-6">
                  <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-12">

                        {/* Page Header */}
                        <h1 className="text-4xl font-bold text-blue-600 text-center mb-6">
                              Our Policies
                        </h1>

                        {/* Navigation */}
                        <div className="flex justify-center space-x-6 mb-8">
                              <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                              <a href="#terms" className="text-blue-600 hover:underline">Terms & Conditions</a>
                              <a href="#shipping" className="text-blue-600 hover:underline">Shipping Policy</a>
                        </div>

                        {/* Privacy Policy Section */}
                        <section id="privacy" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Privacy Policy</h2>
                              <p className="text-gray-600">
                                    We respect your privacy and are committed to protecting your personal data.
                                    Any information collected from you will be used only for the purposes of
                                    providing better service, improving our website, and fulfilling your orders.
                              </p>
                              <p className="text-gray-600">
                                    We do not share or sell your personal information to third parties except
                                    as required by law or with your consent. By using our services, you agree
                                    to the terms of this Privacy Policy.
                              </p>
                        </section>

                        {/* Terms & Conditions Section */}
                        <section id="terms" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Terms & Conditions</h2>
                              <p className="text-gray-600">
                                    By accessing and using our website, you agree to comply with the following
                                    terms and conditions. You must not use our website for any illegal or
                                    unauthorized purpose.
                              </p>
                              <p className="text-gray-600">
                                    All products and services are subject to availability and we reserve the
                                    right to modify, suspend, or discontinue any part of the website without
                                    notice. Misuse of our website may result in restricted access or legal action.
                              </p>
                        </section>

                        {/* Shipping Policy Section */}
                        <section id="shipping" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Shipping Policy</h2>
                              <p className="text-gray-600">
                                    We strive to process and ship your orders within 2-5 business days.
                                    Delivery times may vary depending on your location and the courier service used.
                              </p>
                              <p className="text-gray-600">
                                    Once your order has been shipped, you will receive a tracking number.
                                    We are not responsible for delays caused by courier services or customs
                                    processes for international deliveries.
                              </p>
                        </section>

                  </div>
            </div>
      );
};

export default PrivacyPolicy;
