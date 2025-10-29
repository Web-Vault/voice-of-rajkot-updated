import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RefundPolicy = () => {
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
                        <h1 className="text-4xl font-bold text-center text-red-600">
                              Refund, Payment & Event Policy
                        </h1>
                        <p className="text-gray-600 text-center">
                              Please read these terms carefully before purchasing tickets or registering for our events.
                              By making a booking or payment, you agree to comply with all policies listed below.
                        </p>

                        {/* Booking Policy Section */}
                        <section id="booking-policy" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Booking Policy</h2>
                              <p className="text-gray-600">
                                    Bookings are accepted only through our official website or approved ticketing partners.
                                    Offline or unofficial bookings will not be honored.
                              </p>
                              <p className="text-gray-600">
                                    All bookings are subject to availability at the time of payment confirmation. Adding tickets
                                    to your cart without completing payment does not guarantee availability.
                              </p>
                              <p className="text-gray-600">
                                    Bookings close once all seats are sold or the booking deadline has passed, whichever comes first.
                                    We do not accept last-minute walk-ins unless explicitly announced by the organizers.
                              </p>
                              <p className="text-gray-600">
                                    The organizer reserves the right to refuse bookings at their discretion without the need to provide a reason.
                              </p>
                        </section>

                        {/* Payment Policy Section */}
                        <section id="payment-policy" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Payment Policy</h2>
                              <p className="text-gray-600">
                                    All payments are processed securely through authorized PCI-DSS compliant payment gateways.
                                    We accept credit/debit cards, UPI, net banking, and supported digital wallets.
                              </p>
                              <p className="text-gray-600">
                                    Your booking will be confirmed only after full payment is successfully processed. You will receive
                                    a confirmation email/SMS with your ticket or registration details.
                              </p>
                              <p className="text-gray-600">
                                    We do not store sensitive payment information on our servers. Transactions are encrypted
                                    and processed directly by our payment partners.
                              </p>
                              <p className="text-gray-600">
                                    Any fraudulent activity, including using stolen cards, unauthorized payment accounts, or chargeback abuse,
                                    will result in booking cancellation and may be reported to legal authorities.
                              </p>
                              <p className="text-gray-600">
                                    Payments must be made in full at the time of booking. Partial payments or “pay later” requests are not accepted.
                              </p>
                              <p className="text-gray-600">
                                    For international payments, currency conversion charges or international transaction fees may apply and are borne by the customer.
                              </p>
                        </section>

                        {/* Refund Policy Section */}
                        <section id="refund-policy" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Refund Policy</h2>
                              <p className="text-gray-600">
                                    All sales are <strong>final</strong>. Tickets and registrations are
                                    <strong> non-refundable and non-transferable</strong>, except in the following cases:
                              </p>
                              <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li>
                                          <strong>Event Cancellation:</strong> If the event is cancelled by the organizer,
                                          a full refund will be issued to the original payment method.
                                    </li>
                                    <li>
                                          <strong>Event Rescheduling:</strong> If you cannot attend the new date,
                                          you may request a refund within 5 days of the announcement.
                                    </li>
                                    <li>
                                          <strong>Duplicate or Failed Transactions:</strong> Excess or failed amounts
                                          will be refunded after verification.
                                    </li>
                                    <li>
                                          <strong>Force Majeure:</strong> If the event is cancelled due to circumstances
                                          beyond our control (natural disasters, government restrictions, etc.), refunds
                                          will be at the organizer’s discretion.
                                    </li>
                              </ul>
                              <p className="text-gray-600">
                                    Refunds will be processed within <strong>7–10 business days</strong>.
                                    Payment gateway transaction fees, where applicable, may be deducted.
                              </p>
                              <p className="text-gray-600">
                                    No refunds will be issued for no-shows, late arrivals, or removal due to rule violations.
                              </p>
                              <p className="text-gray-600">
                                    Refund requests must be made via our official email: <strong>support@yourwebsite.com</strong>.
                              </p>
                        </section>

                        {/* Cancellation Policy Section */}
                        <section id="cancellation-policy" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Cancellation Policy</h2>
                              <p className="text-gray-600">
                                    Tickets cannot be cancelled by the attendee except in cases of event cancellation
                                    or rescheduling as described above.
                              </p>
                              <p className="text-gray-600">
                                    Ticket transfers require written approval from the organizer at least 72 hours before the event.
                              </p>
                        </section>

                        {/* Dispute Resolution Section */}
                        <section id="dispute-policy" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Dispute Resolution</h2>
                              <p className="text-gray-600">
                                    For any payment or booking disputes, contact us first at
                                    <strong> support@yourwebsite.com</strong> before initiating a chargeback.
                              </p>
                              <p className="text-gray-600">
                                    Unauthorized chargebacks may result in permanent suspension from future bookings
                                    and recovery of related legal/processing costs.
                              </p>
                        </section>

                        {/* Event Rules Section */}
                        <section id="event-rules" className="space-y-4">
                              <h2 className="text-2xl font-semibold text-gray-800">Event Registration & Participation Rules</h2>
                              <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li><strong>Registration:</strong> Mandatory for both participants (₹150) and audience (₹100).</li>
                                    <li><strong>Original Work:</strong> Only self-created performances allowed; plagiarism is prohibited.</li>
                                    <li><strong>Time Limit:</strong> 5 minutes per participant.</li>
                                    <li><strong>Dress Code:</strong> Avoid white clothing; dress modestly.</li>
                                    <li><strong>Respectful Conduct:</strong> No abusive language or content targeting religion, caste, politics, or individuals.</li>
                                    <li><strong>Prohibited Conduct:</strong> Harassment, intoxication, or illegal activities result in removal without refund.</li>
                                    <li><strong>Mobile Usage:</strong> Keep phones silent during the event.</li>
                                    <li>
                                          <strong>Video & Content Policy:</strong>
                                          <ul className="list-disc list-inside ml-6">
                                                <li>No full recordings by attendees.</li>
                                                <li>Short clips allowed for personal memories.</li>
                                                <li>Only organizers can upload official content.</li>
                                                <li>Event recordings may be used for promotion.</li>
                                          </ul>
                                    </li>
                                    <li><strong>Health & Safety:</strong> Follow venue safety protocols and health guidelines.</li>
                                    <li><strong>Exit Policy:</strong> No early exits except in emergencies.</li>
                                    <li><strong>Behaviour:</strong> Misconduct may result in removal without refund.</li>
                              </ul>
                        </section>

                  </div>
            </div>
      );
};

export default RefundPolicy;
