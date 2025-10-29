import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ShippingPolicy = () => {
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

                        {/* Page Title */}
                        <h1 className="text-4xl font-bold text-center text-green-600">
                              Shipping Policy
                        </h1>
                        <p className="text-gray-600 text-center">
                              Information about our shipping and delivery processes for merchandise and event materials.
                        </p>

                        {/* Shipping Policy Section */}
                        <section id="shipping" className="space-y-6">
                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">1. General Shipping Information</h2>
                                    <p className="text-gray-600">
                                          Voice of Rajkot provides shipping services for merchandise, event materials, and promotional items.
                                          We strive to process and ship your orders within 2-5 business days from the date of purchase confirmation.
                                    </p>
                                    <p className="text-gray-600">
                                          Delivery times may vary depending on your location, the courier service used, and external factors
                                          such as weather conditions or local holidays.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">2. Shipping Methods and Timeframes</h2>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                          <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Shipping Options:</h3>
                                          <ul className="list-disc list-inside space-y-2 text-gray-600">
                                                <li><strong>Standard Delivery:</strong> 5-7 business days within India</li>
                                                <li><strong>Express Delivery:</strong> 2-3 business days within major cities</li>
                                                <li><strong>Same Day Delivery:</strong> Available in Rajkot and surrounding areas (subject to availability)</li>
                                                <li><strong>Event Material Pickup:</strong> Available at event venues for registered participants</li>
                                          </ul>
                                    </div>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">3. Shipping Charges</h2>
                                    <p className="text-gray-600">
                                          Shipping charges are calculated based on the weight, dimensions, and destination of your order.
                                          The exact shipping cost will be displayed at checkout before you complete your purchase.
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                          <h3 className="text-lg font-semibold text-blue-700 mb-2">Free Shipping:</h3>
                                          <ul className="list-disc list-inside space-y-1 text-blue-600">
                                                <li>Orders above ₹500 within Rajkot</li>
                                                <li>Orders above ₹1000 within Gujarat</li>
                                                <li>Event merchandise for registered participants</li>
                                          </ul>
                                    </div>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">4. Order Processing</h2>
                                    <p className="text-gray-600">
                                          Orders are processed Monday through Friday, excluding public holidays. Orders placed on weekends
                                          or holidays will be processed on the next business day.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>Order confirmation will be sent via email within 24 hours</li>
                                          <li>Processing time: 1-3 business days</li>
                                          <li>Shipping notification with tracking details will be provided once the order is dispatched</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">5. Tracking Your Order</h2>
                                    <p className="text-gray-600">
                                          Once your order has been shipped, you will receive a tracking number via email and SMS.
                                          You can use this tracking number to monitor the progress of your shipment on our website or
                                          the courier partner's tracking portal.
                                    </p>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                          <p className="text-yellow-700">
                                                <strong>Note:</strong> Tracking information may take 24-48 hours to become active after dispatch.
                                          </p>
                                    </div>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">6. Delivery Areas</h2>
                                    <p className="text-gray-600">
                                          We currently provide shipping services to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>All major cities and towns in Gujarat</li>
                                          <li>Metro cities across India (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad)</li>
                                          <li>Tier 2 and Tier 3 cities (delivery time may vary)</li>
                                          <li>Rural areas (subject to courier serviceability)</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">7. Delivery Attempts and Failed Deliveries</h2>
                                    <p className="text-gray-600">
                                          Our courier partners will make up to 3 delivery attempts. If delivery fails after 3 attempts,
                                          the package will be returned to our warehouse.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>Ensure someone is available to receive the package during business hours</li>
                                          <li>Provide accurate and complete delivery address</li>
                                          <li>Keep your phone accessible for delivery coordination</li>
                                          <li>Packages returned due to failed delivery may incur re-shipping charges</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">8. Damaged or Lost Packages</h2>
                                    <p className="text-gray-600">
                                          We take great care in packaging your orders. However, if you receive a damaged package or
                                          if your package is lost during transit:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>Report the issue within 48 hours of delivery</li>
                                          <li>Provide photos of the damaged package and contents</li>
                                          <li>We will investigate with our courier partner and provide a resolution</li>
                                          <li>Replacement or refund will be processed based on investigation results</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">9. International Shipping</h2>
                                    <p className="text-gray-600">
                                          Currently, we do not offer international shipping. Our services are limited to addresses within India only.
                                          We are working to expand our shipping capabilities and will update this policy when international shipping becomes available.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">10. Special Event Shipping</h2>
                                    <p className="text-gray-600">
                                          For event-related merchandise and materials:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>Event tickets are delivered digitally via email</li>
                                          <li>Physical event materials can be collected at the venue</li>
                                          <li>Commemorative items are shipped post-event</li>
                                          <li>Rush delivery available for urgent event materials (additional charges apply)</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">Contact for Shipping Queries</h2>
                                    <p className="text-gray-600">
                                          For any shipping-related questions or concerns, please contact our customer support team through our Contact Us page.
                                          We are here to help ensure your orders reach you safely and on time.
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                          <p className="text-gray-700">
                                                <strong>Customer Support Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST
                                          </p>
                                    </div>
                              </div>
                        </section>

                  </div>
            </div>
      );
};

export default ShippingPolicy;