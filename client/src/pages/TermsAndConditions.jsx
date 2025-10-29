import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TermsAndConditions = () => {
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
                        <h1 className="text-4xl font-bold text-center text-blue-600">
                              Terms and Conditions
                        </h1>
                        <p className="text-gray-600 text-center">
                              Please read these terms and conditions carefully before using our services.
                        </p>

                        {/* Terms and Conditions Section */}
                        <section id="terms" className="space-y-6">
                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
                                    <p className="text-gray-600">
                                          By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement.
                                          If you do not agree to abide by the above, please do not use this service.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">2. Use License</h2>
                                    <p className="text-gray-600">
                                          Permission is granted to temporarily download one copy of the materials on Voice of Rajkot's website for personal,
                                          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>modify or copy the materials</li>
                                          <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                                          <li>attempt to decompile or reverse engineer any software contained on the website</li>
                                          <li>remove any copyright or other proprietary notations from the materials</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">3. Event Registration and Participation</h2>
                                    <p className="text-gray-600">
                                          All event registrations are subject to availability and acceptance by Voice of Rajkot. We reserve the right to refuse
                                          registration or participation to any individual at our sole discretion.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>Registration fees are non-refundable and non-transferable</li>
                                          <li>Participants must adhere to event guidelines and code of conduct</li>
                                          <li>Original content only - plagiarism will result in disqualification</li>
                                          <li>Time limits and other event rules must be strictly followed</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">4. User Content and Conduct</h2>
                                    <p className="text-gray-600">
                                          Users are responsible for all content they submit, post, or display on our platform. You agree not to use our services to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                          <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, or offensive</li>
                                          <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
                                          <li>Upload, post, or transmit any content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights</li>
                                          <li>Upload, post, or transmit any unsolicited or unauthorized advertising, promotional materials, spam, or any other form of solicitation</li>
                                    </ul>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">5. Privacy Policy</h2>
                                    <p className="text-gray-600">
                                          Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website,
                                          to understand our practices regarding the collection and use of your personal information.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">6. Disclaimer</h2>
                                    <p className="text-gray-600">
                                          The materials on Voice of Rajkot's website are provided on an 'as is' basis. Voice of Rajkot makes no warranties,
                                          expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties
                                          or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">7. Limitations</h2>
                                    <p className="text-gray-600">
                                          In no event shall Voice of Rajkot or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                                          or due to business interruption) arising out of the use or inability to use the materials on Voice of Rajkot's website,
                                          even if Voice of Rajkot or its authorized representative has been notified orally or in writing of the possibility of such damage.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">8. Accuracy of Materials</h2>
                                    <p className="text-gray-600">
                                          The materials appearing on Voice of Rajkot's website could include technical, typographical, or photographic errors.
                                          Voice of Rajkot does not warrant that any of the materials on its website are accurate, complete, or current.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">9. Modifications</h2>
                                    <p className="text-gray-600">
                                          Voice of Rajkot may revise these terms of service for its website at any time without notice.
                                          By using this website, you are agreeing to be bound by the then current version of these terms of service.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">10. Governing Law</h2>
                                    <p className="text-gray-600">
                                          These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably
                                          submit to the exclusive jurisdiction of the courts in that State or location.
                                    </p>
                              </div>

                              <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
                                    <p className="text-gray-600">
                                          If you have any questions about these Terms and Conditions, please contact us through our Contact Us page.
                                    </p>
                              </div>
                        </section>

                  </div>
            </div>
      );
};

export default TermsAndConditions;